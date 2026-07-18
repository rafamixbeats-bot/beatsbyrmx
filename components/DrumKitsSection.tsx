
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DrumKit } from '../App';
import { ShoppingCart, Package, InfoIcon, Music, Play, Pause, CheckSquare, Square } from './icons';

interface DrumKitsSectionProps {
    drumKits: DrumKit[];
    onAddToCart: (kit: DrumKit) => void;
    onAddMultipleToCart?: (kits: DrumKit[]) => void;
}

const DrumKitsSection: React.FC<DrumKitsSectionProps> = ({ drumKits, onAddToCart, onAddMultipleToCart }) => {
    const navigate = useNavigate();
    const [playingKitId, setPlayingKitId] = useState<string | null>(null);
    const [selectedPacks, setSelectedPacks] = useState<Set<string>>(new Set());
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handlePreviewKit = (e: React.MouseEvent, kit: DrumKit) => {
        e.stopPropagation();
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if (playingKitId === kit.id) {
            setPlayingKitId(null);
            return;
        }
        const sample = kit.samples?.[0];
        if (!sample) return;
        const audio = new Audio(sample.file_url);
        audio.play();
        audio.onended = () => setPlayingKitId(null);
        audioRef.current = audio;
        setPlayingKitId(kit.id);
    };

    const togglePackSelection = (kitId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPacks(prev => {
            const next = new Set(prev);
            if (next.has(kitId)) {
                next.delete(kitId);
            } else {
                next.add(kitId);
            }
            return next;
        });
    };

    const toggleAllPacks = () => {
        if (selectedPacks.size === drumKits.length) {
            setSelectedPacks(new Set());
        } else {
            setSelectedPacks(new Set(drumKits.map(k => k.id)));
        }
    };

    const handleAddSelectedToCart = () => {
        if (!onAddMultipleToCart || selectedPacks.size === 0) return;
        const selected = drumKits.filter(k => selectedPacks.has(k.id));
        onAddMultipleToCart(selected);
        setSelectedPacks(new Set());
    };

    const allSelected = selectedPacks.size === drumKits.length && drumKits.length > 0;

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono">
             <div className="container mx-auto px-4 pt-12 md:pt-16 pb-8 border-b border-green-900/30">
                <div className="flex items-center gap-2 mb-2 animate-fade-in">
                    <Package className="w-5 h-5 text-green-400" />
                    <span className="text-xs font-bold tracking-[0.3em] text-green-600 uppercase">System.Database.Lab</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-700 font-mono uppercase tracking-widest drop-shadow-[0_0_10px_rgba(74,222,128,0.2)] animate-fade-in">
                    SOUND_LAB
                </h1>
                <p className="mt-4 text-green-800/80 max-w-2xl text-xs md:text-sm uppercase tracking-widest border-l-2 border-green-500/50 pl-4 animate-fade-in-up">
                    Laboratório de compostos sonoros. Amostras analisadas e aprovadas para síntese musical profissional.
                </p>
            </div>

            <div className="container mx-auto px-4 py-12">
                 {drumKits.length > 0 && (
                     <div className="flex items-center justify-between mb-6">
                         <button onClick={toggleAllPacks} className="flex items-center gap-2 text-xs text-green-700 hover:text-green-400 transition-colors uppercase tracking-widest">
                             {allSelected ? <CheckSquare className="w-4 h-4 text-green-400" /> : <Square className="w-4 h-4" />}
                             {allSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
                         </button>
                         {selectedPacks.size > 0 && onAddMultipleToCart && (
                             <button onClick={handleAddSelectedToCart} className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold font-mono text-xs uppercase tracking-widest py-2 px-4 rounded-sm transition-all shadow-[0_0_15px_rgba(74,222,128,0.4)]">
                                 <ShoppingCart className="w-4 h-4" /> Adicionar {selectedPacks.size} {selectedPacks.size === 1 ? 'Pack' : 'Packs'} ao Carrinho
                             </button>
                         )}
                     </div>
                 )}

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {drumKits.length > 0 ? (
                        drumKits.map((kit, index) => {
                             const sampleCount = kit.samples?.length || 0;
                             const labId = `LAB-${(index + 1).toString().padStart(3, '0')}`;
                             
                             return (
                                <div key={kit.id} className="group relative bg-black border border-green-900/40 hover:border-green-500/60 transition-all duration-300 rounded-sm overflow-hidden hover:shadow-[0_0_25px_rgba(34,197,94,0.12)] flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                     
                                     {/* Lab Header Bar */}
                                     <div className="flex justify-between items-center px-3 py-2 border-b border-green-900/30 bg-green-900/5 select-none">
                                         <div className="flex items-center gap-2">
                                             <button onClick={(e) => togglePackSelection(kit.id, e)} className="text-green-700 hover:text-green-400 transition-colors">
                                                 {selectedPacks.has(kit.id) ? <CheckSquare className="w-4 h-4 text-green-400" /> : <Square className="w-4 h-4" />}
                                             </button>
                                             <span className="text-[9px] text-green-600 font-bold tracking-widest">{labId}</span>
                                         </div>
                                         <div className="flex items-center gap-1.5">
                                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                             <span className="text-[9px] text-green-600 font-bold tracking-wider">
                                                 {sampleCount > 0 ? `${sampleCount} SAMPLES` : 'SOLID STATE'}
                                             </span>
                                         </div>
                                     </div>

                                    {/* Artwork - Lab Sample View */}
                                    <div className="relative aspect-square overflow-hidden bg-black/50 border-b border-green-900/30 group-hover:border-green-500/40 transition-colors cursor-pointer" onClick={() => navigate(`/pack/${kit.slug}`)}>
                                        
                                        {/* Grid overlay */}
                                        <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
                                            <div className="w-full h-full" style={{
                                                backgroundImage: 'linear-gradient(rgba(74,222,128,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.1) 1px, transparent 1px)',
                                                backgroundSize: '20px 20px'
                                            }}></div>
                                        </div>

                                        <img 
                                            src={kit.artworkUrl} 
                                            alt={kit.title} 
                                            className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-500 scale-100 group-hover:scale-105"
                                        />
                                        
                                        {/* Scan line effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-green-500/5 pointer-events-none"></div>
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-green-400/40 shadow-[0_0_8px_rgba(74,222,128,0.8)] transform -translate-y-full group-hover:translate-y-[400px] transition-transform duration-[2s] ease-linear pointer-events-none"></div>

                                        {/* Center lab symbol */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                            <div className="bg-black/70 backdrop-blur-sm border border-green-500/30 w-20 h-20 flex flex-col items-center justify-center rounded-sm group-hover:bg-black/80 group-hover:border-green-400/60 transition-all duration-300">
                                                <span className="text-[8px] text-green-600 tracking-widest mb-0.5">SAMPLE</span>
                                                <span className="text-xl font-bold text-green-500 group-hover:text-green-400 tracking-tighter drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(74,222,128,0.5)] transition-all">
                                                    {sampleCount}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Play Preview Button */}
                                        {kit.samples && kit.samples.length > 0 && (
                                            <button onClick={(e) => handlePreviewKit(e, kit)} className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${playingKitId === kit.id ? 'bg-green-500 border-green-400 text-black shadow-[0_0_20px_rgba(74,222,128,0.6)]' : 'bg-black/60 border-green-400/60 text-green-400 hover:bg-green-500 hover:text-black hover:border-green-400'}`}>
                                                    {playingKitId === kit.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                                </div>
                                            </button>
                                        )}
                                        
                                        {/* Lab corner markers */}
                                        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-green-500/50 transition-all group-hover:w-4 group-hover:h-4 group-hover:border-green-400"></div>
                                        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-green-500/50 transition-all group-hover:w-4 group-hover:h-4 group-hover:border-green-400"></div>
                                        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-green-500/50 transition-all group-hover:w-4 group-hover:h-4 group-hover:border-green-400"></div>
                                        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-green-500/50 transition-all group-hover:w-4 group-hover:h-4 group-hover:border-green-400"></div>
                                    </div>

                                    {/* Info Panel */}
                                    <div className="p-4 flex flex-col flex-grow bg-black/80 backdrop-blur-sm">
                                        <h3 className="text-lg font-bold text-green-400 mb-1 truncate tracking-wider group-hover:text-green-300 transition-colors cursor-pointer" onClick={() => navigate(`/pack/${kit.slug}`)}>
                                            {kit.title}
                                        </h3>
                                        <p className="text-[9px] text-green-800 uppercase tracking-widest mb-3 line-clamp-2 min-h-[2.5em] group-hover:text-green-700 transition-colors">
                                            {kit.description || "COMPOUND DATA PENDING ANALYSIS."}
                                        </p>
                                        
                                        {kit.tags && kit.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {kit.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-[8px] text-green-600 bg-green-900/20 border border-green-900/30 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="mt-auto pt-3 border-t border-green-900/30 flex items-center justify-between group-hover:border-green-500/30 transition-colors">
                                             <div className="flex flex-col">
                                                <span className="text-[7px] text-green-800 uppercase tracking-widest">COMPOUND VALUE</span>
                                                <span className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors">R$ {kit.price.toFixed(2)}</span>
                                             </div>
                                             
                                             <div className="flex items-center gap-1.5">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/pack/${kit.slug}`); }}
                                                    className="bg-green-900/20 hover:bg-green-500 text-green-400 hover:text-black border border-green-700 hover:border-green-400 p-2 rounded-sm transition-all shadow-[0_0_10px_rgba(0,0,0,0)] hover:shadow-[0_0_12px_rgba(74,222,128,0.3)] active:scale-95"
                                                    title="Análise Completa"
                                                >
                                                    <Music className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onAddToCart(kit); }}
                                                    className="bg-green-900/20 hover:bg-green-500 text-green-400 hover:text-black border border-green-700 hover:border-green-400 p-2 rounded-sm transition-all shadow-[0_0_10px_rgba(0,0,0,0)] hover:shadow-[0_0_12px_rgba(74,222,128,0.3)] active:scale-95"
                                                    title="Adicionar ao Carrinho"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </button>
                                             </div>
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
                            <h3 className="text-green-500 font-bold font-mono text-lg mb-2">LAB EMPTY</h3>
                            <p className="text-green-800 font-mono text-xs uppercase tracking-widest">
                                NO COMPOUNDS FOUND IN SYSTEM.
                            </p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default DrumKitsSection;
