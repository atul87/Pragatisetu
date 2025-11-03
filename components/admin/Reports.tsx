
import React from 'react';
import Card from '../common/Card';

const Reports: React.FC = () => {
    const handleExport = (format: 'CSV' | 'PDF') => {
        alert(`Exporting all issues as ${format}. This is a demo feature.`);
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Generate Reports</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
                Generate comprehensive reports on civic issues for analysis and record-keeping. Select a format to download the complete issue dataset.
            </p>
            <div className="flex space-x-4">
                <button 
                    onClick={() => handleExport('CSV')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <i className="fas fa-file-csv mr-2"></i> Export as CSV
                </button>
                <button 
                    onClick={() => handleExport('PDF')}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <i className="fas fa-file-pdf mr-2"></i> Export as PDF
                </button>
            </div>
            <div className="mt-8 p-4 border-l-4 border-primary-500 bg-primary-50 dark:bg-gray-700">
                <h4 className="font-bold text-primary-800 dark:text-primary-200">Future Enhancements</h4>
                <ul className="list-disc list-inside mt-2 text-sm text-primary-700 dark:text-primary-300">
                    <li>Date range filtering for reports.</li>
                    <li>Customizable report columns.</li>
                    <li>Scheduled report generation and email delivery.</li>
                    <li>Department-wise performance reports.</li>
                </ul>
            </div>
        </Card>
    );
};

export default Reports;
