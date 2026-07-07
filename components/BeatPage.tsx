import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Pause, ShoppingCart, ArrowDownToLine, Share2, CheckCircleIcon, Music, ArrowLeft } from './icons';
import Card from './ContactSection';
import type { Beat, LicenseOption, LicenseType } from '../App';

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

interface BeatPageProps {
  beats: Beat[];
  currentBeat: Beat | null;
  isPlaying: boolean;
  onPlayBeat: (id: string) => void;
  onAddToCartClick: (beat: Beat) => void;
  onDownloadClick: (beat: Beat) => void;
}

const BeatPage: React.FC<BeatPageProps> = ({ beats, currentBeat, isPlaying, onPlayBeat, onAddToCartClick, onDownloadClick }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const beat = useMemo(() => {
    if (!slug || beats.length === 0) return null;
    return beats.find(b => slugify(b.title) === slug) || null;
  }, [slug, beats]);

  useEffect(() => {
    if (beat) {
      document.title = `${beat.title} | RMX Beats`;
    }
    return () => { document.title = 'RMX'; };
  }, [beat]);

  if (!beat) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-green-700 font-mono text-sm uppercase tracking-widest mb-4">BEAT NAO ENCONTRADO</p>
        <Link to="/" className="text-green-400 hover:text-green-300 font-mono text-sm underline">VOLTAR AO STORE</Link>
      </div>
    );
  }

  const isActive = currentBeat?.id === beat.id;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const priceMin = beat.price_mp3 > 0 ? beat.price_mp3 : 0;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-green-700 hover:text-green-400 font-mono text-xs uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>VOLTAR</span>
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Artwork + Player */}
          <div className="space-y-6">
            <div className="relative group rounded-sm overflow-hidden border border-green-900/30 bg-black/60">
              <img src={beat.artworkUrl} alt={beat.title} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Play overlay */}
              <button
                onClick={() => onPlayBeat(beat.id)}
                className={`absolute inset-0 flex items-center justify-center transition-all ${isActive && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${isActive && isPlaying ? 'bg-green-500 text-black shadow-[0_0_30px_rgba(74,222,128,0.5)]' : 'bg-black/70 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-black'}`}>
                  {isActive && isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </div>
              </button>
            </div>

            {/* Tags */}
            {beat.tags && beat.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {beat.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-mono uppercase tracking-widest text-green-700 bg-green-900/10 border border-green-900/30 px-2 py-1 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info + Purchase */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-green-700 mb-2">PRODUCED BY: {beat.producer}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-green-400 font-mono tracking-widest uppercase mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                {beat.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono tracking-widest uppercase">
                <span className="bg-black px-3 py-1.5 rounded-sm border border-green-900/50 text-green-700">{beat.bpm} BPM</span>
                <span className="bg-black px-3 py-1.5 rounded-sm border border-green-900/50 text-green-700">{beat.key}</span>
                <span className="bg-[#1e0538] text-purple-300 px-3 py-1.5 rounded-sm border border-purple-900/50">{beat.duration}</span>
              </div>
            </div>

            {beat.description && (
              <p className="text-green-800 text-sm font-mono leading-relaxed">{beat.description}</p>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-green-700 hover:text-green-400 font-mono text-xs uppercase tracking-widest transition-colors"
            >
              {copied ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'LINK COPIADO!' : 'COMPARTILHAR LINK'}</span>
            </button>

            {/* Purchase Options */}
            <Card className="p-6 border-green-900/30 bg-black/60 space-y-4">
              <h3 className="text-sm font-bold text-green-400 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">
                OPCOES DE LICENCA
              </h3>

              {beat.price_mp3 > 0 && (
                <div className="flex items-center justify-between p-3 rounded-sm bg-green-900/5 border border-green-900/20 hover:border-green-500/30 transition-colors">
                  <div>
                    <p className="font-bold text-green-400 font-mono text-sm uppercase">Licenca Basica</p>
                    <p className="text-[10px] text-green-800 font-mono uppercase">MP3 com tag</p>
                  </div>
                  <span className="font-bold text-green-400 font-mono">R$ {beat.price_mp3.toFixed(2)}</span>
                </div>
              )}

              {beat.price_wav > 0 && (
                <div className="flex items-center justify-between p-3 rounded-sm bg-blue-900/5 border border-blue-900/20 hover:border-blue-500/30 transition-colors">
                  <div>
                    <p className="font-bold text-blue-400 font-mono text-sm uppercase">Licenca Premium</p>
                    <p className="text-[10px] text-blue-800 font-mono uppercase">WAV sem tag</p>
                  </div>
                  <span className="font-bold text-blue-400 font-mono">R$ {beat.price_wav.toFixed(2)}</span>
                </div>
              )}

              {beat.price_stems > 0 && (
                <div className="flex items-center justify-between p-3 rounded-sm bg-purple-900/5 border border-purple-900/20 hover:border-purple-500/30 transition-colors">
                  <div>
                    <p className="font-bold text-purple-400 font-mono text-sm uppercase">Licenca Stems</p>
                    <p className="text-[10px] text-purple-800 font-mono uppercase">Tracks individuais</p>
                  </div>
                  <span className="font-bold text-purple-400 font-mono">R$ {beat.price_stems.toFixed(2)}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => onAddToCartClick(beat)}
                  className="w-full bg-green-600 hover:bg-green-500 text-black font-bold font-mono uppercase tracking-widest py-3 px-6 rounded-sm transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ADICIONAR AO CARRINHO
                </button>

                <button
                  onClick={() => onDownloadClick(beat)}
                  className="w-full bg-transparent border border-green-900 text-green-700 hover:text-green-400 hover:border-green-500 font-mono uppercase tracking-widest py-3 px-6 rounded-sm transition-all text-xs flex items-center justify-center gap-2"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  DOWNLOAD PREVIEW
                </button>
              </div>
            </Card>

            {/* Direct Link */}
            <div className="p-4 rounded-sm bg-green-900/5 border border-green-900/20">
              <p className="text-[10px] text-green-800 font-mono uppercase tracking-widest mb-2">LINK EXCLUSIVO DESTE BEAT:</p>
              <div className="flex items-center gap-2">
                <code className="text-green-500 font-mono text-xs break-all flex-grow">{window.location.href}</code>
                <button onClick={handleShare} className="text-green-700 hover:text-green-400 transition-colors flex-shrink-0">
                  {copied ? <CheckCircleIcon className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatPage;
