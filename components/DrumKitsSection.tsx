
import React from 'react';
import { DrumKit } from '../App';
import { ShoppingCart, Package, InfoIcon } from './icons';

interface DrumKitsSectionProps {
    drumKits: DrumKit[];
    onAddToCart: (kit: DrumKit) => void;
}

const DrumKitsSection: React.FC<DrumKitsSectionProps> = ({ drumKits, onAddToCart }) => {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono">
             {/* Header Section Lab Style */}
             <div className="container mx-auto px-4 pt-12 md:pt-16 pb-8 border-b border-green-900/30">
                <div className="flex items-center gap-2 mb-2 animate-fade-in">
                    <Package className="w-5 h-5 text-green-400" />
                    <span className="text-xs font-bold tracking-[0.3em] text-green-600 uppercase">System.Database.Kits</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-700 font-mono uppercase tracking-widest drop-shadow-[0_0_10px_rgba(74,222,128,0.2)] animate-fade-in">
                    ELEMENTS_DB
                </h1>
                <p className="mt-4 text-green-800/80 max-w-2xl text-xs md:text-sm uppercase tracking-widest border-l-2 border-green-500/50 pl-4 animate-fade-in-up">
                    Acesse nossa biblioteca de compostos sonoros. Alta pureza garantida para síntese musical.
                </p>
            </div>

            <div className="container mx-auto px-4 py-12">
                 {/* Grid Elements Style */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {drumKits.length > 0 ? (
                        drumKits.map((kit, index) => {
                             // Generate Atomic Symbol (First 2 chars)
                             const symbol = kit.title.substring(0, 2).toUpperCase();
                             // Use ID suffix for 'Atomic Number' look
                             const atomicNumber = (index + 1).toString().padStart(2, '0');
                             
                             return (
                                <div key={kit.id} className="group relative bg-black border border-green-900/40 hover:border-green-400 transition-all duration-300 rounded-sm overflow-hidden hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    
                                    {/* Top Info Bar */}
                                    <div className="flex justify-between items-center p-2 border-b border-green-900/30 bg-green-900/5 select-none">
                                        <span className="text-[10px] text-green-700 font-bold">{atomicNumber}</span>
                                        <span className="text-[10px] text-green-700 font-bold tracking-wider">SOLID STATE</span>
                                    </div>

                                    {/* Image / Specimen Area */}
                                    <div className="relative aspect-square overflow-hidden bg-black/50 border-b border-green-900/30 group-hover:border-green-500/50 transition-colors">
                                        {/* Main Image - Grayscale to Color */}
                                        <img 
                                            src={kit.artworkUrl} 
                                            alt={kit.title} 
                                            className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-110"
                                        />
                                        
                                        {/* Scanning Effect Overlay */}
                                        <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"></div>
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.8)] transform -translate-y-full group-hover:translate-y-[400px] transition-transform duration-[1.5s] ease-linear pointer-events-none"></div>

                                        {/* Atomic Symbol Overlay Box */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="bg-black/40 backdrop-blur-sm border border-green-500/30 w-24 h-24 flex items-center justify-center rounded-sm group-hover:bg-black/60 group-hover:border-green-400 transition-all duration-300">
                                                <span className="text-5xl font-bold text-green-500 group-hover:text-green-400 tracking-tighter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(74,222,128,0.6)] transition-all">
                                                    {symbol}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Tech Corner Markers */}
                                        <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-green-500/60 transition-all group-hover:w-4 group-hover:h-4"></div>
                                        <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-green-500/60 transition-all group-hover:w-4 group-hover:h-4"></div>
                                        <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-green-500/60 transition-all group-hover:w-4 group-hover:h-4"></div>
                                        <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-green-500/60 transition-all group-hover:w-4 group-hover:h-4"></div>
                                    </div>

                                    {/* Info Body */}
                                    <div className="p-4 flex flex-col flex-grow bg-black/80 backdrop-blur-sm">
                                        <h3 className="text-xl font-bold text-green-400 mb-1 truncate tracking-wider group-hover:text-green-300 transition-colors">{kit.title}</h3>
                                        <p className="text-[10px] text-green-800 uppercase tracking-widest mb-4 line-clamp-2 min-h-[2.5em] group-hover:text-green-700 transition-colors">
                                            {kit.description || "NO DATA AVAILABLE."}
                                        </p>
                                        
                                        <div className="mt-auto pt-4 border-t border-green-900/30 flex items-center justify-between group-hover:border-green-500/30 transition-colors">
                                             <div className="flex flex-col">
                                                <span className="text-[8px] text-green-800 uppercase tracking-widest">ATOMIC MASS (PRICE)</span>
                                                <span className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors">R$ {kit.price.toFixed(2)}</span>
                                             </div>
                                             
                                             <button 
                                                onClick={() => onAddToCart(kit)}
                                                className="bg-green-900/20 hover:bg-green-500 text-green-400 hover:text-black border border-green-700 hover:border-green-400 p-2.5 rounded-sm transition-all shadow-[0_0_10px_rgba(0,0,0,0)] hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] active:scale-95"
                                                title="Adicionar Elemento ao Carrinho"
                                             >
                                                <ShoppingCart className="w-5 h-5" />
                                             </button>
                                        </div>
                                    </div>
                                </div>
                             );
                        })
                    ) : (
                         <div className="col-span-full border border-dashed border-green-900/50 p-16 text-center rounded-sm bg-black/40 flex flex-col items-center justify-center animate-fade-in">
                             <div className="w-16 h-16 rounded-full bg-green-900/20 flex items-center justify-center mb-4 border border-green-900/50">
                                <InfoIcon className="w-8 h-8 text-green-700" />
                             </div>
                            <h3 className="text-green-500 font-bold font-mono text-lg mb-2">DATABASE EMPTY</h3>
                            <p className="text-green-800 font-mono text-xs uppercase tracking-widest">
                                NO ELEMENTS FOUND IN SYSTEM.
                            </p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default DrumKitsSection;
