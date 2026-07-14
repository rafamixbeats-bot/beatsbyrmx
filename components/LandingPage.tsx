
import React, { useState, useEffect, useRef } from 'react';

const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [transitioning, setTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasTransitioned = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
                const maxScroll = scrollHeight - clientHeight;
                const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
                setScrollProgress(progress);

                // Quando chegar perto do final, transiciona automaticamente
                if (progress > 85 && !hasTransitioned.current) {
                    hasTransitioned.current = true;
                    setTransitioning(true);
                    setTimeout(() => {
                        onEnter();
                    }, 1200);
                }
            }
        };

        const el = containerRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll);
            return () => el.removeEventListener('scroll', handleScroll);
        }
    }, [onEnter]);

    return (
        <div ref={containerRef} className="fixed inset-0 overflow-y-auto bg-black z-50 scrollbar-thin">
            {/* Progress indicator no topo */}
            <div className="fixed top-0 left-0 right-0 h-[2px] bg-green-900/30 z-50">
                <div 
                    className="h-full bg-green-500 transition-all duration-100 shadow-[0_0_8px_rgba(74,222,128,0.6)]"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Corner markers da tela */}
            <div className="fixed top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-green-500/40 z-40 pointer-events-none"></div>
            <div className="fixed top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-green-500/40 z-40 pointer-events-none"></div>
            <div className="fixed bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-green-500/40 z-40 pointer-events-none"></div>
            <div className="fixed bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-green-500/40 z-40 pointer-events-none"></div>

            {/* HUD info */}
            <div className="fixed top-5 left-12 z-40 pointer-events-none">
                <span className="text-[9px] font-mono text-green-700 tracking-[0.3em] uppercase">RMX_SOUND_LAB</span>
            </div>
            <div className="fixed top-5 right-12 z-40 pointer-events-none">
                <span className="text-[9px] font-mono text-green-700 tracking-[0.3em] uppercase">
                    SYS::INIT {scrollProgress.toFixed(0)}%
                </span>
            </div>

            <div className="min-h-screen flex items-center justify-center px-6 py-24">
                <div className="max-w-4xl mx-auto w-full">
                    {/* Logo / Título */}
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="inline-block mb-6">
                            <img 
                                src="/logo-rmx-transparent.png" 
                                alt="RMX" 
                                className="h-24 md:h-32 w-auto mx-auto object-contain opacity-90"
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

                    {/* Container principal de bio */}
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
                            <img 
                                src="/studio-standing.png" 
                                alt="RMX no estúdio" 
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-mono text-green-500 tracking-[0.3em] uppercase drop-shadow-[0_0_3px_rgba(0,0,0,1)]">
                                    STUDIO_SECTOR_01
                                </span>
                            </div>
                        </div>

                        <div className="text-sm md:text-base text-green-700 font-mono leading-relaxed mb-8">
                            <p>
                                Acredito que uma boa música vai muito além de uma boa produção. Cada artista tem uma história, uma identidade e uma mensagem que merecem ser respeitadas. Meu compromisso é entregar um trabalho com qualidade, transparência e dedicação, para que sua música represente exatamente quem você é.
                            </p>
                        </div>

                        <div className="my-10 rounded-sm overflow-hidden border border-green-900/30 relative group">
                            <img 
                                src="/studio-sitting.png" 
                                alt="RMX produzindo" 
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-mono text-green-500 tracking-[0.3em] uppercase drop-shadow-[0_0_3px_rgba(0,0,0,1)]">
                                    STUDIO_SECTOR_02
                                </span>
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
                            <p className="text-green-700 font-mono text-xs mt-2 uppercase tracking-widest">
                                Provérbios 16:3
                            </p>
                        </div>
                    </div>

                    {/* Espaço para scroll + indicador de transição */}
                    <div className="h-48 flex flex-col items-center justify-center">
                        {transitioning ? (
                            <div className="text-center animate-pulse">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-mono text-green-400 tracking-[0.3em] uppercase">ACCESS GRANTED</span>
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                <span className="text-[9px] font-mono text-green-700 tracking-[0.3em] uppercase">
                                    ENTERING BEAT LIBRARY...
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-green-500/40 to-transparent"></div>
                                <span className="text-[9px] font-mono text-green-800 tracking-[0.3em] uppercase">
                                    SCROLL DOWN
                                </span>
                                <div className="w-[1px] h-8 bg-gradient-to-b from-green-500/40 to-transparent animate-pulse"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
