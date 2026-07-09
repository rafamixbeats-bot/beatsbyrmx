
import React, { useState } from 'react';
import { MenuIcon, CloseIcon } from './icons';
import { View } from '../App';

const navLinks: { id: View, label: string }[] = [
  { id: 'store', label: 'Explore' },
  { id: 'drum_kits', label: 'Sound Kits' },
  { id: 'pricing', label: 'Pricing' },
];

interface HeaderProps {
    onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
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
