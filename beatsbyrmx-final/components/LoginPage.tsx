
import React, { useState } from 'react';
import Card from './ContactSection';
import { Users, LogOut } from './icons';

interface LoginPageProps {
    onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] relative z-50 px-4">
            <Card className="p-10 w-full max-w-sm animate-fade-in-up bg-black border border-green-900/40 shadow-[0_0_40px_rgba(34,197,94,0.05)] relative overflow-hidden">
                 {/* Background Scanline */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(18,255,100,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                 
                 {/* Tech Borders */}
                 <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-green-500/50"></div>
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-green-500/50"></div>

                <div className="text-center mb-10 relative z-10">
                     <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/10 rounded-sm mb-4 border border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                         <Users className="w-8 h-8 text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-green-400 font-mono uppercase tracking-[0.2em]">SYSTEM_LOGIN</h1>
                    <p className="text-green-800 text-xs mt-2 font-mono uppercase tracking-widest">AUTHENTICATION REQUIRED</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label htmlFor="username" className="block text-xs font-bold text-green-600 mb-2 font-mono uppercase tracking-widest">
                            USER_ID
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/80 border border-green-900/50 rounded-sm px-4 py-3 text-green-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition outline-none font-mono placeholder-green-900/30 text-sm"
                            placeholder="ADMIN"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-xs font-bold text-green-600 mb-2 font-mono uppercase tracking-widest">
                            PASSWORD_KEY
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/80 border border-green-900/50 rounded-sm px-4 py-3 text-green-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition outline-none font-mono placeholder-green-900/30 text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold font-mono uppercase tracking-widest py-4 px-4 rounded-sm transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] border border-green-400"
                        >
                            {">> ACCESS_DASHBOARD"}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
