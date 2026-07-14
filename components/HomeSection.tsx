
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, ShoppingCart, SoundWave, ArrowDownToLine, SearchIcon, YoutubeIcon, TiktokIcon, InstagramIcon, SpotifyIcon, TwitterIcon } from './icons';
import type { Beat, SocialLinks } from '../App';
import Card from './ContactSection';
import { slugify } from './BeatPage';
import TypingTransition from './TypingTransition';

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
                <div className="flex flex-col min-w-0 mr-2 sm:mr-4">
                    <Link to={`/beat/${slugify(beat.title)}`} onClick={(e) => e.stopPropagation()} className="font-bold font-mono text-xs sm:text-base truncate transition-colors text-green-400 tracking-widest uppercase drop-shadow-[0_0_2px_rgba(74,222,128,0.3)] group-hover:text-green-300 hover:text-green-300 hover:underline">
                        {beat.title}
                    </Link>
                    
                    {/* Metadata with Tech/Lab Font */}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-slate-500 mt-1 font-mono tracking-widest">
                        <span className="font-bold text-green-800 uppercase">{beat.producer}</span>
                        <span className="text-green-900/50 hidden sm:inline">::</span>
                        <span className="text-green-700 uppercase hidden sm:inline">{beat.bpm} BPM</span>
                        <span className="text-green-900/50 hidden sm:inline">::</span>
                        <span className="text-green-700 hidden sm:inline">{beat.key}</span>
                        <span className="text-green-900/50 hidden sm:inline">::</span>
                        <span className="bg-[#1e0538] text-purple-300 px-1 sm:px-1.5 py-0.5 rounded-sm border border-purple-900/50 uppercase">
                            {beat.duration}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions & Price - Right Side Fixed Alignment */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 pl-2 sm:pl-4 border-l border-green-900/20">
                
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
                        {beat.price_mp3 > 0 ? `R$ ${beat.price_mp3.toFixed(2)}` : beat.price_wav > 0 ? `R$ ${beat.price_wav.toFixed(2)}` : 'FREE'}
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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* === LANDING / APRESENTAÇÃO === */}
                <div className="mb-16">
                    {/* Logo */}
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="inline-block mb-6">
                            <img 
                                src="/logo-rmx-transparent.png" 
                                alt="RMX" 
                                className="h-20 md:h-28 w-auto mx-auto object-contain opacity-90"
                            />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-mono text-green-500 tracking-[0.4em] uppercase">SOUND_LAB</span>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-[9px] font-mono text-green-800 tracking-[0.3em] uppercase">
                            ENG_DE_AUDIO // MIX // MASTER
                        </p>
                    </div>

                    {/* Bio Container */}
                    <div className="bg-black border border-green-900/30 rounded-sm p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-green-500/50"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-green-500/50"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-green-500/50"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-green-500/50"></div>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>

                        <h2 className="text-lg md:text-2xl font-bold text-green-400 font-mono uppercase tracking-widest mb-10 text-center leading-relaxed">
                            Transformando ideias em músicas com identidade, emoção e qualidade profissional.
                        </h2>

                        <div className="text-sm md:text-base text-green-700 font-mono leading-relaxed mb-8">
                            <p>
                                Sou <span className="text-green-400 font-bold">Rafael Magalhães</span>, mais conhecido como <span className="text-green-400 font-bold">RMX</span> ou <span className="text-green-400 font-bold">Rafa Mix</span>. Sou do Rio de Janeiro, engenheiro de mixagem e masterização, e produzo música desde os 16 anos. Hoje, aos 33 anos, continuo estudando, evoluindo e buscando extrair o melhor de cada projeto que passa pelas minhas mãos.
                            </p>
                        </div>

                        <div className="my-10 rounded-sm overflow-hidden border border-green-900/30 relative group">
                            <img src="/studio-standing.png" alt="RMX no estúdio" className="w-full h-auto object-cover max-h-[500px]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-mono text-green-500 tracking-[0.3em] uppercase drop-shadow-[0_0_3px_rgba(0,0,0,1)]">STUDIO_SECTOR_01</span>
                            </div>
                        </div>

                        <div className="text-sm md:text-base text-green-700 font-mono leading-relaxed mb-8">
                            <p>
                                Acredito que uma boa música vai muito além de uma boa produção. Cada artista tem uma história, uma identidade e uma mensagem que merecem ser respeitadas. Meu compromisso é entregar um trabalho com qualidade, transparência e dedicação, para que sua música represente exatamente quem você é.
                            </p>
                        </div>

                        <div className="my-10 rounded-sm overflow-hidden border border-green-900/30 relative group">
                            <img src="/studio-sitting.png" alt="RMX produzindo" className="w-full h-auto object-cover max-h-[500px]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-mono text-green-500 tracking-[0.3em] uppercase drop-shadow-[0_0_3px_rgba(0,0,0,1)]">STUDIO_SECTOR_02</span>
                            </div>
                        </div>

                        <div className="text-sm md:text-base text-green-700 font-mono leading-relaxed mb-8">
                            <p>
                                A música sempre foi o meu maior propósito. Meu sonho é viver dela, e acredito que o seu também seja transformar sua arte em algo cada vez maior. É por isso que vejo cada projeto como uma parceria, não apenas como um serviço.
                            </p>
                        </div>

                        <div className="text-sm md:text-base text-green-700 font-mono leading-relaxed mb-8">
                            <p>
                                Se você chegou até aqui, talvez estejamos buscando a mesma coisa: criar músicas que conectem pessoas, despertem emoções e deixem uma marca. Será um prazer fazer parte da sua jornada e contribuir para que sua música alcance o resultado que você sempre imaginou.
                            </p>
                        </div>

                        <div className="mt-10 pt-6 border-t border-green-900/30 text-center">
                            <blockquote className="text-green-400 font-mono text-sm md:text-base italic">
                                "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos."
                            </blockquote>
                            <p className="text-green-700 font-mono text-xs mt-2 uppercase tracking-widest">Provérbios 16:3</p>
                        </div>
                    </div>

                    {/* Transição digital para a beat library */}
                    <TypingTransition lines={[
                        { text: 'ACCESS GRANTED', delay: 400, speed: 35 },
                        { text: 'INITIALIZING AUDIO DATABASE...', delay: 300, speed: 25 },
                        { text: 'SCANNING SAMPLES...', delay: 200, speed: 30 },
                        { text: 'LOADING BEAT_LIBRARY...', delay: 200, speed: 25 },
                    ]} />
                </div>

                {/* === BEAT LIBRARY === */}
                 {/* O "Cubo" da Playlist - Sci-Fi Container */}
                <Card className="bg-black/90 backdrop-blur-xl border border-green-900/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden flex flex-col relative group">
                     
                     {/* Tech Corners (Absolute) */}
                     <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-green-500/60 rounded-tl-sm z-20"></div>
                     <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-green-500/60 rounded-tr-sm z-20"></div>
                     <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-green-500/60 rounded-bl-sm z-20"></div>
                     <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-green-500/60 rounded-br-sm z-20"></div>
                     
                     {/* Decorative Scanline */}
                     <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent z-10"></div>

                     {/* Header do Terminal */}
                     <div className="relative p-4 border-b border-green-900/30 bg-gradient-to-b from-green-900/5 to-transparent">
                         <div className="flex items-center justify-between px-2">
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                 <span className="text-[10px] font-mono text-green-500 tracking-[0.3em] uppercase">BEAT_DATABASE</span>
                             </div>
                             <span className="text-[9px] font-mono text-green-800 tracking-widest">{beats.length} ITEMS</span>
                         </div>
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
