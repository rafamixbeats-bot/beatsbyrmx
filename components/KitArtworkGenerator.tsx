
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

        // Background - dark lab
        ctx.fillStyle = '#050808';
        ctx.fillRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.04)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < w; i += 30) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
        }
        for (let i = 0; i < h; i += 30) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
        }

        // Scanlines
        ctx.fillStyle = 'rgba(0, 255, 65, 0.015)';
        for (let i = 0; i < h; i += 3) {
            ctx.fillRect(0, i, w, 1);
        }

        // Outer border - double line lab style
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(20, 20, w - 40, h - 40);
        ctx.strokeRect(24, 24, w - 48, h - 48);

        // Corner brackets
        const cs = 30;
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.7)';
        ctx.lineWidth = 2;
        // TL
        ctx.beginPath(); ctx.moveTo(20, 20 + cs); ctx.lineTo(20, 20); ctx.lineTo(20 + cs, 20); ctx.stroke();
        // TR
        ctx.beginPath(); ctx.moveTo(w - 20 - cs, 20); ctx.lineTo(w - 20, 20); ctx.lineTo(w - 20, 20 + cs); ctx.stroke();
        // BL
        ctx.beginPath(); ctx.moveTo(20, h - 20 - cs); ctx.lineTo(20, h - 20); ctx.lineTo(20 + cs, h - 20); ctx.stroke();
        // BR
        ctx.beginPath(); ctx.moveTo(w - 20 - cs, h - 20); ctx.lineTo(w - 20, h - 20); ctx.lineTo(w - 20, h - 20 - cs); ctx.stroke();

        // Top header bar
        ctx.fillStyle = 'rgba(0, 255, 65, 0.08)';
        ctx.fillRect(30, 30, w - 60, 50);
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(30, 80); ctx.lineTo(w - 30, 80); ctx.stroke();

        ctx.font = '11px monospace';
        ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
        ctx.textAlign = 'left';
        ctx.fillText('RMX_LAB // SOUND CHEMISTRY', 45, 50);
        ctx.textAlign = 'right';
        ctx.fillText(`ID:${Date.now().toString(36).toUpperCase().slice(-6)}`, w - 45, 50);
        ctx.textAlign = 'left';
        ctx.fillText('CLASS: AUDIOreagent', 45, 68);
        ctx.textAlign = 'right';
        ctx.fillText(`SAMPLES: ${sampleCount}`, w - 45, 68);

        // === CHEMICAL ELEMENT BOX ===
        const elX = 60;
        const elY = 110;
        const elW = w - 120;
        const elH = 340;

        // Element box bg
        ctx.fillStyle = 'rgba(0, 255, 65, 0.03)';
        ctx.fillRect(elX, elY, elW, elH);
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(elX, elY, elW, elH);

        // Atomic number (top-left)
        ctx.fillStyle = 'rgba(0, 255, 65, 0.6)';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'left';
        const atomicNum = Math.floor(Math.random() * 100) + 1;
        ctx.fillText(String(atomicNum).padStart(2, '0'), elX + 20, elY + 35);

        // Category tag (top-right)
        ctx.textAlign = 'right';
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';
        ctx.fillText('TRANSITION_METAL', elX + elW - 20, elY + 25);
        ctx.fillText('GROUP: MELodic', elX + elW - 20, elY + 40);

        // Divider line
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(elX + 15, elY + 50); ctx.lineTo(elX + elW - 15, elY + 50); ctx.stroke();

        // CHEMICAL SYMBOL (big center)
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 255, 65, 0.6)';
        ctx.shadowBlur = 30;

        // Extract symbol from title - take first letters of each word or first 2 chars
        const titleUpper = title.toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
        const words = titleUpper.split(/\s+/).filter(Boolean);
        let symbol = '';
        if (words.length === 1) {
            symbol = words[0].slice(0, 3);
        } else if (words.length === 2) {
            symbol = words[0].slice(0, 2) + words[1].slice(0, 1);
        } else {
            symbol = words.map(w => w[0]).join('').slice(0, 3);
        }
        if (symbol.length < 2) symbol = titleUpper.slice(0, 3);

        ctx.font = 'bold 120px monospace';
        ctx.fillText(symbol, w / 2, elY + 190);
        ctx.shadowBlur = 0;

        // Element name (full title)
        ctx.fillStyle = 'rgba(0, 255, 65, 0.8)';
        ctx.font = '16px monospace';
        const displayName = titleUpper.length > 30 ? titleUpper.slice(0, 30) + '...' : titleUpper;
        ctx.fillText(displayName, w / 2, elY + 230);

        // Atomic mass / info line
        ctx.fillStyle = 'rgba(0, 255, 65, 0.35)';
        ctx.font = '12px monospace';
        ctx.fillText(`${sampleCount} Samples // 24-Bit WAV // Royalty Free`, w / 2, elY + 260);

        // Bottom divider
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
        ctx.beginPath(); ctx.moveTo(elX + 15, elY + 280); ctx.lineTo(elX + elW - 15, elY + 280); ctx.stroke();

        // Electron config style
        ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.font = '10px monospace';
        ctx.fillText(`ELECTRON_CONFIG: [${sampleCount}s${sampleCount > 10 ? '²' : ''}] // STATE: SOLID`, w / 2, elY + 305);
        ctx.fillText(`HALF_LIFE: PERPETUAL // PURITY: 99.9%`, w / 2, elY + 320);

        // === ECG MONITOR ===
        const monY = 470;
        const monH = 140;

        ctx.fillStyle = '#030505';
        ctx.fillRect(40, monY, w - 80, monH);
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, monY, w - 80, monH);

        // Monitor label
        ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('WAVEFORM_MONITOR', 50, monY + 14);

        // ECG line
        ctx.beginPath();
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 255, 65, 0.7)';
        ctx.shadowBlur = 6;
        const ecgY = monY + monH / 2 + 10;
        ctx.moveTo(50, ecgY);
        for (let x = 50; x < w - 50; x += 2) {
            const progress = (x - 50) / (w - 100);
            let y = ecgY;
            const pos = (progress * 6) % 1;
            if (pos > 0.1 && pos < 0.13) y = ecgY - 6;
            else if (pos > 0.13 && pos < 0.16) y = ecgY + 4;
            else if (pos > 0.16 && pos < 0.2) y = ecgY - 35;
            else if (pos > 0.2 && pos < 0.24) y = ecgY + 20;
            else if (pos > 0.24 && pos < 0.27) y = ecgY - 4;
            else if (pos > 0.35 && pos < 0.45) y = ecgY - 10;
            else if (pos > 0.5 && pos < 0.55) y = ecgY + 5;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // === PRICE / FORMULA SECTION ===
        const priceY = 640;

        // Left: price as "formula"
        ctx.fillStyle = 'rgba(0, 255, 65, 0.06)';
        ctx.fillRect(40, priceY, 340, 120);
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, priceY, 340, 120);

        ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('VALOR_REAGENTE:', 55, priceY + 22);

        const price = kit.price || 0;
        const priceInt = Math.floor(price);
        const priceDec = Math.round((price - priceInt) * 100);
        ctx.fillStyle = '#00ff41';
        ctx.font = 'bold 48px monospace';
        ctx.shadowColor = 'rgba(0, 255, 65, 0.4)';
        ctx.shadowBlur = 10;
        ctx.fillText(`R$ ${priceInt}`, 55, priceY + 78);
        ctx.shadowBlur = 0;
        ctx.font = 'bold 28px monospace';
        ctx.fillStyle = 'rgba(0, 255, 65, 0.7)';
        ctx.fillText(`,${String(priceDec).padStart(2, '0')}`, 55 + ctx.measureText(`R$ ${priceInt}`).width + 4, priceY + 78);

        ctx.fillStyle = 'rgba(0, 255, 65, 0.25)';
        ctx.font = '9px monospace';
        ctx.fillText(`ROYALTY_FREE // LICENCA_ETerna`, 55, priceY + 100);

        // Right: action tag
        const rightX = 410;
        ctx.fillStyle = 'rgba(0, 255, 65, 0.06)';
        ctx.fillRect(rightX, priceY, w - 80 - 370, 120);
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.strokeRect(rightX, priceY, w - 80 - 370, 120);

        ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        const rxCenter = rightX + (w - 80 - 370) / 2;
        ctx.fillText('STATUS:', rxCenter, priceY + 30);
        ctx.fillStyle = '#00ff41';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('AVAILABLE', rxCenter, priceY + 55);
        ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.font = '9px monospace';
        ctx.fillText('ADICIONAR AO CARRINHO', rxCenter, priceY + 80);
        ctx.fillText('DOWNLOAD INSTANTANEO', rxCenter, priceY + 95);

        // Footer
        ctx.fillStyle = 'rgba(0, 255, 65, 0.2)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`RMX_LAB // SOUND CHEMISTRY // ${new Date().getFullYear()}`, w / 2, h - 35);

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
