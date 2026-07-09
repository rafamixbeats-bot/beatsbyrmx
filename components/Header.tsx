
import React from 'react';
import { SearchIcon } from './icons';
import { View } from '../App';

const navLinks: { id: View, label: string }[] = [
  { id: 'store', label: 'Explore' },
  { id: 'drum_kits', label: 'Sound Kits' },
  { id: 'pricing', label: 'Pricing' },
];

interface HeaderProps {
    onNavigate: (view: View) => void;
    onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onSearch }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo - Esquerda */}
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('store')} className="focus:outline-none group" aria-label="Página Inicial RMXBEATS">
              <img src="/logo-rmx-transparent.png" alt="RMX" className="h-16 w-auto object-contain group-hover:opacity-80 transition-opacity" />
            </button>
          </div>

          {/* Nav Links - Centro */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="text-green-400 hover:text-green-300 transition-colors text-xs font-bold font-mono uppercase tracking-widest hover:drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Search - Direita */}
          <div className="flex-shrink-0 flex items-center gap-6">
             {/* Search Bar Lab Style (Mini Version) */}
             <div className="relative group hidden sm:block w-64">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-green-500/20 rounded-sm blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                
                <div className="relative flex items-center bg-black/80 border border-green-500/30 rounded-sm py-1.5 px-3 backdrop-blur-sm transition-colors group-focus-within:border-green-500/60">
                    <span className="text-green-500 mr-2 animate-pulse font-mono font-bold select-none text-xs">{'>'}</span>
                    <input
                        type="text"
                        placeholder=""
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-green-400 placeholder-green-800/60 font-mono text-xs tracking-widest uppercase focus:ring-0"
                        autoComplete="off"
                    />
                    <SearchIcon className="w-3 h-3 text-green-600/80" />
                </div>
                
                {/* Decorative corners */}
                <div className="absolute -bottom-px -left-px w-1.5 h-1.5 border-l border-b border-green-500/60"></div>
                <div className="absolute -top-px -right-px w-1.5 h-1.5 border-r border-t border-green-500/60"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
