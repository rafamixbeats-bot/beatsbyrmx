
import React from 'react';
import { Beat, Producer } from '../App';
import Card from './ContactSection';
import { InstagramIcon, TwitterIcon, YoutubeIcon, SpotifyIcon, Users, Music } from './icons';

type SocialIconMap = {
    [key in 'twitter' | 'instagram' | 'youtube' | 'spotify']?: React.FC<{className?: string}>;
};

const socialIconMap: SocialIconMap = {
    twitter: TwitterIcon,
    instagram: InstagramIcon,
    youtube: YoutubeIcon,
    spotify: SpotifyIcon,
};

interface ProducerCardProps {
    producer: Producer;
    beatCount: number;
    onViewBeats: (producerName: string) => void;
}

const ProducerCard: React.FC<ProducerCardProps> = ({ producer, beatCount, onViewBeats }) => {
    return (
        <Card className="p-6 flex flex-col items-center text-center transition-all duration-300 bg-black border border-green-900/40 rounded-sm hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] group relative overflow-hidden">
            {/* Corner Tech Markers */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500/50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-green-500/50"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-green-500/50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500/50"></div>

            <div className="w-28 h-28 rounded-sm overflow-hidden mb-6 border border-green-500/30 relative">
                <img 
                    src={producer.avatarUrl} 
                    alt={producer.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay"></div>
            </div>

            <h3 className="text-xl font-bold text-green-400 font-mono uppercase tracking-widest mb-2">{producer.name}</h3>
            <p className="text-[10px] text-green-800 font-mono uppercase tracking-wide mb-6 h-12 overflow-hidden px-4">{producer.bio}</p>
            
            <div className="flex items-center gap-4 mb-6">
                {Object.entries(producer.socials).map(([key, link]: [string, unknown]) => {
                     const Icon = socialIconMap[key as keyof SocialIconMap];
                     return Icon && typeof link === 'string' ? (
                        <a key={key} href={link} target="_blank" rel="noopener noreferrer" className="text-green-800 hover:text-green-400 transition-colors">
                           <Icon className="w-5 h-5" />
                           <span className="sr-only">{key}</span>
                        </a>
                     ) : null;
                })}
            </div>

            <div className="mt-auto w-full pt-4 border-t border-green-900/30">
                <div className="flex items-center justify-center gap-2 text-xs text-green-600 font-mono uppercase mb-4 tracking-widest">
                    <Music className="w-3 h-3" />
                    <span>{beatCount} TRACKS</span>
                </div>
                 <button 
                    onClick={() => onViewBeats(producer.name)}
                    className="w-full bg-green-900/20 hover:bg-green-500 text-green-400 hover:text-black font-bold font-mono uppercase text-xs tracking-widest py-3 px-5 rounded-sm border border-green-800 hover:border-green-400 transition-all shadow-[0_0_10px_rgba(0,0,0,0)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                >
                    {">> VIEW_DATABASE"}
                </button>
            </div>
        </Card>
    );
}

const StudioGallery: React.FC<{ images: string[]; producerName: string }> = ({ images, producerName }) => {
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-green-500"></div>
                <h3 className="text-sm font-mono text-green-400 uppercase tracking-widest">STUDIO_SESSIONS</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {images.map((img, idx) => (
                    <div 
                        key={idx}
                        className="relative group cursor-pointer rounded-sm overflow-hidden border border-green-900/30 hover:border-green-500/50 transition-all"
                        onClick={() => setSelectedIndex(idx)}
                    >
                        <img 
                            src={img} 
                            alt={`${producerName} studio ${idx + 1}`}
                            className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-2 left-2 text-[9px] font-mono text-green-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            VIEW
                        </div>
                    </div>
                ))}
            </div>

            {selectedIndex !== null && (
                <div 
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setSelectedIndex(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-green-500 hover:text-green-300 font-mono text-sm uppercase tracking-widest"
                        onClick={() => setSelectedIndex(null)}
                    >
                        [CLOSE]
                    </button>
                    <img 
                        src={images[selectedIndex]} 
                        alt={`${producerName} studio full`}
                        className="max-w-full max-h-[85vh] object-contain rounded-sm border border-green-900/30"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

interface ProducersPageProps {
    producers: Producer[];
    beats: Beat[];
    onFilterByProducer: (producerName: string) => void;
}

const ProducersPage: React.FC<ProducersPageProps> = ({ producers, beats, onFilterByProducer }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <div className="text-center mb-16 border-b border-green-900/30 pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-sm mb-4 border border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                    <Users className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-green-400 uppercase font-mono tracking-[0.2em] drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">PRODUCER</h1>
                <p className="mt-4 text-sm text-green-800 max-w-2xl mx-auto font-mono uppercase tracking-widest">
                    CORE SYSTEM OPERATORS.
                </p>
            </div>
            
            {producers.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-8">
                    {producers.map(producer => {
                        const count = beats.filter(b => b.producerId === producer.id).length;
                        return (
                            <div key={producer.id} className="bg-black border border-green-900/30 rounded-sm p-6 md:p-8">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-1/3 flex justify-center">
                                        <ProducerCard 
                                            producer={producer} 
                                            beatCount={count}
                                            onViewBeats={onFilterByProducer}
                                        />
                                    </div>
                                    <div className="w-full md:w-2/3">
                                        <StudioGallery images={producer.gallery || []} producerName={producer.name} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center p-12 border border-dashed border-green-900/50 bg-black/40 rounded-sm">
                     <p className="text-green-800 font-mono uppercase text-xs tracking-widest">DATA_NOT_FOUND</p>
                </div>
            )}
        </div>
    );
};

export default ProducersPage;
