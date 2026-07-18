
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
        const w = 800, h = 800;
        canvas.width = w; canvas.height = h;

        // === BACKGROUND ===
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        // Grid overlay (20px)
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.08)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < w; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
        for (let i = 0; i < h; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

        // === OUTER BORDER ===
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, w, h);

        // === TOP HEADER BAR ===
        ctx.fillStyle = 'rgba(34, 197, 94, 0.05)';
        ctx.fillRect(0, 0, w, 60);
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, 60); ctx.lineTo(w, 60); ctx.stroke();

        // Checkbox
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(25, 20, 16, 16);

        // LAB-001
        ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('LAB-001', 55, 33);

        // Green dot + SAMPLES
        ctx.fillStyle = '#22c55e';
        ctx.beginPath(); ctx.arc(w - 85, 28, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${sampleCount} SAMPLES`, w - 75, 33);

        // === TITLE ===
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(74, 222, 128, 0.15)';
        ctx.shadowBlur = 10;
        const displayTitle = title.toUpperCase().replace(/[^A-Z0-9 _]/g, '').trim();
        if (displayTitle.length > 16) {
            const words = displayTitle.split(/[\s_]+/).filter(Boolean);
            const mid = Math.ceil(words.length / 2);
            const line1 = words.slice(0, mid).join(' ');
            const line2 = words.slice(mid).join(' ');
            ctx.fillText(line1, 50, 130);
            ctx.fillText(line2, 50, 185);
        } else {
            ctx.fillText(displayTitle, 50, 155);
        }
        ctx.shadowBlur = 0;

        // === DESCRIPTION LINES ===
        ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
        ctx.font = '13px monospace';
        const descY = displayTitle.length > 16 ? 220 : 185;
        ctx.fillText(`// ${sampleCount} SAMPLES LOADED`, 50, descY);
        ctx.fillText('// FORMAT: WAV + MP3', 50, descY + 22);
        ctx.fillText('// ROYALTY FREE', 50, descY + 44);

        // === MONITOR BOX (waveform) ===
        const monX = 50;
        const monY = descY + 70;
        const monW = w - 100;
        const monH = 180;

        ctx.fillStyle = 'rgba(34, 197, 94, 0.04)';
        ctx.fillRect(monX, monY, monW, monH);
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(monX, monY, monW, monH);

        // Waveform
        ctx.beginPath();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
        ctx.shadowBlur = 4;
        const waveY = monY + monH / 2;
        ctx.moveTo(monX + 20, waveY);
        for (let x = monX + 20; x < monX + monW - 20; x += 2) {
            const progress = (x - monX - 20) / (monW - 40);
            let y = waveY;
            const pos = (progress * 5) % 1;
            if (pos > 0.1 && pos < 0.14) y = waveY - 5;
            else if (pos > 0.14 && pos < 0.18) y = waveY + 3;
            else if (pos > 0.18 && pos < 0.22) y = waveY - 30;
            else if (pos > 0.22 && pos < 0.26) y = waveY + 18;
            else if (pos > 0.26 && pos < 0.3) y = waveY - 3;
            else if (pos > 0.4 && pos < 0.5) y = waveY - 8;
            else if (pos > 0.6 && pos < 0.65) y = waveY + 4;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // === BOTTOM SECTION ===
        const bottomY = monY + monH + 30;

        // Kit name again
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'left';
        if (displayTitle.length > 16) {
            const words = displayTitle.split(/[\s_]+/).filter(Boolean);
            const mid = Math.ceil(words.length / 2);
            ctx.fillText(words.slice(0, mid).join(' '), 50, bottomY + 30);
            ctx.fillText(words.slice(mid).join(' '), 50, bottomY + 65);
        } else {
            ctx.fillText(displayTitle, 50, bottomY + 35);
        }

        // Description
        ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.font = '10px monospace';
        const tagY = displayTitle.length > 16 ? bottomY + 90 : bottomY + 60;
        ctx.fillText('COMPOUND DATA PENDING ANALYSIS.', 50, tagY);

        // TAG badge
        ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
        const tagText = 'TRAP';
        const tagTextW = ctx.measureText(tagText).width;
        ctx.fillRect(50, tagY + 10, tagTextW + 16, 20);
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.strokeRect(50, tagY + 10, tagTextW + 16, 20);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.font = '9px monospace';
        ctx.fillText(tagText, 58, tagY + 24);

        // === PRICE BAR ===
        const priceBarY = h - 80;
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, priceBarY); ctx.lineTo(w, priceBarY); ctx.stroke();

        // "COMPRA VIA LOT"
        ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('COMPRA VIA LOT', 50, priceBarY + 20);

        // Price - no value in preview (title-based)
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('R$ 0,00', 50, priceBarY + 55);

        // === CORNER MARKERS ===
        const cs = 12;
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(8, 8 + cs); ctx.lineTo(8, 8); ctx.lineTo(8 + cs, 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - 8 - cs, 8); ctx.lineTo(w - 8, 8); ctx.lineTo(w - 8, 8 + cs); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(8, h - 8 - cs); ctx.lineTo(8, h - 8); ctx.lineTo(8 + cs, h - 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - 8 - cs, h - 8); ctx.lineTo(w - 8, h - 8); ctx.lineTo(w - 8, h - 8 - cs); ctx.stroke();

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
