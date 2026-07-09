
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DrumKit, DrumKitSample } from '../App';
import { Package, ShoppingCart, Play, Pause, ArrowLeft } from './icons';

interface PackDetailPageProps {
    drumKits: DrumKit[];
    onAddToCart: (kit: DrumKit) => void;
}

const RealWaveform: React.FC<{
    url: string;
    isPlaying: boolean;
    progress: number;
    onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}> = ({ url, isPlaying, progress, onClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const peaksRef = useRef<number[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch(url);
                if (!res.ok) return;
                const arrayBuffer = await res.arrayBuffer();
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                if (cancelled) return;

                const rawData = audioBuffer.getChannelData(0);
                const samples = 80;
                const blockSize = Math.floor(rawData.length / samples);
                const peaks: number[] = [];
                for (let i = 0; i < samples; i++) {
                    let sum = 0;
                    const start = i * blockSize;
                    for (let j = start; j < start + blockSize && j < rawData.length; j++) {
                        sum += Math.abs(rawData[j]);
                    }
                    peaks.push(sum / blockSize);
                }
                const maxPeak = Math.max(...peaks, 0.01);
                peaksRef.current = peaks.map(p => p / maxPeak);
                setLoaded(true);
                audioCtx.close();
            } catch (e) {
                const fallback = Array.from({ length: 80 }, () => 0.2 + Math.random() * 0.8);
                peaksRef.current = fallback;
                setLoaded(true);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [url]);

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
        const peaks = peaksRef.current;
        if (peaks.length === 0) return;

        const barWidth = w / peaks.length;
        const gap = 1;
        const progressX = (progress / 100) * w;

        ctx.clearRect(0, 0, w, h);

        peaks.forEach((heightRatio, i) => {
            const barH = Math.max(heightRatio * (h * 0.9), 2);
            const x = i * barWidth;
            const y = (h - barH) / 2;

            if (x < progressX && isPlaying) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            }

            ctx.fillRect(x + gap / 2, y, barWidth - gap, barH);
        });
    }, [progress, isPlaying, loaded]);

    return (
        <canvas
            ref={canvasRef}
            onClick={onClick}
            className="w-full h-full cursor-pointer"
            style={{ height: '40px' }}
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
            setProgress(0);
            return;
        }
        const audio = new Audio(sample.file_url);
        audio.play().catch(err => {
            console.error(`Erro ao tocar ${sample.file_name}:`, err);
            setPlayingId(null);
        });
        audio.onended = () => {
            setPlayingId(null);
            setProgress(0);
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
                default: return true;
            }
        });
    };

    const filteredSamples = getFilteredSamples();
    const categories = getSampleCategories();

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const getSampleDisplayName = (sample: DrumKitSample): string => {
        let name = sample.file_name;
        const parts: string[] = [];
        if (sample.bpm && sample.bpm > 0) parts.push(`${sample.bpm} BPM`);
        if (sample.key) parts.push(sample.key);
        if (parts.length > 0) name += ` - ${parts.join(' ')}`;
        return name;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
            {showStickyNav && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 animate-fade-in">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={pack.artworkUrl} alt={pack.title} className="w-8 h-8 rounded-sm object-cover" />
                            <span className="text-sm font-bold text-white truncate max-w-[200px]">{pack.title}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => scrollToSection('samples')} className="text-xs text-gray-400 hover:text-white transition-colors hidden md:block">
                                SAMPLES
                            </button>
                            <button onClick={() => onAddToCart(pack)} className="bg-white hover:bg-gray-200 text-black font-bold font-mono text-xs uppercase tracking-widest py-2 px-4 rounded-sm transition-all flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> COMPRAR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 pt-8 pb-20">
                <button onClick={() => navigate('/drum_kits')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-xs uppercase tracking-widest transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>

                <div className="grid md:grid-cols-[350px_1fr] gap-10 mb-16">
                    <div className="relative aspect-square rounded-sm overflow-hidden bg-[#111]">
                        <img src={pack.artworkUrl} alt={pack.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col justify-center">
                        <span className="text-xs text-gray-500 uppercase tracking-widest mb-3">SOUND KIT</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 uppercase tracking-wider">{pack.title}</h1>
                        <p className="text-sm text-gray-400 mb-6 max-w-lg">{pack.description || 'Sem descricao.'}</p>

                        {pack.tags && pack.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {pack.tags.map(tag => (
                                    <span key={tag} className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-8 mb-8">
                            <div>
                                <span className="text-3xl font-bold text-white">{pack.samples.length}</span>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Samples</p>
                            </div>
                            <div className="h-8 w-px bg-white/10"></div>
                            <div>
                                <div className="flex items-center gap-2">
                                    {pack.price > 0 && (
                                        <span className="text-lg font-bold text-gray-600 line-through">R$ {(pack.price * 1.5).toFixed(2)}</span>
                                    )}
                                    <span className="text-3xl font-bold text-white">
                                        {pack.price === 0 ? 'FREE' : `R$ ${pack.price.toFixed(2)}`}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Preço</p>
                            </div>
                        </div>

                        <button onClick={() => onAddToCart(pack)} className="bg-white hover:bg-gray-200 text-black font-bold font-mono text-sm uppercase tracking-widest py-3 px-8 rounded-sm transition-all flex items-center justify-center gap-2 w-fit active:scale-95">
                            <ShoppingCart className="w-4 h-4" /> ADICIONAR AO CARRINHO
                        </button>
                    </div>
                </div>

                {categories.length > 1 && (
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeTab === cat
                                        ? 'bg-white text-black'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                <div id="samples" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {filteredSamples.map((sample) => (
                        <div
                            key={sample.id}
                            className="group cursor-pointer"
                            onClick={() => handlePlaySample(sample)}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 group-hover:border-white/50 transition-colors flex-shrink-0">
                                    {playingId === sample.id ? (
                                        <Pause className="w-3 h-3 text-white" />
                                    ) : (
                                        <Play className="w-3 h-3 text-white ml-0.5" />
                                    )}
                                </button>
                                <div className="flex-grow">
                                    <RealWaveform
                                        url={sample.file_url}
                                        isPlaying={playingId === sample.id}
                                        progress={playingId === sample.id ? progress : 0}
                                    />
                                </div>
                            </div>
                            <p className={`text-center text-xs tracking-wide ${
                                playingId === sample.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                            }`}>
                                {getSampleDisplayName(sample)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PackDetailPage;
