
import React from 'react';
import { View } from '../App';
import { Settings } from './icons';

interface FooterProps {
    onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-black border-t border-green-900/30 mt-auto pb-32 pt-10 relative overflow-hidden">
      {/* Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-6">
             
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span>
                <p className="text-green-800 font-mono uppercase tracking-widest">
                    &copy; RMX {currentYear}. TODOS OS DIREITOS RESERVADOS.
                </p>
             </div>

             <div className="flex items-center gap-8">
                <a href="#" className="text-green-800 hover:text-green-400 transition-colors font-mono uppercase tracking-wider">TERMS_OF_SERVICE</a>
                <a href="#" className="text-green-800 hover:text-green-400 transition-colors font-mono uppercase tracking-wider">PRIVACY_POLICY</a>
                <button 
                    onClick={onAdminClick} 
                    className="flex items-center gap-2 text-green-900 hover:text-green-500 transition-colors border border-green-900/30 hover:border-green-500/50 px-3 py-1.5 rounded-sm"
                >
                    <Settings className="w-3 h-3" />
                    <span className="font-mono uppercase tracking-widest text-[10px]">ADMIN_LOGIN</span>
                </button>
             </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;