
import React, { useState } from 'react';
import { SearchIcon, MenuIcon, CloseIcon } from './icons';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Desktop: Logo + Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('store')} className="focus:outline-none group flex-shrink-0" aria-label="Página Inicial RMXBEATS">
              <img src="/logo-rmx-transparent.png" alt="RMX" className="h-16 w-auto object-contain group-hover:opacity-80 transition-opacity" />
            </button>
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

          {/* Mobile: Hamburger + Logo centrada */}
          <div className="flex md:hidden items-center flex-1">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-green-400 hover:text-green-300 p-2">
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
            <div className="flex-1 flex justify-center">
              <button onClick={() => onNavigate('store')} className="focus:outline-none group" aria-label="Página Inicial RMXBEATS">
                <img src="/logo-rmx-transparent.png" alt="RMX" className="h-12 w-auto object-contain group-hover:opacity-80 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Search - Direita (Desktop) */}
          <div className="hidden md:flex items-center flex-shrink-0 w-64 justify-end">
             <div className="relative group w-64">
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
                <div className="absolute -bottom-px -left-px w-1.5 h-1.5 border-l border-b border-green-500/60"></div>
                <div className="absolute -top-px -right-px w-1.5 h-1.5 border-r border-t border-green-500/60"></div>
            </div>
          </div>

          {/* Mobile: Search direita */}
          <div className="flex md:hidden items-center">
            <div className="relative group w-40">
                <div className="relative flex items-center bg-black/80 border border-green-500/30 rounded-sm py-1.5 px-2 backdrop-blur-sm">
                    <span className="text-green-500 mr-1 font-mono font-bold select-none text-xs">{'>'}</span>
                    <input
                        type="text"
                        placeholder=""
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-green-400 placeholder-green-800/60 font-mono text-xs tracking-widest uppercase focus:ring-0"
                        autoComplete="off"
                    />
                    <SearchIcon className="w-3 h-3 text-green-600/80" />
                </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-green-900/30 bg-black/95 backdrop-blur-md">
            <div className="py-3 px-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { onNavigate(link.id); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-green-400 hover:text-green-300 hover:bg-green-900/20 transition-colors text-sm font-bold font-mono uppercase tracking-widest py-3 px-3 rounded-sm"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
