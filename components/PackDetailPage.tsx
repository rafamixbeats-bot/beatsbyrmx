
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DrumKit, DrumKitSample } from '../App';
import { Package, ShoppingCart, Play, Pause, ArrowLeft, Clock, Music, Tag } from './icons';

interface PackDetailPageProps {
    drumKits: DrumKit[];
    onAddToCart: (kit: DrumKit) => void;
}

const WaveformCanvas: React.FC<{
    isPlaying: boolean;
    progress: number;
    onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    height?: number;
}> = ({ isPlaying, progress, onClick, height = 40 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const barsRef = useRef<number[]>([]);

    useEffect(() => {
        if (barsRef.current.length === 0) {
            barsRef.current = Array.from({ length: 80 }, () => 0.2 + Math.random() * 0.8);
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        const bars = barsRef.current;
        const barWidth = w / bars.length;
        const gap = 2;
        const progressX = (progress / 100) * w;

        ctx.clearRect(0, 0, w, h);

        bars.forEach((heightRatio, i) => {
            const barH = heightRatio * (h * 0.8);
            const x = i * barWidth;
            const y = (h - barH) / 2;

            if (x < progressX) {
                ctx.fillStyle = '#4ade80';
            } else {
                ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
            }

            ctx.fillRect(x + gap / 2, y, barWidth - gap, barH);
        });
    }, [progress, isPlaying]);

    return (
        <canvas
            ref={canvasRef}
            onClick={onClick}
            className="w-full cursor-pointer"
            style={{ height: `${height}px` }}
        />
    );
};

const PackDetailPage: React.FC<PackDetailPageProps> = ({ drumKits, onAddToCart }) => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const pack = drumKits.find(k => k.slug === slug);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState<string>('ALL');
    const [showStickyNav, setShowStickyNav] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressInterval = useRef<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setShowStickyNav(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
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
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }
        if (playingId === sample.id) {
            setPlayingId(null);
            setProgress(0);
            return;
        }
        const audio = new Audio(sample.file_url);
        audio.play();
        audio.onended = () => {
            setPlayingId(null);
            setProgress(0);
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
        audio.ontimeupdate = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        audioRef.current = audio;
        setPlayingId(sample.id);
    };

    const getSampleCategories = (): string[] => {
        const categories = new Set<string>();
        pack.samples.forEach(s => {
            if (s.key) categories.add(s.key.toUpperCase());
        });
        if (categories.size === 0) {
            pack.samples.forEach(s => {
                const name = s.file_name.toLowerCase();
                if (name.includes('kick') || name.includes('snare') || name.includes('hihat') || name.includes('hat') || name.includes('perc')) {
                    categories.add('DRUMS');
                } else if (name.includes('bass') || name.includes('808')) {
                    categories.add('BASS');
                } else if (name.includes('melody') || name.includes('loop') || name.includes('pad') || name.includes('keys')) {
                    categories.add('MELODIC');
                } else if (name.includes('fx') || name.includes('effect') || name.includes('riser')) {
                    categories.add('FX');
                } else {
                    categories.add('OTHER');
                }
            });
        }
        return ['ALL', ...Array.from(categories)];
    };

    const getFilteredSamples = (): DrumKitSample[] => {
        if (activeTab === 'ALL') return pack.samples;
        return pack.samples.filter(s => {
            if (s.key && s.key.toUpperCase() === activeTab) return true;
            const name = s.file_name.toLowerCase();
            switch (activeTab) {
                case 'DRUMS': return name.includes('kick') || name.includes('snare') || name.includes('hihat') || name.includes('hat') || name.includes('perc');
                case 'BASS': return name.includes('bass') || name.includes('808');
                case 'MELODIC': return name.includes('melody') || name.includes('loop') || name.includes('pad') || name.includes('keys');
                case 'FX': return name.includes('fx') || name.includes('effect') || name.includes('riser');
                case 'OTHER': return !name.includes('kick') && !name.includes('snare') && !name.includes('hihat') && !name.includes('hat') && !name.includes('perc') && !name.includes('bass') && !name.includes('808') && !name.includes('melody') && !name.includes('loop') && !name.includes('pad') && !name.includes('keys') && !name.includes('fx') && !name.includes('effect') && !name.includes('riser');
                default: return true;
            }
        });
    };

    const filteredSamples = getFilteredSamples();
    const categories = getSampleCategories();

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono">
            {/* Sticky Nav */}
            {showStickyNav && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-green-900/30 animate-fade-in">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={pack.artworkUrl} alt={pack.title} className="w-8 h-8 rounded-sm object-cover" />
                            <span className="text-sm font-bold text-green-400 truncate max-w-[200px]">{pack.title}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => scrollToSection('samples')} className="text-xs text-green-700 hover:text-green-400 transition-colors hidden md:block">
                                SAMPLES
                            </button>
                            <button onClick={() => scrollToSection('info')} className="text-xs text-green-700 hover:text-green-400 transition-colors hidden md:block">
                                INFO
                            </button>
                            <button onClick={() => onAddToCart(pack)} className="bg-green-500 hover:bg-green-400 text-black font-bold font-mono text-xs uppercase tracking-widest py-2 px-4 rounded-sm transition-all flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> COMPRAR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 pt-8 pb-20">
                <button onClick={() => navigate('/drum_kits')} className="flex items-center gap-2 text-green-700 hover:text-green-400 mb-6 text-xs uppercase tracking-widest transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>

                {/* Hero Section */}
                <div className="grid md:grid-cols-[400px_1fr] gap-8">
                    <div className="relative aspect-square rounded-sm overflow-hidden border border-green-900/30 bg-black/60 group">
                        <img src={pack.artworkUrl} alt={pack.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2 text-[10px] text-green-800 font-mono">
                                <span>{pack.samples.length} SAMPLES</span>
                            </div>
                        </div>
                        <div className="absolute top-4 left-4 w-2 h-2 border-l border-t border-green-500/60"></div>
                        <div className="absolute top-4 right-4 w-2 h-2 border-r border-t border-green-500/60"></div>
                        <div className="absolute bottom-4 left-4 w-2 h-2 border-l border-b border-green-500/60"></div>
                        <div className="absolute bottom-4 right-4 w-2 h-2 border-r border-b border-green-500/60"></div>
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
                                <div className="flex items-center justify-center gap-2">
                                    {pack.price > 0 && (
                                        <span className="text-lg font-bold text-green-700 line-through">R$ {(pack.price * 1.5).toFixed(2)}</span>
                                    )}
                                    <span className="text-2xl font-bold text-green-400">
                                        {pack.price === 0 ? 'GRÁTIS' : `R$ ${pack.price.toFixed(2)}`}
                                    </span>
                                </div>
                                <p className="text-[10px] text-green-800 uppercase tracking-widest mt-1">Preço</p>
                            </div>
                        </div>

                        <button onClick={() => onAddToCart(pack)} className="bg-green-900/20 hover:bg-green-500 text-green-400 hover:text-black border border-green-700 hover:border-green-400 py-3 px-6 rounded-sm transition-all font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,0,0,0)] hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] active:scale-95">
                            <ShoppingCart className="w-4 h-4" /> Adicionar ao Carrinho
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                {categories.length > 1 && (
                    <div id="samples" className="mt-12">
                        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                                        activeTab === cat
                                            ? 'bg-green-500 text-black'
                                            : 'bg-green-900/10 text-green-700 hover:bg-green-900/20 hover:text-green-500 border border-green-900/30'
                                    }`}
                                >
                                    {cat}
                                    {cat !== 'ALL' && (
                                        <span className="ml-1 text-[10px] opacity-70">
                                            ({cat === 'ALL' ? pack.samples.length : getFilteredSamples().length})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Samples Grid */}
                        <h2 className="text-lg font-bold text-green-400 mb-4 uppercase tracking-widest border-b border-green-900/30 pb-2">
                            SAMPLES ({filteredSamples.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filteredSamples.map((sample, index) => (
                                <div
                                    key={sample.id}
                                    className={`flex items-center gap-3 p-3 rounded-sm border transition-all cursor-pointer group ${
                                        playingId === sample.id
                                            ? 'bg-green-900/20 border-green-500/50 shadow-[0_0_10px_rgba(74,222,128,0.1)]'
                                            : 'bg-black/40 border-green-900/20 hover:border-green-500/30 hover:bg-green-900/5'
                                    }`}
                                    onClick={() => handlePlaySample(sample)}
                                >
                                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-900/20 border border-green-700 group-hover:border-green-500 transition-colors flex-shrink-0">
                                        {playingId === sample.id ? (
                                            <Pause className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Play className="w-4 h-4 text-green-400 ml-0.5" />
                                        )}
                                    </button>

                                    <div className="flex-grow min-w-0">
                                        <WaveformCanvas
                                            isPlaying={playingId === sample.id}
                                            progress={playingId === sample.id ? progress : 0}
                                            height={30}
                                        />
                                    </div>

                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <p className={`text-[10px] font-mono truncate max-w-[120px] ${
                                            playingId === sample.id ? 'text-green-400' : 'text-green-600 group-hover:text-green-400'
                                        }`}>
                                            {sample.file_name}
                                        </p>
                                        <div className="flex items-center gap-2 text-[8px] text-green-800">
                                            {sample.bpm > 0 && <span className="flex items-center gap-0.5"><Music className="w-2.5 h-2.5" />{sample.bpm}</span>}
                                            {sample.key && <span className="flex items-center gap-0.5"><Tag className="w-2.5 h-2.5" />{sample.key}</span>}
                                            {sample.duration && <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{sample.duration}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info Section */}
                <div id="info" className="mt-12 border-t border-green-900/30 pt-8">
                    <h2 className="text-lg font-bold text-green-400 mb-4 uppercase tracking-widest">
                        INFORMAÇÕES
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-green-900/20 pb-2">
                                <span className="text-xs text-green-700 uppercase">Formato</span>
                                <span className="text-xs text-green-400">WAV / MP3</span>
                            </div>
                            <div className="flex justify-between border-b border-green-900/20 pb-2">
                                <span className="text-xs text-green-700 uppercase">Total de Samples</span>
                                <span className="text-xs text-green-400">{pack.samples.length}</span>
                            </div>
                            <div className="flex justify-between border-b border-green-900/20 pb-2">
                                <span className="text-xs text-green-700 uppercase">Categorias</span>
                                <span className="text-xs text-green-400">{categories.length - 1}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-green-900/20 pb-2">
                                <span className="text-xs text-green-700 uppercase">Licença</span>
                                <span className="text-xs text-green-400">Uso Comercial</span>
                            </div>
                            <div className="flex justify-between border-b border-green-900/20 pb-2">
                                <span className="text-xs text-green-700 uppercase">Download</span>
                                <span className="text-xs text-green-400">Instantâneo</span>
                            </div>
                            <div className="flex justify-between border-b border-green-900/20 pb-2">
                                <span className="text-xs text-green-700 uppercase">Suporte</span>
                                <span className="text-xs text-green-400">24/7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackDetailPage;
