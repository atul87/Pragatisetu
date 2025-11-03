import React, { useContext, useState } from 'react';
import Card from '../common/Card';
import CategoryIcon from '../common/Icon';
import MapComponent from '../common/MapComponent';
import { AppContext } from '../../App';
import { T } from '../../constants';
import { Issue, IssueStatus, STATUSES } from '../../types';

interface TrackIssuesProps {
    issues: Issue[];
}

const getStatusColor = (status: IssueStatus) => {
    switch (status) {
        case 'Submitted': return 'bg-gray-500';
        case 'Acknowledged': return 'bg-blue-500';
        case 'In Progress': return 'bg-yellow-500';
        case 'Resolved': return 'bg-green-500';
        case 'Rejected': return 'bg-red-500';
    }
};

const IssueCard: React.FC<{ issue: Issue }> = ({ issue }) => {
    const { language } = useContext(AppContext);
    const currentStatusIndex = STATUSES.indexOf(issue.status);

    return (
        <Card className="mb-4 hover:shadow-xl hover:scale-[1.01]">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                    <img src={issue.imageUrl} alt={issue.title} className="rounded-lg object-cover w-full h-48" />
                </div>
                <div className="w-full md:w-2/3">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <CategoryIcon category={issue.category} className="mr-2" /> {issue.category}
                            </span>
                            <h3 className="text-xl font-bold mt-1">{issue.title}</h3>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(issue.status)}`}>
                            {issue.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{issue.description}</p>
                    <div className="text-xs text-gray-400 mt-2">
                        <i className="fas fa-map-marker-alt mr-1"></i> {issue.location.address}
                        <span className="mx-2">|</span>
                        <i className="fas fa-calendar-alt mr-1"></i> {new Date(issue.submittedDate).toLocaleDateString()}
                    </div>
                    
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2">{T.status[language]} Progress</h4>
                        <div className="flex items-center">
                            {STATUSES.slice(0, 4).map((status, index) => (
                                <React.Fragment key={status}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${index <= currentStatusIndex ? getStatusColor(status) : 'bg-gray-300 dark:bg-gray-600'}`}>
                                            {index <= currentStatusIndex && <i className="fas fa-check text-white text-xs"></i>}
                                        </div>
                                        <span className={`mt-1 text-xs ${index <= currentStatusIndex ? 'font-semibold' : 'text-gray-500'}`}>{status}</span>
                                    </div>
                                    {index < STATUSES.slice(0, 4).length - 1 && (
                                        <div className={`flex-1 h-1 mx-2 ${index < currentStatusIndex ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const TrackIssues: React.FC<TrackIssuesProps> = ({ issues }) => {
    const { language } = useContext(AppContext);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const handleMarkerClick = (issueId: string) => {
        const element = document.getElementById(`issue-${issueId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const cardElement = element.firstChild as HTMLElement;
            if(cardElement) {
                cardElement.classList.add('ring-2', 'ring-offset-2', 'ring-primary-500', 'dark:ring-offset-gray-900');
                setTimeout(() => {
                    cardElement.classList.remove('ring-2', 'ring-offset-2', 'ring-primary-500', 'dark:ring-offset-gray-900');
                }, 2500);
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold">{T.my_reported_issues[language]}</h2>
                <div className="flex items-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg self-start sm:self-center">
                    <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                        <i className="fas fa-list"></i> List
                    </button>
                    <button onClick={() => setViewMode('map')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                       <i className="fas fa-map"></i> Map
                    </button>
                </div>
            </div>

            {viewMode === 'map' && (
                <div className="mb-6 animate-fade-in">
                    <MapComponent 
                        issues={issues} 
                        height="450px" 
                        markerStyle="priority"
                        onMarkerClick={handleMarkerClick}
                    />
                </div>
            )}
            
            <div className="space-y-4">
                {issues.map(issue => (
                    <div key={issue.id} id={`issue-${issue.id}`}>
                        <IssueCard issue={issue} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrackIssues;