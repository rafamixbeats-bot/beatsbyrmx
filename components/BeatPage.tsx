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

const WaveformBg: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.07]">
    <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#4ade80"
        strokeWidth="1.5"
        points="0,100 20,100 30,85 40,100 50,100 60,60 70,100 80,100 90,110 100,100 110,100 120,40 130,100 140,100 150,120 160,100 170,100 180,95 190,100 200,100 210,50 220,100 230,100 240,130 250,100 260,100 270,70 280,100 290,100 300,100 310,90 320,100 330,100 340,55 350,100 360,100 370,115 380,100 390,100 400,80 410,100 420,100 430,35 440,100 450,100 460,125 470,100 480,100 490,65 500,100 510,100 520,100 530,95 540,100 550,100 560,45 570,100 580,100 590,110 600,100 610,100 620,75 630,100 640,100 650,30 660,100 670,100 680,120 690,100 700,100 710,55 720,100 730,100 740,100 750,85 760,100 770,100 780,40 790,100 800,100 810,115 820,100 830,100 840,70 850,100 860,100 870,50 880,100 890,100 900,130 910,100 920,100 930,80 940,100 950,100 960,100 970,60 980,100 990,100 1000,110 1010,100 1020,100 1030,45 1040,100 1050,100 1060,120 1070,100 1080,100 1090,65 1100,100 1110,100 1120,100 1130,90 1140,100 1150,100 1160,55 1170,100 1180,100 1200,100"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="2400"
          to="0"
          dur="4s"
          repeatCount="indefinite"
        />
      </polyline>
      <polyline
        fill="none"
        stroke="#22c55e"
        strokeWidth="0.8"
        opacity="0.5"
        points="0,100 25,100 35,90 45,100 55,100 65,70 75,100 85,100 95,105 105,100 115,100 125,50 135,100 145,100 155,115 165,100 175,100 185,98 195,100 205,100 215,55 225,100 235,100 245,125 255,100 265,100 275,75 285,100 295,100 305,100 315,92 325,100 335,100 345,58 355,100 365,100 375,112 385,100 395,100 405,82 415,100 425,100 435,38 445,100 455,100 465,122 475,100 485,100 495,68 505,100 515,100 525,100 535,96 545,100 555,100 565,48 575,100 585,100 595,108 605,100 615,100 625,78 635,100 645,100 655,35 665,100 675,100 685,118 695,100 705,100 715,58 725,100 735,100 745,100 755,88 765,100 775,100 785,42 795,100 805,100 815,112 825,100 835,100 845,72 855,100 865,100 875,52 885,100 895,100 905,128 915,100 925,100 935,82 945,100 955,100 965,100 975,62 985,100 995,100 1005,108 1015,100 1025,100 1035,48 1045,100 1055,100 1065,118 1075,100 1085,100 1095,68 1105,100 1115,100 1125,100 1135,92 1145,100 1155,100 1165,58 1175,100 1185,100 1200,100"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="2400"
          to="0"
          dur="6s"
          repeatCount="indefinite"
        />
      </polyline>
    </svg>
  </div>
);

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
    <div className="relative min-h-screen bg-black py-8 animate-fade-in overflow-hidden">
      <WaveformBg />
      <div className="relative z-10 container mx-auto px-4">
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
    </div>
  );
};

export default BeatPage;
