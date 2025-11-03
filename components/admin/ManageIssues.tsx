import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../App';
import { Issue, IssueStatus, STATUSES, CATEGORIES, IssueCategory } from '../../types';

const ManageIssues: React.FC = () => {
    const { issues, updateIssueStatus } = useContext(AppContext);
    const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');
    const [filterCategory, setFilterCategory] = useState<IssueCategory | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
            const categoryMatch = filterCategory === 'all' || issue.category === filterCategory;
            
            const searchTermLower = searchTerm.toLowerCase();
            const searchMatch = searchTerm === '' || 
                                issue.title.toLowerCase().includes(searchTermLower) ||
                                issue.description.toLowerCase().includes(searchTermLower);

            const issueDate = new Date(issue.submittedDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            
            if (start) {
                start.setHours(0, 0, 0, 0);
            }
            if (end) {
                end.setHours(23, 59, 59, 999);
            }

            const dateMatch = (!start || issueDate >= start) && (!end || issueDate <= end);

            return statusMatch && categoryMatch && searchMatch && dateMatch;
        });
    }, [issues, filterStatus, filterCategory, searchTerm, startDate, endDate]);

    const handleStatusChange = (id: string, newStatus: IssueStatus) => {
        updateIssueStatus(id, newStatus);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Issues</h2>
            
            <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg items-end">
                <div className="flex-grow min-w-[250px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search by Keyword</label>
                    <input
                        type="text"
                        placeholder="Filter by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'all')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="all">All</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as IssueCategory | 'all')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="all">All</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredIssues.map(issue => (
                            <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{issue.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate" title={issue.title}>{issue.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{issue.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${issue.priority === 'High' ? 'bg-red-100 text-red-800' : issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                        {issue.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    <select value={issue.status} onChange={(e) => handleStatusChange(issue.id, e.target.value as IssueStatus)} className="rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500">
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(issue.submittedDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredIssues.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">No issues found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageIssues;