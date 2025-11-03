import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../App';
import { Issue, IssueStatus, STATUSES, CATEGORIES, IssueCategory } from '../../types';
import MapComponent from '../common/MapComponent';
import Card from '../common/Card';

const MapView: React.FC = () => {
    const { issues } = useContext(AppContext);
    const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
    const [filterCategory, setFilterCategory] = useState<IssueCategory | 'all'>('all');
    const [mapMode, setMapMode] = useState<'markers' | 'heatmap'>('markers');

    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
            const categoryMatch = filterCategory === 'all' || issue.category === filterCategory;
            return statusMatch && categoryMatch;
        });
    }, [issues, filterStatus, filterCategory]);

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-2xl font-bold">Issues Map View</h2>
                 <div className="flex items-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg self-start sm:self-center">
                    <button onClick={() => setMapMode('markers')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${mapMode === 'markers' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                        <i className="fas fa-map-marker-alt"></i> Markers
                    </button>
                    <button onClick={() => setMapMode('heatmap')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${mapMode === 'heatmap' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                       <i className="fas fa-fire"></i> Heatmap
                    </button>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'all')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="all">All Statuses</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category</label>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as IssueCategory | 'all')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="all">All Categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="w-full h-[65vh] animate-fade-in">
                 <MapComponent 
                    issues={filteredIssues} 
                    height="100%" 
                    markerStyle="status"
                    showHeatmap={mapMode === 'heatmap'}
                />
            </div>
        </Card>
    );
};

export default MapView;
