
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import Card from '../common/Card';
import { T } from '../../constants';
import { CitizenView } from '../../types';

interface CitizenDashboardProps {
    setView: (view: CitizenView) => void;
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ setView }) => {
    const { issues, user, language } = useContext(AppContext);

    const userIssues = issues.filter(issue => issue.submittedBy === 'Amit Kumar'); // Mocked user
    const resolvedCount = userIssues.filter(i => i.status === 'Resolved').length;
    const points = resolvedCount * 10 + userIssues.length * 5;

    const QuickActionCard: React.FC<{ icon: string; title: string; subtitle: string; onClick: () => void; color: string }> = ({ icon, title, subtitle, onClick, color }) => (
        <div onClick={onClick} className={`p-6 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${color}`}>
            <div className="flex items-center">
                <i className={`fas ${icon} text-3xl text-white`}></i>
                <div className="ml-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-sm text-white opacity-90">{subtitle}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, {user?.name}!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <QuickActionCard 
                    icon="fa-plus-circle"
                    title={T.report_issue[language]}
                    subtitle="Submit a new civic problem"
                    onClick={() => setView('report-issue')}
                    color="bg-gradient-to-r from-primary-500 to-primary-600"
                 />
                 <QuickActionCard 
                    icon="fa-tasks"
                    title={T.track_reports[language]}
                    subtitle="Check the status of your reports"
                    onClick={() => setView('track-issues')}
                    color="bg-gradient-to-r from-secondary-500 to-secondary-600"
                 />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <h3 className="font-bold text-lg mb-4">Your Impact</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                                <i className="fas fa-flag-checkered text-green-500 mr-3"></i>
                                <span className="font-medium">Issues Reported</span>
                            </div>
                            <span className="font-bold text-lg">{userIssues.length}</span>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                                <i className="fas fa-check-circle text-blue-500 mr-3"></i>
                                <span className="font-medium">Issues Resolved</span>
                            </div>
                            <span className="font-bold text-lg">{resolvedCount}</span>
                        </div>
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">Gamification</h3>
                    <div className="flex items-center space-x-6">
                        <div className="text-center">
                           <div className="relative w-24 h-24">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path className="text-gray-200 dark:text-gray-600"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-primary-500"
                                        strokeDasharray={`${(points % 100)}, 100`}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{points}</span>
                                </div>
                           </div>
                           <p className="font-semibold mt-2">Civic Points</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Your Badges</h4>
                            <div className="flex space-x-3">
                                <span title="First Report" className="text-3xl">🥇</span>
                                <span title="Community Helper" className="text-3xl">🤝</span>
                                {resolvedCount > 0 && <span title="Problem Solver" className="text-3xl">💡</span>}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CitizenDashboard;
