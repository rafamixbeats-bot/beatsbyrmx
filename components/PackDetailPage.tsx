
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DrumKit, DrumKitSample } from '../App';
import { Package, ShoppingCart, Play, Pause, ArrowLeft, Clock, Music, Tag } from './icons';

interface PackDetailPageProps {
    drumKits: DrumKit[];
    onAddToCart: (kit: DrumKit) => void;
}

const PackDetailPage: React.FC<PackDetailPageProps> = ({ drumKits, onAddToCart }) => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const pack = drumKits.find(k => k.slug === slug);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    if (!pack) {
        return (
            <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-green-700 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-green-400 mb-2">PACK NAO ENCONTRADO</h2>
                    <button onClick={() => navigate('/drum_kits')} className="text-green-600 hover:text-green-400 text-sm mt-4">
                        ← VOLTAR
                    </button>
                </div>
            </div>
        );
    }

    const handlePlaySample = (sample: DrumKitSample) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if (playingId === sample.id) {
            setPlayingId(null);
            return;
        }
        const audio = new Audio(sample.file_url);
        audio.play();
        audio.onended = () => setPlayingId(null);
        audioRef.current = audio;
        setPlayingId(sample.id);
    };

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono">
            <div className="container mx-auto px-4 pt-8 pb-20">
                <button onClick={() => navigate('/drum_kits')} className="flex items-center gap-2 text-green-700 hover:text-green-400 mb-6 text-xs uppercase tracking-widest transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>

                <div className="grid md:grid-cols-[400px_1fr] gap-8">
                    <div className="relative aspect-square rounded-sm overflow-hidden border border-green-900/30 bg-black/60">
                        <img src={pack.artworkUrl} alt={pack.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2 text-[10px] text-green-800 font-mono">
                                <span>{pack.samples.length} SAMPLES</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-700 uppercase tracking-widest">SOUND KIT</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-green-400 mb-2 uppercase tracking-wider">{pack.title}</h1>
                        <p className="text-sm text-green-800 mb-6 max-w-lg">{pack.description || 'Sem descricao.'}</p>

                        {pack.tags && pack.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {pack.tags.map(tag => (
                                    <span key={tag} className="text-[10px] text-green-700 bg-green-900/20 border border-green-900/30 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                            <div className="border border-green-900/30 rounded-sm p-4 bg-green-900/5">
                                <span className="text-2xl font-bold text-green-400">{pack.samples.length}</span>
                                <p className="text-[10px] text-green-800 uppercase tracking-widest mt-1">Samples</p>
                            </div>
                            <div className="border border-green-900/30 rounded-sm p-4 bg-green-900/5">
                                <span className="text-2xl font-bold text-green-400">R$ {pack.price.toFixed(2)}</span>
                                <p className="text-[10px] text-green-800 uppercase tracking-widest mt-1">Preco</p>
                            </div>
                        </div>

                        <button onClick={() => onAddToCart(pack)} className="bg-green-900/20 hover:bg-green-500 text-green-400 hover:text-black border border-green-700 hover:border-green-400 py-3 px-6 rounded-sm transition-all font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,0,0,0)] hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]">
                            <ShoppingCart className="w-4 h-4" /> Adicionar ao Carrinho
                        </button>
                    </div>
                </div>

                {pack.samples.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-lg font-bold text-green-400 mb-4 uppercase tracking-widest border-b border-green-900/30 pb-2">
                            SAMPLES ({pack.samples.length})
                        </h2>
                        <div className="space-y-1">
                            {pack.samples.map((sample, index) => (
                                <div key={sample.id} className={`flex items-center gap-4 p-3 rounded-sm border transition-all cursor-pointer group ${playingId === sample.id ? 'bg-green-900/20 border-green-500/50' : 'bg-black/40 border-green-900/20 hover:border-green-500/30 hover:bg-green-900/5'}`} onClick={() => handlePlaySample(sample)}>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-900/20 border border-green-700 group-hover:border-green-500 transition-colors flex-shrink-0">
                                        {playingId === sample.id ? <Pause className="w-3 h-3 text-green-400" /> : <Play className="w-3 h-3 text-green-400 ml-0.5" />}
                                    </button>
                                    <span className="text-[10px] text-green-800 w-6 flex-shrink-0">{(index + 1).toString().padStart(2, '0')}</span>
                                    <div className="flex-grow min-w-0">
                                        <p className={`text-sm font-mono truncate ${playingId === sample.id ? 'text-green-400' : 'text-green-500 group-hover:text-green-400'}`}>{sample.file_name}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] text-green-800 flex-shrink-0">
                                        {sample.bpm > 0 && <span className="flex items-center gap-1"><Music className="w-3 h-3" />{sample.bpm} BPM</span>}
                                        {sample.key && <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{sample.key}</span>}
                                        {sample.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{sample.duration}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackDetailPage;
