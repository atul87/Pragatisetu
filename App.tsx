import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Issue, User, Language, Theme, View, UserRole } from './types';
import { MOCK_ISSUES, USER_ROLES } from './constants';
import LoginComponent from './components/LoginComponent';
import Header from './components/Header';
import CitizenDashboard from './components/citizen/CitizenDashboard';
import ReportIssue from './components/citizen/ReportIssue';
import TrackIssues from './components/citizen/TrackIssues';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageIssues from './components/admin/ManageIssues';
import MapView from './components/admin/MapView';
import Reports from './components/admin/Reports';

export const AppContext = React.createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    user: User | null;
    logout: () => void;
    issues: Issue[];
    addIssue: (issue: Issue) => void;
    updateIssueStatus: (id: string, status: Issue['status']) => void;
    geminiAI: GoogleGenAI | null;
}>({
    theme: 'light',
    setTheme: () => {},
    language: 'en',
    setLanguage: () => {},
    user: null,
    logout: () => {},
    issues: [],
    addIssue: () => {},
    updateIssueStatus: () => {},
    geminiAI: null,
});


const App: React.FC = () => {
    const [theme, setThemeState] = useState<Theme>('light');
    const [language, setLanguage] = useState<Language>('en');
    const [user, setUser] = useState<User | null>(null);
    const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);
    const [view, setView] = useState<View>('dashboard');

    const geminiAI = useMemo(() => {
        if (process.env.API_KEY) {
            return new GoogleGenAI({ apiKey: process.env.API_KEY });
        }
        return null;
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const handleLogin = (credentials: { id: string; role: UserRole }) => {
        const userData = USER_ROLES[credentials.role];
        setUser({
            id: credentials.id,
            name: userData.name,
            role: credentials.role,
            avatar: `https://i.pravatar.cc/150?u=${credentials.id}`,
        });
        setView('dashboard');
    };

    const logout = () => {
        setUser(null);
    };

    const addIssue = useCallback((issue: Issue) => {
        setIssues(prevIssues => [issue, ...prevIssues]);
    }, []);

    const updateIssueStatus = useCallback((id: string, status: Issue['status']) => {
        setIssues(prevIssues => prevIssues.map(issue => 
            issue.id === id ? { ...issue, status, lastUpdated: new Date().toISOString() } : issue
        ));
    }, []);

    const contextValue = useMemo(() => ({
        theme,
        setTheme,
        language,
        setLanguage,
        user,
        logout,
        issues,
        addIssue,
        updateIssueStatus,
        geminiAI,
    }), [theme, language, user, issues, addIssue, updateIssueStatus, geminiAI]);

    const renderCitizenView = () => {
        switch (view) {
            case 'dashboard':
                return <CitizenDashboard setView={setView} />;
            case 'report-issue':
                return <ReportIssue setView={setView} />;
            case 'track-issues':
                return <TrackIssues issues={issues} />;
            default:
                return <CitizenDashboard setView={setView} />;
        }
    };

    const renderAdminView = () => {
        switch (view) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'manage-issues':
                return <ManageIssues />;
            case 'map-view':
                return <MapView />;
            case 'reports':
                return <Reports />;
            default:
                return <AdminDashboard />;
        }
    };

    if (!user) {
        return <LoginComponent onLogin={handleLogin} />;
    }

    return (
        <AppContext.Provider value={contextValue}>
            <div className="min-h-screen text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
                <Header user={user} setView={setView} currentView={view} />
                <main className="p-4 sm:p-6 lg:p-8">
                    {user.role === 'citizen' ? renderCitizenView() : renderAdminView()}
                </main>
            </div>
        </AppContext.Provider>
    );
};

export default App;