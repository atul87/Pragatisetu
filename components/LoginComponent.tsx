
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginComponentProps {
    onLogin: (credentials: { id: string; role: UserRole }) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin }) => {
    const [isCitizen, setIsCitizen] = useState(true);
    const [phone, setPhone] = useState('+91-9876543210');
    const [password, setPassword] = useState('demo123');
    const [adminUser, setAdminUser] = useState('admin');
    const [adminPass, setAdminPass] = useState('admin123');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (isCitizen) {
            if (phone === '+91-9876543210' && password === 'demo123') {
                onLogin({ id: phone, role: 'citizen' });
            } else {
                setError('Invalid citizen credentials.');
            }
        } else {
            if (adminUser === 'admin' && adminPass === 'admin123') {
                onLogin({ id: adminUser, role: 'admin' });
            } else {
                setError('Invalid admin credentials.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
                <div className="text-center">
                     <i className="fas fa-landmark text-primary-600 text-5xl mb-4"></i>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Jharkhand Civic Connect</h2>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setIsCitizen(true)}
                        className={`w-1/2 py-4 text-center font-medium ${isCitizen ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                        Citizen
                    </button>
                    <button
                        onClick={() => setIsCitizen(false)}
                        className={`w-1/2 py-4 text-center font-medium ${!isCitizen ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                        Admin
                    </button>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {isCitizen ? (
                        <>
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide">Phone Number</label>
                                <input
                                    className="w-full text-base py-2 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500 bg-transparent"
                                    type="text"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="Enter +91-9876543210"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide">Password</label>
                                <input
                                    className="w-full text-base py-2 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500 bg-transparent"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter demo123"
                                />
                            </div>
                        </>
                    ) : (
                         <>
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide">Username</label>
                                <input
                                    className="w-full text-base py-2 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500 bg-transparent"
                                    type="text"
                                    value={adminUser}
                                    onChange={e => setAdminUser(e.target.value)}
                                    placeholder="Enter admin"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 tracking-wide">Password</label>
                                <input
                                    className="w-full text-base py-2 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-500 bg-transparent"
                                    type="password"
                                    value={adminPass}
                                    onChange={e => setAdminPass(e.target.value)}
                                    placeholder="Enter admin123"
                                />
                            </div>
                        </>
                    )}
                     {error && <p className="text-sm text-red-500">{error}</p>}
                    <div>
                        <button type="submit" className="w-full flex justify-center bg-primary-600 hover:bg-primary-700 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-300">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;

