
import React, { useRef, useEffect, useState } from 'react';

interface KitArtworkGeneratorProps {
    title: string;
    sampleCount?: number;
    onGenerated: (dataUrl: string) => void;
}

const KitArtworkGenerator: React.FC<KitArtworkGeneratorProps> = ({ title, sampleCount = 0, onGenerated }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [generating, setGenerating] = useState(false);

    const generateArtwork = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setGenerating(true);
        const w = 800;
        const h = 800;
        canvas.width = w;
        canvas.height = h;

        // Background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, w, h);

        // Grid background
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < w; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, h);
            ctx.stroke();
        }
        for (let i = 0; i < h; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(w, i);
            ctx.stroke();
        }

        // Border
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(15, 15, w - 30, h - 30);

        // Corner markers
        const cornerSize = 20;
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.8)';
        ctx.lineWidth = 2;
        // Top-left
        ctx.beginPath(); ctx.moveTo(15, 15 + cornerSize); ctx.lineTo(15, 15); ctx.lineTo(15 + cornerSize, 15); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(w - 15 - cornerSize, 15); ctx.lineTo(w - 15, 15); ctx.lineTo(w - 15, 15 + cornerSize); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(15, h - 15 - cornerSize); ctx.lineTo(15, h - 15); ctx.lineTo(15 + cornerSize, h - 15); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(w - 15 - cornerSize, h - 15); ctx.lineTo(w - 15, h - 15); ctx.lineTo(w - 15, h - 15 - cornerSize); ctx.stroke();

        // Scanlines
        ctx.fillStyle = 'rgba(74, 222, 128, 0.03)';
        for (let i = 0; i < h; i += 4) {
            ctx.fillRect(0, i, w, 1);
        }

        // Top bracket
        ctx.fillStyle = 'rgba(74, 222, 128, 0.7)';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('[', 35, 80);
        ctx.textAlign = 'right';
        ctx.fillText(']', w - 35, 80);

        // Title - main
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px monospace';
        ctx.shadowColor = 'rgba(74, 222, 128, 0.5)';
        ctx.shadowBlur = 20;
        const displayTitle = title.toUpperCase() || 'SOUND_KIT';
        
        // Split title if too long
        if (displayTitle.length > 12) {
            const words = displayTitle.split(' ');
            const mid = Math.ceil(words.length / 2);
            const line1 = words.slice(0, mid).join(' ');
            const line2 = words.slice(mid).join(' ');
            ctx.fillText(line1, w / 2, 140);
            ctx.fillText(line2, w / 2, 220);
        } else {
            ctx.fillText(displayTitle, w / 2, 180);
        }
        ctx.shadowBlur = 0;

        // Subtitle
        ctx.fillStyle = 'rgba(74, 222, 128, 0.6)';
        ctx.font = '16px monospace';
        ctx.fillText('SOUND KIT // RMX LAB', w / 2, 260);

        // Monitor/screen area
        const monitorX = 80;
        const monitorY = 290;
        const monitorW = w - 160;
        const monitorH = 200;

        // Monitor bg
        ctx.fillStyle = '#050505';
        ctx.fillRect(monitorX, monitorY, monitorW, monitorH);
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(monitorX, monitorY, monitorW, monitorH);

        // ECG line
        ctx.beginPath();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(34, 197, 94, 0.8)';
        ctx.shadowBlur = 8;

        const ecgY = monitorY + monitorH / 2;
        ctx.moveTo(monitorX + 10, ecgY);
        for (let x = monitorX + 10; x < monitorX + monitorW - 10; x += 2) {
            const progress = (x - monitorX) / monitorW;
            let y = ecgY;
            
            // Create ECG pattern
            const pos = (progress * 8) % 1;
            if (pos > 0.1 && pos < 0.15) y = ecgY - 8;
            else if (pos > 0.15 && pos < 0.2) y = ecgY + 5;
            else if (pos > 0.2 && pos < 0.25) y = ecgY - 40;
            else if (pos > 0.25 && pos < 0.3) y = ecgY + 25;
            else if (pos > 0.3 && pos < 0.35) y = ecgY - 5;
            else if (pos > 0.35 && pos < 0.4) y = ecgY;
            else if (pos > 0.5 && pos < 0.6) y = ecgY - 12;
            else if (pos > 0.6 && pos < 0.7) y = ecgY;
            
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Info panels
        const panelY = 520;

        // Left panel - system info
        ctx.fillStyle = 'rgba(74, 222, 128, 0.05)';
        ctx.fillRect(40, panelY, w / 2 - 60, 120);
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
        ctx.strokeRect(40, panelY, w / 2 - 60, 120);

        ctx.fillStyle = 'rgba(74, 222, 128, 0.6)';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        const infoLines = [
            `[ SYSTEM:  RMX_LAB ]`,
            `[ CREATOR: RMX ]`,
            ``,
            `[ SAMPLES: ${sampleCount}_LOADED ]`,
            `[ FORMAT:  24-BIT_WAV ]`,
            `[ ROYALTY: FREE ]`,
        ];
        infoLines.forEach((line, i) => {
            ctx.fillText(line, 55, panelY + 25 + i * 16);
        });

        // Right panel - cart/acquire
        const rightPanelX = w / 2 + 20;
        ctx.fillStyle = 'rgba(138, 43, 226, 0.1)';
        ctx.fillRect(rightPanelX, panelY, w / 2 - 60, 120);
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.4)';
        ctx.strokeRect(rightPanelX, panelY, w / 2 - 60, 120);

        ctx.fillStyle = 'rgba(138, 43, 226, 0.7)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[ SOUND KIT INFO ]', rightPanelX + (w / 2 - 60) / 2, panelY + 25);

        // Cart button
        ctx.fillStyle = 'rgba(138, 43, 226, 0.8)';
        ctx.fillRect(rightPanelX + 20, panelY + 45, w / 2 - 100, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('_ACQUIRE_KIT_', rightPanelX + (w / 2 - 60) / 2, panelY + 70);

        // Bottom line
        ctx.fillStyle = 'rgba(74, 222, 128, 0.3)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`CREATED BY RMX // ${new Date().getFullYear()}`, w / 2, h - 40);

        // Generate data URL
        const dataUrl = canvas.toDataURL('image/png');
        setGenerating(false);
        onGenerated(dataUrl);
    };

    useEffect(() => {
        if (title) {
            generateArtwork();
        }
    }, [title, sampleCount]);

    return (
        <div className="space-y-3">
            <canvas ref={canvasRef} className="hidden" />
            {title && (
                <div className="relative">
                    <img 
                        src={canvasRef.current?.toDataURL('image/png')} 
                        alt="Artwork Preview" 
                        className="w-full max-w-xs rounded-sm border border-green-900/30"
                    />
                    {generating && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-sm">
                            <span className="text-green-400 font-mono text-xs animate-pulse">GENERATING...</span>
                        </div>
                    )}
                </div>
            )}
            <button
                type="button"
                onClick={generateArtwork}
                disabled={!title}
                className="w-full text-[10px] font-mono text-green-600 hover:text-green-400 border border-green-900/30 hover:border-green-500/50 py-2 px-4 rounded-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest"
            >
                {generating ? 'GENERATING ARTWORK...' : '>> GERAR ARTWORK AUTOMÁTICA'}
            </button>
        </div>
    );
};

export default KitArtworkGenerator;
