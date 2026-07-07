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
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <svg viewBox="0 0 1200 100" className="absolute top-1/2 left-0 w-[200%] -translate-y-1/2 opacity-[0.08]" style={{ animation: 'waveSlide 10s linear infinite' }} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#4ade80"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        points="0,50 10,50 15,35 20,50 30,50 35,20 40,50 50,50 55,55 60,50 70,50 75,15 80,50 90,50 95,60 100,50 110,50 115,42 120,50 130,50 135,18 140,50 150,50 155,65 160,50 170,50 175,30 180,50 190,50 195,50 200,45 205,50 210,50 215,22 220,50 230,50 235,58 240,50 250,50 255,35 260,50 270,50 275,12 280,50 290,50 295,62 300,50 310,50 315,28 320,50 330,50 335,50 340,40 345,50 350,50 355,18 360,50 370,50 375,58 380,50 390,50 395,32 400,50 410,50 415,10 420,50 430,50 435,65 440,50 450,50 455,25 460,50 470,50 475,50 480,42 485,50 490,50 495,15 500,50 510,50 515,60 520,50 530,50 535,30 540,50 550,50 555,8 560,50 570,50 575,62 580,50 590,50 595,22 600,50 610,50 615,50 620,38 625,50 630,50 635,12 640,50 650,50 655,58 660,50 670,50 675,28 680,50 690,50 695,10 700,50 710,50 715,65 720,50 730,50 735,20 740,50 750,50 755,50 760,42 765,50 770,50 775,15 780,50 790,50 795,58 800,50 810,50 815,35 820,50 830,50 835,8 840,50 850,50 855,62 860,50 870,50 875,25 880,50 890,50 895,50 900,38 905,50 910,50 915,12 920,50 930,50 935,58 940,50 950,50 955,30 960,50 970,50 975,10 980,50 990,50 995,65 1000,50 1010,50 1015,20 1020,50 1030,50 1035,50 1040,42 1045,50 1050,50 1055,15 1060,50 1070,50 1075,60 1080,50 1090,50 1095,30 1100,50 1110,50 1115,8 1120,50 1130,50 1135,62 1140,50 1150,50 1155,22 1160,50 1170,50 1175,50 1180,42 1185,50 1190,50 1200,50"
      />
    </svg>
    <svg viewBox="0 0 1200 100" className="absolute top-1/2 left-0 w-[200%] -translate-y-1/2 opacity-[0.05]" style={{ animation: 'waveSlideReverse 14s linear infinite' }} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#22c55e"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        points="0,50 12,50 18,38 24,50 36,50 42,22 48,50 60,50 66,56 72,50 84,50 90,18 96,50 108,50 114,62 120,50 132,50 138,40 144,50 156,50 162,20 168,50 180,50 186,58 192,50 204,50 210,32 216,50 228,50 234,50 240,44 246,50 252,50 258,16 264,50 276,50 282,60 288,50 300,50 306,36 312,50 324,50 330,10 336,50 348,50 354,64 360,50 372,50 378,24 384,50 396,50 402,50 408,40 414,50 420,50 426,14 432,50 444,50 450,58 456,50 468,50 474,32 480,50 492,50 498,8 504,50 516,50 522,64 528,50 540,50 546,20 552,50 564,50 570,50 576,40 582,50 588,50 594,14 600,50 612,50 618,58 624,50 636,50 642,30 648,50 660,50 666,8 672,50 684,50 690,64 696,50 708,50 714,22 720,50 732,50 738,50 744,38 750,50 756,50 762,12 768,50 780,50 786,58 792,50 804,50 810,28 816,50 828,50 834,8 840,50 852,50 858,64 864,50 876,50 882,18 888,50 900,50 906,50 912,40 918,50 924,50 930,14 936,50 948,50 954,58 960,50 972,50 978,32 984,50 996,50 1002,10 1008,50 1020,50 1026,64 1032,50 1044,50 1050,20 1056,50 1068,50 1074,50 1080,40 1086,50 1092,50 1098,14 1104,50 1116,50 1122,58 1128,50 1140,50 1146,30 1152,50 1164,50 1170,8 1176,50 1188,50 1194,64 1200,50"
      />
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
