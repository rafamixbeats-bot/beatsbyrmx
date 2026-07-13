
import React, { useState, useEffect } from 'react';

interface BootTransitionProps {
    onComplete: () => void;
}

const BootTransition: React.FC<BootTransitionProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const steps = [
        'RMX SOUND LAB',
        'CORE INITIALIZED...',
        'SCANNING AUDIO DATABASE...',
        'ACCESS GRANTED.',
        'ENTERING BEAT LIBRARY...'
    ];

    useEffect(() => {
        // Sequência de texto
        const stepTimers: number[] = [];
        steps.forEach((_, idx) => {
            const t = window.setTimeout(() => {
                setCurrentStep(idx + 1);
                if (idx === 2) {
                    // Iniciar barra de progresso quando chegar no "SCANNING"
                    startLoading();
                }
                if (idx === steps.length - 1) {
                    // Último step → completar após 800ms
                    const complete = window.setTimeout(() => {
                        onComplete();
                    }, 900);
                    stepTimers.push(complete);
                }
            }, idx * 700);
            stepTimers.push(t);
        });

        return () => {
            stepTimers.forEach(t => clearTimeout(t));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startLoading = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 18 + 8;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            setLoadingProgress(Math.floor(progress));
        }, 120);
    };

    return (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center px-6">
            {/* Corner markers */}
            <div className="fixed top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-500/40"></div>
            <div className="fixed top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-green-500/40"></div>
            <div className="fixed bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-green-500/40"></div>
            <div className="fixed bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-green-500/40"></div>

            <div className="w-full max-w-2xl">
                {/* Terminal content */}
                <div className="relative bg-black border border-green-900/40 rounded-sm p-8 md:p-12">
                    <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-green-500/50"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-green-500/50"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-green-500/50"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-green-500/50"></div>

                    {/* Scanline topo */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>

                    {/* Status bar topo */}
                    <div className="flex items-center justify-between mb-8 pb-3 border-b border-green-900/30">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-mono text-green-600 tracking-[0.3em] uppercase">SYSTEM_BOOT</span>
                        </div>
                        <span className="text-[9px] font-mono text-green-800 tracking-[0.2em] uppercase">
                            v1.0.0
                        </span>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4 font-mono min-h-[280px]">
                        {steps.map((step, idx) => {
                            const isVisible = idx < currentStep;
                            const isLoading = idx === 2 && currentStep > 2 && loadingProgress < 100;
                            const isGranted = idx === 3 && currentStep > 3;
                            const isEntering = idx === 4 && currentStep > 4;

                            return (
                                <div 
                                    key={idx}
                                    className={`transition-all duration-300 ${
                                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isVisible && (
                                            <>
                                                <span className="text-green-500">{'>'}</span>
                                                <span className={`font-mono tracking-widest uppercase text-sm md:text-base ${
                                                    isGranted || isEntering ? 'text-green-300 font-bold' : 'text-green-400'
                                                }`}>
                                                    {step}
                                                </span>
                                                {(idx === 0 || idx === 1 || idx === 3) && (
                                                    <span className="text-green-600 text-xs">[OK]</span>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Barra de loading no SCANNING */}
                                    {isLoading && (
                                        <div className="mt-2 ml-6">
                                            <div className="w-full max-w-md h-2 bg-green-900/20 border border-green-900/40 overflow-hidden">
                                                <div 
                                                    className="h-full bg-green-500 transition-all duration-100 shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                                                    style={{ width: `${loadingProgress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[9px] font-mono text-green-700 tracking-widest uppercase">
                                                    LOADING...
                                                </span>
                                                <span className="text-[9px] font-mono text-green-500 tracking-widest">
                                                    {loadingProgress}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Blink cursor */}
                    {currentStep > 0 && currentStep < steps.length + 1 && (
                        <div className="mt-6 flex items-center gap-2">
                            <span className="text-green-500 font-mono">{'>'}</span>
                            <span className="inline-block w-2 h-4 bg-green-500 animate-pulse"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BootTransition;
