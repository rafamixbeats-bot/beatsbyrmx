
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, ShoppingCart, SoundWave, ArrowDownToLine, SearchIcon, YoutubeIcon, TiktokIcon, InstagramIcon, SpotifyIcon, TwitterIcon } from './icons';
import type { Beat, SocialLinks } from '../App';
import Card from './ContactSection';
import { slugify } from './BeatPage';

const BeatRow: React.FC<{
    beat: Beat;
    onPlayBeat: (id: string) => void;
    currentBeat: Beat | null;
    isPlaying: boolean;
    onAddToCartClick: (beat: Beat) => void;
    onDownloadClick: (beat: Beat) => void;
}> = ({ beat, onPlayBeat, currentBeat, isPlaying, onAddToCartClick, onDownloadClick }) => {
    const isActive = currentBeat?.id === beat.id;

    return (
        <div 
            className={`group flex items-center justify-between p-4 border-b border-green-900/10 hover:bg-green-900/5 transition-all cursor-pointer ${isActive ? 'bg-green-900/10 border-green-500/20' : ''}`}
            onClick={() => onPlayBeat(beat.id)}
        >
             <div className="flex items-center gap-4 flex-grow min-w-0">
                {/* Play Button - Tech Style */}
                <button 
                    className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-sm transition-all duration-200 border ${
                        isActive 
                        ? 'bg-green-500 text-black border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.4)]' 
                        : 'bg-black text-green-700 border-green-900/50 group-hover:text-green-400 group-hover:border-green-500/50'
                    }`}
                    onClick={(e) => { e.stopPropagation(); onPlayBeat(beat.id); }}
                >
                     {isActive && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                {/* Info Grouped - Left Side */}
                <div className="flex flex-col min-w-0 mr-4">
                    <Link to={`/beat/${slugify(beat.title)}`} onClick={(e) => e.stopPropagation()} className="font-bold font-mono text-base truncate transition-colors text-green-400 tracking-widest uppercase drop-shadow-[0_0_2px_rgba(74,222,128,0.3)] group-hover:text-green-300 hover:text-green-300 hover:underline">
                        {beat.title}
                    </Link>
                    
                    {/* Metadata with Tech/Lab Font */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-mono tracking-widest">
                        <span className="font-bold text-green-800 uppercase">{beat.producer}</span>
                        <span className="text-green-900/50">::</span>
                        <span className="text-green-700 uppercase">{beat.bpm} BPM</span>
                        <span className="text-green-900/50">::</span>
                        <span className="text-green-700">{beat.key}</span>
                        <span className="text-green-900/50">::</span>
                        <span className="bg-[#1e0538] text-purple-300 px-1.5 py-0.5 rounded-sm border border-purple-900/50 uppercase">
                            {beat.duration}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions & Price - Right Side Fixed Alignment */}
            <div className="flex items-center gap-4 flex-shrink-0 pl-4 border-l border-green-900/20">
                
                {/* Free Download Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onDownloadClick(beat); }}
                    className="text-green-800 hover:text-green-400 transition-colors p-2 rounded-sm border border-transparent hover:border-green-900/50 hover:bg-green-900/10"
                    title="DOWNLOAD_DEMO"
                >
                    <ArrowDownToLine className="w-4 h-4" />
                </button>

                <div className="w-24 text-right hidden sm:block">
                    <span className="font-bold font-mono text-green-400 text-sm block tracking-widest drop-shadow-[0_0_5px_rgba(74,222,128,0.2)]">
                        {beat.price_mp3 > 0 ? `R$ ${beat.price_mp3.toFixed(2)}` : 'FREE'}
                    </span>
                </div>

                {/* Cart Button - Sci-Fi Purple Style */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCartClick(beat); }}
                    className="relative overflow-hidden bg-black text-purple-400 border border-purple-900 hover:border-purple-500 hover:text-white p-2.5 rounded-sm transition-all group/btn shadow-[0_0_10px_rgba(88,28,135,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    title="ADD_TO_CART"
                >
                    <div className="absolute inset-0 bg-purple-600/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-200"></div>
                    <ShoppingCart className="w-4 h-4 relative z-10" />
                </button>
            </div>
        </div>
    );
};

const SocialLink: React.FC<{ href?: string; icon: React.FC<{className?: string}> }> = ({ href, icon: Icon }) => {
    if (!href) return null;
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="group relative p-3 border border-green-900/30 hover:border-green-500/50 rounded-sm bg-black transition-all hover:bg-green-900/10">
            <Icon className="w-5 h-5 text-green-700 group-hover:text-green-400 transition-colors" />
            {/* Tech corners */}
            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-transparent group-hover:border-green-500 transition-colors"></div>
            <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-transparent group-hover:border-green-500 transition-colors"></div>
        </a>
    )
}

interface StoreSectionProps {
    beats: Beat[];
    onPlayBeat: (beatId: string) => void;
    currentBeat: Beat | null;
    isPlaying: boolean;
    onAddToCartClick: (beat: Beat) => void;
    onDownloadClick: (beat: Beat) => void;
    searchTerm: string;
    onSearch: (term: string) => void;
    socialLinks: SocialLinks;
}

const StoreSection: React.FC<StoreSectionProps> = ({ beats, onPlayBeat, currentBeat, isPlaying, onAddToCartClick, onDownloadClick, searchTerm, onSearch, socialLinks }) => {
    
    // Determine which beat to show in the header (Current or First)
    const featuredBeat = currentBeat || beats[0];
    const isFeaturedPlaying = currentBeat?.id === featuredBeat?.id && isPlaying;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                 {/* O "Cubo" da Playlist - Sci-Fi Container */}
                <Card className="bg-black/90 backdrop-blur-xl border border-green-900/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden flex flex-col relative group">
                     
                     {/* Tech Corners (Absolute) */}
                     <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-green-500/60 rounded-tl-sm z-20"></div>
                     <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-green-500/60 rounded-tr-sm z-20"></div>
                     <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-green-500/60 rounded-bl-sm z-20"></div>
                     <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-green-500/60 rounded-br-sm z-20"></div>
                     
                     {/* Decorative Scanline */}
                     <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent z-10"></div>

                     {/* Header de Mídia do Cubo */}
                     <div className="relative p-8 border-b border-green-900/30 bg-gradient-to-b from-green-900/5 to-transparent">
                        
                        {/* --- BARRA DE PESQUISA --- */}
                        <div className="mb-10 w-full max-w-2xl mx-auto">
                            <div className="relative group/search">
                                <div className="absolute -inset-0.5 bg-green-500/20 rounded-sm blur opacity-0 group-focus-within/search:opacity-100 transition duration-500"></div>
                                <div className="relative flex items-center bg-black border border-green-800 rounded-sm p-3 backdrop-blur-sm transition-colors group-focus-within/search:border-green-400">
                                    <span className="text-green-500 mr-3 animate-pulse font-mono font-bold select-none text-lg">{'>'}</span>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => onSearch(e.target.value)}
                                        placeholder=""
                                        className="w-full bg-transparent border-none outline-none text-green-400 placeholder-green-800/60 font-mono text-sm tracking-widest uppercase focus:ring-0"
                                        autoComplete="off"
                                    />
                                    <SearchIcon className="w-4 h-4 text-green-600/80" />
                                </div>
                            </div>
                        </div>

                        {featuredBeat && (
                            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left animate-fade-in px-4">
                                
                                {/* Big Play Button - Reactor Style */}
                                <div className="relative group/play">
                                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl opacity-0 group-hover/play:opacity-100 transition-opacity"></div>
                                    <button 
                                        onClick={() => onPlayBeat(featuredBeat.id)}
                                        className="w-24 h-24 flex-shrink-0 rounded-full bg-black border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.2)] transition-all hover:scale-105 active:scale-95 group relative z-10"
                                    >
                                        {isFeaturedPlaying ? (
                                            <Pause className="w-10 h-10" />
                                        ) : (
                                            <Play className="w-10 h-10 ml-1" />
                                        )}
                                    </button>
                                </div>

                                {/* Featured Info */}
                                <div className="flex-grow">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                        {isFeaturedPlaying && <SoundWave className="w-4 h-4 text-green-400 animate-pulse" />}
                                        <span className="text-[10px] font-bold tracking-[0.3em] text-green-600 uppercase font-mono bg-green-900/10 px-2 py-0.5 rounded-sm border border-green-900/30">
                                            {isFeaturedPlaying ? 'SYSTEM_ACTIVE' : 'SELECTED_ITEM'}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-bold text-green-400 font-mono tracking-widest uppercase mb-2 drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]">
                                        {featuredBeat.title}
                                    </h2>
                                    <p className="text-green-700 text-sm font-mono tracking-[0.2em] uppercase">
                                        PROD_BY: {featuredBeat.producer}
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-[10px] text-green-800 font-mono tracking-widest">
                                        <span className="bg-black px-2 py-1 rounded-sm border border-green-900/50 uppercase">{featuredBeat.bpm} BPM</span>
                                        <span className="bg-black px-2 py-1 rounded-sm border border-green-900/50">{featuredBeat.key}</span>
                                        <span className="bg-[#1e0538] text-purple-300 px-2 py-1 rounded-sm border border-purple-900/50 shadow-[0_0_5px_rgba(147,51,234,0.3)] uppercase">{featuredBeat.duration}</span>
                                    </div>
                                </div>

                                {/* Header Action - Sci-Fi Cart */}
                                <div className="flex-shrink-0 flex flex-col gap-3 min-w-[160px]">
                                     <button 
                                        onClick={() => onAddToCartClick(featuredBeat)}
                                        className="group relative bg-black hover:bg-purple-900/20 text-white border border-purple-600 font-semibold py-4 px-6 rounded-sm transition-all overflow-hidden"
                                     >
                                        {/* Corner markers on button */}
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-purple-400"></div>
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-purple-400"></div>
                                        
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase mb-1 group-hover:text-purple-300">ACQUIRE_LICENSE</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-400 font-bold font-mono text-xl tracking-wider drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                                                    {featuredBeat.price_mp3 > 0 ? `R$ ${featuredBeat.price_mp3.toFixed(2)}` : 'FREE'}
                                                </span>
                                            </div>
                                        </div>
                                     </button>

                                     <button
                                        onClick={() => onDownloadClick(featuredBeat)}
                                        className="bg-transparent border border-green-900 text-green-700 hover:text-green-400 hover:border-green-500 py-2 px-4 rounded-sm transition-all text-[10px] font-mono tracking-widest uppercase flex items-center justify-center gap-2"
                                     >
                                        <ArrowDownToLine className="w-3 h-3" />
                                        <span>DOWNLOAD_PREVIEW</span>
                                     </button>
                                </div>
                            </div>
                        )}
                     </div>

                     {/* Lista de Beats */}
                     <div className="flex flex-col bg-black/40 min-h-[400px]">
                        {beats.map((beat) => (
                            <BeatRow
                                key={beat.id}
                                beat={beat}
                                onPlayBeat={onPlayBeat}
                                currentBeat={currentBeat}
                                isPlaying={isPlaying}
                                onAddToCartClick={onAddToCartClick}
                                onDownloadClick={onDownloadClick}
                            />
                        ))}
                        {beats.length === 0 && (
                            <div className="flex-grow flex flex-col items-center justify-center p-12 text-green-800/50 border-t border-green-900/10">
                                <SearchIcon className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-mono text-xs tracking-widest uppercase">NO_DATA_FOUND_IN_SECTOR</p>
                            </div>
                        )}
                     </div>
                </Card>

                {/* Social Connection System */}
                <div className="mt-8 flex flex-col items-center animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4 opacity-70">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-mono text-green-500 tracking-[0.3em] uppercase">SYSTEM.CONNECTIONS</span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-6 p-6 border border-green-900/30 bg-black/40 backdrop-blur-sm rounded-sm relative">
                        {/* Decorative borders */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500/30"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-green-500/30"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-green-500/30"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500/30"></div>

                        <SocialLink href={socialLinks.instagram} icon={InstagramIcon} />
                        <SocialLink href={socialLinks.youtube} icon={YoutubeIcon} />
                        <SocialLink href={socialLinks.tiktok} icon={TiktokIcon} />
                        <SocialLink href={socialLinks.spotify} icon={SpotifyIcon} />
                        <SocialLink href={socialLinks.twitter} icon={TwitterIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreSection;
