import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../App';
import Card from '../common/Card';
import { T } from '../../constants';
import { CitizenView, IssueCategory, Priority } from '../../types';
import { analyzeIssueWithAI } from '../../services/geminiService';

// SpeechRecognition API interfaces
interface SpeechRecognitionEvent extends Event { readonly results: SpeechRecognitionResultList; }
interface SpeechRecognitionResultList { readonly length: number; item(index: number): SpeechRecognitionResult;[index: number]: SpeechRecognitionResult; }
interface SpeechRecognitionResult { readonly isFinal: boolean; readonly length: number; item(index: number): SpeechRecognitionAlternative;[index: number]: SpeechRecognitionAlternative; }
interface SpeechRecognitionAlternative { readonly transcript: string; }
interface SpeechRecognitionErrorEvent extends Event { readonly error: string; }
interface SpeechRecognition extends EventTarget { continuous: boolean; lang: string; interimResults: boolean; onresult: (event: SpeechRecognitionEvent) => void; onerror: (event: SpeechRecognitionErrorEvent) => void; onend: () => void; start(): void; stop(): void; }
declare global { interface Window { SpeechRecognition: new () => SpeechRecognition; webkitSpeechRecognition: new () => SpeechRecognition; } }

interface ReportIssueProps { setView: (view: CitizenView) => void; }

const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = ["Describe", "Details", "AI Review", "Submit"];
    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${currentStep > index ? 'bg-green-500' : currentStep === index + 1 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                            {currentStep > index ? <i className="fas fa-check"></i> : index + 1}
                        </div>
                        <p className={`mt-2 text-xs font-semibold ${currentStep >= index + 1 ? 'text-primary-600 dark:text-primary-300' : 'text-gray-500'}`}>{step}</p>
                    </div>
                    {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

const ReportIssue: React.FC<ReportIssueProps> = ({ setView }) => {
    const { addIssue, user, geminiAI, language } = useContext(AppContext);
    
    // Form State
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<{ category: IssueCategory; priority: Priority; enhancedDescription: string } | null>(null);

    // UI State
    const [step, setStep] = useState(1);
    const [isListening, setIsListening] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
            recognitionRef.current.interimResults = false;
            recognitionRef.current.onresult = (event) => { setDescription(event.results[0][0].transcript); setIsListening(false); };
            recognitionRef.current.onerror = (event) => { console.error('Speech recognition error', event.error); setIsListening(false); };
            recognitionRef.current.onend = () => { setIsListening(false); };
        }
    }, [language]);
    
    useEffect(() => { setAiAnalysis(null); }, [description]);
    
    const handleVoiceInput = () => {
        if (recognitionRef.current) { isListening ? recognitionRef.current.stop() : recognitionRef.current.start(); setIsListening(!isListening); }
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
            setUploadedImageUrl('');
            setIsUploading(true);
            setTimeout(() => {
                const cloudUrl = `https://picsum.photos/seed/${file.name}/${600}/${400}`;
                setUploadedImageUrl(cloudUrl);
                setIsUploading(false);
            }, 1500);
        }
    };

    const handleGetLocation = () => {
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({ lat: position.coords.latitude, lng: position.coords.longitude, address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}` });
                setIsGettingLocation(false);
            },
            (error) => { console.error("Error getting location", error); setIsGettingLocation(false); }
        );
    };

    const handleAnalyzeClick = async () => {
        if (!geminiAI || !description.trim()) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeIssueWithAI(geminiAI, description);
            setAiAnalysis(result);
        } catch (error) { console.error("AI analysis failed", error); } 
        finally { setIsAnalyzing(false); }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const newIssue = {
            id: `JH${Date.now()}`,
            title: aiAnalysis!.enhancedDescription.split('. ')[0] || description.substring(0, 50),
            description: aiAnalysis!.enhancedDescription,
            category: aiAnalysis!.category,
            status: 'Submitted' as const,
            priority: aiAnalysis!.priority,
            location: location!,
            imageUrl: uploadedImageUrl || `https://picsum.photos/seed/${Date.now()}/600/400`,
            submittedBy: user?.name || 'Anonymous',
            submittedDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            upvotes: 0,
        };
        addIssue(newIssue);
        setIsSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => { setView('track-issues'); }, 3000);
    };

    if (showSuccess) {
        return (
            <div className="text-center p-10 animate-fade-in">
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check-circle text-5xl text-green-500"></i>
                </div>
                <h2 className="mt-6 text-2xl font-bold">Report Submitted Successfully!</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Your issue has been recorded. You will be redirected shortly.</p>
            </div>
        )
    }

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-center">{T.new_issue_report[language]}</h2>
            <Stepper currentStep={step} />
            
            {step === 1 && (
                <div className="animate-fade-in">
                    <h3 className="font-semibold mb-2">1. Describe the issue</h3>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={T.describe_issue[language]} className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:outline-none" rows={6} required />
                     <button type="button" onClick={handleVoiceInput} className="flex items-center justify-center w-full px-4 py-2 mt-4 text-white bg-secondary-500 rounded-lg hover:bg-secondary-600 transition-colors disabled:bg-gray-400">
                        <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'} mr-2`}></i>
                        {isListening ? T.listening[language] : T.use_voice[language]}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="animate-fade-in space-y-4">
                    <h3 className="font-semibold">2. Add supporting details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                            <label className={`flex flex-col items-center justify-center w-full h-full text-center p-4 border-2 border-dashed rounded-lg ${isUploading ? 'border-blue-400 cursor-not-allowed' : 'hover:border-blue-600 cursor-pointer border-gray-300 dark:border-gray-600'}`}>
                                <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-camera'} text-3xl mb-2 text-gray-400`}></i>
                                <span className="text-sm font-semibold">{isUploading ? 'Uploading...' : T.upload_photo[language]}</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isUploading} />
                            </label>
                            {imageUrl && <img src={imageUrl} alt="Issue preview" className="rounded-lg mt-4 max-h-40 mx-auto" />}
                        </div>
                        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 flex flex-col items-center justify-center">
                            <button type="button" onClick={handleGetLocation} disabled={isGettingLocation || !!location} className="flex flex-col items-center justify-center px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                <i className="fas fa-map-marker-alt text-3xl mb-2"></i>
                                {isGettingLocation ? T.getting_location[language] : (location ? "Location Captured" : T.get_location[language])}
                            </button>
                             {location && <p className="text-sm text-green-600 dark:text-green-400 mt-4 flex items-center text-center"><i className="fas fa-check-circle mr-2"></i>Location captured:<br />{location.address}</p>}
                        </div>
                    </div>
                </div>
            )}
            
            {step === 3 && (
                <div className="animate-fade-in text-center">
                    <h3 className="font-semibold mb-4">3. Analyze with AI for faster processing</h3>
                    <button type="button" onClick={handleAnalyzeClick} disabled={!description.trim() || isAnalyzing} className="flex items-center justify-center w-1/2 mx-auto px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 font-semibold">
                         {isAnalyzing ? <><i className="fas fa-spinner fa-spin mr-2"></i> Analyzing...</> : <><i className="fas fa-magic mr-2"></i> {T.ai_analysis[language]}</>}
                    </button>
                    {aiAnalysis && (
                        <div className="mt-6 p-4 border-l-4 border-primary-500 bg-primary-50 dark:bg-gray-700 rounded-r-lg text-left">
                            <h3 className="text-lg font-bold text-primary-800 dark:text-primary-200 mb-3">{T.ai_analysis[language]}</h3>
                            <div className="space-y-3 text-sm">
                                <div><strong className="text-gray-700 dark:text-gray-300">{T.suggested_category[language]}:</strong> <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 rounded-full dark:bg-primary-900 dark:text-primary-200">{aiAnalysis.category}</span></div>
                                <div><strong className="text-gray-700 dark:text-gray-300">{T.suggested_priority[language]}:</strong><span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${aiAnalysis.priority === 'High' ? 'bg-red-500' : aiAnalysis.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>{aiAnalysis.priority}</span></div>
                                <div><strong className="block mb-1 text-gray-700 dark:text-gray-300">{T.enhanced_description[language]}:</strong><p className="p-3 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200">{aiAnalysis.enhancedDescription}</p></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === 4 && (
                <div className="animate-fade-in">
                    <h3 className="font-semibold mb-4 text-center">4. Confirm and Submit</h3>
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 space-y-2 text-sm">
                        <p><strong>Description:</strong> {aiAnalysis?.enhancedDescription}</p>
                        <p><strong>Category:</strong> {aiAnalysis?.category}</p>
                        <p><strong>Priority:</strong> {aiAnalysis?.priority}</p>
                        <p><strong>Location:</strong> {location?.address}</p>
                        {imageUrl && <img src={imageUrl} alt="preview" className="max-h-32 rounded mt-2"/>}
                    </div>
                </div>
            )}
            
            <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setStep(step - 1)} disabled={step === 1} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                {step < 4 ? (
                    <button type="button" onClick={() => setStep(step + 1)} disabled={(step === 1 && !description) || (step === 2 && (!location || !uploadedImageUrl)) || (step === 3 && !aiAnalysis)} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed">Next</button>
                ) : (
                    <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300">{isSubmitting ? 'Submitting...' : 'Submit Report'}</button>
                )}
            </div>
        </Card>
    );
};

export default ReportIssue;