
import React, { useState, useEffect, useRef } from 'react';

interface TypingLine {
    prefix?: string;
    text: string;
    delay?: number;
    speed?: number;
    className?: string;
}

interface TypingTransitionProps {
    lines: TypingLine[];
    onComplete?: () => void;
}

const TypingTransition: React.FC<TypingTransitionProps> = ({ lines, onComplete }) => {
    const [currentLine, setCurrentLine] = useState(0);
    const [currentChar, setCurrentChar] = useState(0);
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentPrefix, setCurrentPrefix] = useState('');
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Iniciar quando visível
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.3 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [started]);

    // Digitação
    useEffect(() => {
        if (!started || done) return;

        if (currentLine >= lines.length) {
            setDone(true);
            onComplete?.();
            return;
        }

        const line = lines[currentLine];

        // Delay antes de começar a digitar a linha
        if (currentChar === 0 && !currentPrefix) {
            setCurrentPrefix(line.prefix || '>');
            const delay = setTimeout(() => {
                setCurrentChar(1);
            }, line.delay || 300);
            return () => clearTimeout(delay);
        }

        // Digitar caractere por caractere
        if (currentChar <= line.text.length) {
            const timeout = setTimeout(() => {
                setCurrentChar(prev => prev + 1);
            }, line.speed || 30);
            return () => clearTimeout(timeout);
        }

        // Linha completa, passar para a próxima
        if (currentChar > line.text.length) {
            const timeout = setTimeout(() => {
                setDisplayedLines(prev => [...prev, line.text]);
                setCurrentLine(prev => prev + 1);
                setCurrentChar(0);
                setCurrentPrefix('');
            }, 200);
            return () => clearTimeout(timeout);
        }
    }, [started, currentLine, currentChar, currentPrefix, lines, done, onComplete]);

    const currentLineText = currentLine < lines.length 
        ? lines[currentLine].text.substring(0, currentChar) 
        : '';

    return (
        <div ref={containerRef} className="my-16 flex justify-center">
            <div className="bg-black border border-green-900/30 rounded-sm p-6 md:p-8 w-full max-w-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-green-500/50"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-green-500/50"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-green-500/50"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-green-500/50"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>

                {/* Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-900/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-mono text-green-700 tracking-[0.3em] uppercase">SYSTEM_TERMINAL</span>
                </div>

                {/* Terminal output */}
                <div className="font-mono text-xs md:text-sm space-y-1.5 min-h-[120px]">
                    {/* Linhas completas */}
                    {displayedLines.map((line, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 flex-shrink-0">{'>'}</span>
                            <span className="text-green-400 tracking-wider">{line}</span>
                            <span className="text-green-600 text-[10px] flex-shrink-0">[OK]</span>
                        </div>
                    ))}

                    {/* Linha atual sendo digitada */}
                    {currentLine < lines.length && !done && (
                        <div className="flex items-start gap-2">
                            <span className="text-green-500 flex-shrink-0">{currentPrefix || '>'}</span>
                            <span className="text-green-400 tracking-wider">{currentLineText}</span>
                            <span className="inline-block w-[7px] h-3.5 bg-green-500 animate-pulse flex-shrink-0 mt-0.5"></span>
                        </div>
                    )}

                    {/* Linha final */}
                    {done && (
                        <div className="flex items-start gap-2 pt-2 border-t border-green-900/20 mt-2">
                            <span className="text-green-400 flex-shrink-0">{'>'}</span>
                            <span className="text-green-300 tracking-wider font-bold">BEAT_LIBRARY READY</span>
                            <span className="text-green-500 text-[10px] flex-shrink-0">[OK]</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TypingTransition;
