
import React, { useState } from 'react';
import { MenuIcon, CloseIcon, ShoppingCart } from './icons';
import { View } from '../App';

const navLinks: { id: View, label: string }[] = [
  { id: 'drum_kits', label: 'Sound Kits' },
  { id: 'producers', label: 'Producer' },
  { id: 'pricing', label: 'Pricing' },
];

interface HeaderProps {
    onNavigate: (view: View) => void;
    cartCount: number;
    onToggleCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, cartCount, onToggleCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Desktop: Nav Links + Cart - Centro */}
          <div className="hidden md:flex items-center w-full">
            <div className="flex-1"></div>
            <div className="flex items-center gap-8">
              <button onClick={() => onNavigate('store')} className="text-green-400 hover:text-green-300 transition-colors text-xs font-bold font-mono uppercase tracking-widest hover:drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                Home
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
              <button onClick={onToggleCart} className="text-green-400 hover:text-green-300 transition-colors relative hover:drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-purple-600 text-white text-[9px] font-bold font-mono w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>
                )}
              </button>
            </div>
            <div className="flex-1"></div>
          </div>

          {/* Mobile: Hamburger + Cart */}
          <div className="flex md:hidden items-center w-full">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-green-400 hover:text-green-300 p-2 flex-shrink-0">
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
            <div className="flex-1"></div>
            <button onClick={onToggleCart} className="text-green-400 hover:text-green-300 p-2 flex-shrink-0 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-0.5 bg-purple-600 text-white text-[9px] font-bold font-mono w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>
              )}
            </button>
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
