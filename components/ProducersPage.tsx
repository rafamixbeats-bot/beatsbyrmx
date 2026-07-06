
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
                <h1 className="text-4xl md:text-5xl font-bold text-green-400 uppercase font-mono tracking-[0.2em] drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">PRODUCERS_UNIT</h1>
                <p className="mt-4 text-sm text-green-800 max-w-2xl mx-auto font-mono uppercase tracking-widest">
                    CORE SYSTEM OPERATORS.
                </p>
            </div>
            
            {producers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {producers.map(producer => {
                        const count = beats.filter(b => b.producerId === producer.id).length;
                        return (
                            <ProducerCard 
                                key={producer.id} 
                                producer={producer} 
                                beatCount={count}
                                onViewBeats={onFilterByProducer}
                            />
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
