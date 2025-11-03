import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AppContext } from '../../App';
import Card from '../common/Card';
import { T } from '../../constants';
import { CATEGORIES } from '../../types';

const AdminDashboard: React.FC = () => {
    const { issues, language, theme } = useContext(AppContext);

    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;
    const pendingIssues = totalIssues - resolvedIssues;
    const highPriorityIssues = issues.filter(i => i.priority === 'High' && i.status !== 'Resolved').length;

    const issuesByCategory = CATEGORIES.map(category => ({
        name: category,
        count: issues.filter(i => i.category === category).length,
    }));
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

    const StatCard = ({ title, value, icon, color, borderColor }: { title: string; value: string | number; icon: string; color: string; borderColor: string; }) => (
        <Card className={`relative overflow-hidden border-l-4 ${borderColor}`}>
            <div className="flex justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </div>
            <i className={`fas ${icon} absolute -right-4 -bottom-4 text-6xl opacity-10 ${color}`}></i>
        </Card>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">{T.dashboard[language]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={T.total_issues[language]} value={totalIssues} icon="fa-list-alt" color="text-blue-500" borderColor="border-blue-500" />
                <StatCard title={T.resolved[language]} value={resolvedIssues} icon="fa-check-circle" color="text-green-500" borderColor="border-green-500" />
                <StatCard title={T.pending[language]} value={pendingIssues} icon="fa-clock" color="text-yellow-500" borderColor="border-yellow-500" />
                <StatCard title={T.high_priority[language]} value={highPriorityIssues} icon="fa-exclamation-triangle" color="text-red-500" borderColor="border-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold mb-4">{T.issue_by_category[language]}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={issuesByCategory}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} stroke="currentColor" />
                            <YAxis stroke="currentColor"/>
                            {/* FIX: (line 53) Replaced invalid 'dark' property in Tooltip contentStyle with a theme-based conditional style. */}
                            <Tooltip cursor={{fill: 'rgba(128,128,128,0.1)'}} contentStyle={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }} />
                            <Legend />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="font-bold mb-4">{T.issue_by_category[language]}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                       <PieChart>
                            <Pie
                                data={issuesByCategory.filter(d => d.count > 0)}
                                dataKey="count"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                labelLine={false}
                                // FIX: (line 74) Replaced incorrect explicit type with 'any' for Pie label props to resolve type incompatibility with recharts' PieLabelRenderProps.
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                    return ( percent > 0.05 ? <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}> {`${(percent * 100).toFixed(0)}%`}</text> : null );
                                }}
                            >
                                {issuesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            {/* FIX: (line 83) Replaced invalid 'dark' property in Tooltip contentStyle with a theme-based conditional style. */}
                            <Tooltip contentStyle={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }} />
                            <Legend/>
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;