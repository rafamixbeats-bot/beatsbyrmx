
import React from 'react';
import { Link } from 'react-router-dom';

const marqueeItems = [
  'PRODUÇÃO DE ALTA QUALIDADE',
  'MIX E MASTER PROFISSIONAL',
  'DOWNLOAD INSTANTÂNEO',
  'PAGAMENTO SEGURO',
  'LICENCIAMENTO EXCLUSIVO',
  'ENTREGA RÁPIDA',
];

const MarqueeTicker: React.FC = () => {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full overflow-hidden border-t border-b border-green-900/30 bg-black py-3 relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10"></div>
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, idx) => (
          <span key={idx} className="flex items-center mx-6 text-[10px] font-mono text-green-600 tracking-[0.3em] uppercase flex-shrink-0">
            <span className="text-green-400 mr-3 text-xs drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]">✔</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-black border-t border-green-900/30 mt-auto pb-32 pt-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

      <MarqueeTicker />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-6">
             
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span>
                <p className="text-green-800 font-mono uppercase tracking-widest">
                    &copy; RMX {currentYear}. TODOS OS DIREITOS RESERVADOS.
                </p>
             </div>

             <div className="flex items-center gap-8">
                <Link to="/terms" className="text-green-800 hover:text-green-400 transition-colors font-mono uppercase tracking-wider">TERMS_OF_SERVICE</Link>
                <Link to="/privacy" className="text-green-800 hover:text-green-400 transition-colors font-mono uppercase tracking-wider">PRIVACY_POLICY</Link>
             </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
