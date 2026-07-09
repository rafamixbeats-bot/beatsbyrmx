import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import StoreSection from "./components/HomeSection";
import AudioPlayer from "./components/AboutSection";
import ShoppingCartComponent from "./components/ProjectsSection";
import Card from "./components/ContactSection";
import CheckoutPage from "./components/CheckoutPage";
import Header from "./components/Header";
import DownloadGateModal from "./components/DownloadGateModal";
import Footer from "./components/Footer";
import DrumKitsSection from "./components/DrumKitsSection";
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import { useToast } from "./components/ToastProvider";
import { FileText, Download, Users, Sparkles, SearchIcon, X, Play, LayersIcon } from "./components/icons";
import LicenseAgreementModal from './components/LicenseAgreementModal';
import AboutPage from "./components/AboutPage";
import PricingPage from "./components/PricingPage";
import ProducersPage from "./components/ProducersPage";
import BeatPage from "./components/BeatPage";
import PackDetailPage from "./components/PackDetailPage";
import TermsPage from "./components/TermsPage";
import PrivacyPage from "./components/PrivacyPage";
import { supabase } from './supabaseClient';

// Type definitions
export interface Beat {
  id: string;
  producerId: string;
  created_at?: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  duration: string;
  price_mp3: number;
  price_wav: number;
  price_stems: number;
  description?: string;
  audioPreviewUrl: string;
  downloadUrl: string;
  wavUrl: string | null;
  stemsUrl: string | null;
  artworkUrl: string;
  tags: string[];
}

export interface DrumKitSample {
  id: string;
  pack_id: string;
  file_name: string;
  file_url: string;
  duration: string;
  key: string;
  bpm: number;
  sort_order: number;
}

export interface DrumKit {
  id: string;
  created_at?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  download_url: string;
  artworkUrl: string;
  tags: string[];
  samples: DrumKitSample[];
}

export interface CartItem {
  id: string;
  productId: string;
  type: 'beat' | 'drum_kit';
  title: string;
  price: number;
  description: string;
}

export type SocialLinks = {
  youtube: string;
  tiktok: string;
  instagram: string;
  spotify: string;
  twitter?: string;
};

export interface Producer {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  socials: Partial<SocialLinks>;
}

export interface AdminSettings {
  whatsappNumber: string;
  pixKey: string;
  adminUser: string;
  adminPass: string;
}

export type View = 'store' | 'drum_kits' | 'checkout' | 'admin' | 'about' | 'pricing' | 'producers' | 'pack';

export type LicenseType = 'mp3' | 'wav' | 'stems';
export interface LicenseOption {
  type: LicenseType;
  name: string;
  price: number;
  description: string;
}

const mockProducers: Producer[] = [
  {
    id: 'p1',
    name: 'RMX',
    bio: 'CEO & Produtor Principal. Especialista em Trap e Hip-Hop.',
    avatarUrl: 'https://placehold.co/200x200/064e3b/4ade80?text=RMX',
    socials: { instagram: '#', twitter: '#' }
  }
];

const mockSocialLinks: SocialLinks = {
  youtube: 'https://youtube.com',
  tiktok: 'https://tiktok.com',
  instagram: 'https://instagram.com',
  spotify: 'https://spotify.com'
};

const defaultSettings: AdminSettings = {
  whatsappNumber: '',
  pixKey: '',
  adminUser: 'admin',
  adminPass: 'rmxbeats2024'
};

const LicenseSelectionModal: React.FC<{
  beat: Beat;
  options: LicenseOption[];
  onClose: () => void;
  onAddToCart: (beat: Beat, license: LicenseOption) => void;
  onViewLicenseTerms: (license: LicenseOption) => void;
}> = ({ beat, options, onClose, onAddToCart, onViewLicenseTerms }) => {
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  React.useEffect(() => {
    setTermsAccepted(false);
  }, [beat]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-black border border-green-900/50 shadow-[0_0_30px_rgba(34,197,94,0.1)] p-8 rounded-sm w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-green-700 hover:text-green-400"><X className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold text-green-400 mb-2 font-mono uppercase tracking-widest">[LICENSE.SELECT]</h2>
        <p className="text-green-800 text-xs font-mono uppercase tracking-wide mb-6">TARGET: "{beat.title}"</p>
        <div className="space-y-4">
          {options.map(opt => (
            <div key={opt.type} className="bg-green-900/10 border border-green-900/30 hover:border-green-500/50 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
              <div>
                <h3 className="font-bold text-green-400 text-sm font-mono uppercase tracking-wide">{opt.name}</h3>
                <p className="text-[10px] text-green-700 font-mono uppercase mt-1">{opt.description}</p>
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-shrink-0">
                <span className="font-bold text-green-400 font-mono">R$ {opt.price.toFixed(2)}</span>
                <button onClick={() => onViewLicenseTerms(opt)} className="text-[10px] text-green-600 hover:text-green-300 font-mono underline uppercase">TERMOS</button>
                <button
                  onClick={() => { if (termsAccepted) onAddToCart(beat, opt); }}
                  disabled={!termsAccepted}
                  className={`font-bold font-mono uppercase text-xs py-2 px-4 rounded-sm transition-colors ${termsAccepted ? 'bg-green-700 hover:bg-green-500 text-black cursor-pointer' : 'bg-green-900/30 text-green-800 cursor-not-allowed border border-green-900/30'}`}
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-green-900/30">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 accent-green-500 bg-black border-green-700 rounded"
            />
            <span className="text-[11px] text-green-700 font-mono leading-relaxed group-hover:text-green-500 transition-colors">
              Li e aceito os <span className="text-green-400 underline">termos da licença</span> e os{' '}
              <span className="text-green-400 underline">Termos de Serviço</span> do beatsbyrmx
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [beats, setBeats] = useState<Beat[]>([]);
  const [drumKits, setDrumKits] = useState<DrumKit[]>([]);
  const [drumKitSamples, setDrumKitSamples] = useState<DrumKitSample[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(mockSocialLinks);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const producers = mockProducers;

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [beatsRes, kitsRes, samplesRes, socialsRes, settingsRes] = await Promise.all([
          supabase.from('beats').select('*').order('created_at', { ascending: false }),
          supabase.from('drum_kits').select('*').order('created_at', { ascending: false }),
          supabase.from('drum_kit_samples').select('*').order('sort_order', { ascending: true }),
          supabase.from('settings').select('*').eq('key', 'social_links').single(),
          supabase.from('settings').select('*').eq('key', 'admin_settings').single(),
        ]);

        if (beatsRes.data) setBeats(beatsRes.data);
        if (kitsRes.data) {
          const kits = kitsRes.data.map(k => ({
            ...k,
            tags: k.tags || [],
            samples: samplesRes.data ? samplesRes.data.filter((s: any) => s.pack_id === k.id) : []
          }));
          setDrumKits(kits);
        }
        if (samplesRes.data) setDrumKitSamples(samplesRes.data);
        if (socialsRes.data?.value) setSocialLinks(socialsRes.data.value);
        if (settingsRes.data?.value) setAdminSettings(settingsRes.data.value);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // App State
  const [view, setView] = useState<View>('store');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentPlayingList, setCurrentPlayingList] = useState<Beat[]>([]);
  const [beatToDownload, setBeatToDownload] = useState<Beat | null>(null);
  const [isDownloadGateOpen, setIsDownloadGateOpen] = useState(false);
  const [licenseModalInfo, setLicenseModalInfo] = useState<{ beat: Beat; options: LicenseOption[] } | null>(null);
  const [licenseTermsInfo, setLicenseTermsInfo] = useState<{ beat: Beat; license: LicenseOption } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBeats = useMemo(() => {
    return beats.filter(beat =>
      beat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beat.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beat.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [beats, searchTerm]);

  const handleNavigate = (newView: View) => {
    setView(newView);
    navigate(newView === 'store' ? '/' : `/${newView}`);
    window.scrollTo(0, 0);
  };

  // Sync view state with URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '') setView('store');
    else if (path === '/drum_kits') setView('drum_kits');
    else if (path === '/checkout') setView('checkout');
    else if (path === '/admin') setView('admin');
    else if (path === '/about') setView('about');
    else if (path === '/pricing') setView('pricing');
    else if (path === '/producers') setView('producers');
    else if (path.startsWith('/pack/')) setView('pack');
  }, [location.pathname]);

  // Redirect after login/logout
  const handleLogin = (user: string, pass: string) => {
    if (user === adminSettings.adminUser && pass === adminSettings.adminPass) {
      setIsAuthenticated(true);
      setView('admin');
      navigate('/admin');
      addToast('Login bem-sucedido!', 'success');
    } else {
      addToast('Usuário ou senha inválidos.', 'error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('store');
    navigate('/');
    addToast('Você saiu.', 'info');
  };

  const handlePlayBeat = (beatId: string) => {
    const beatToPlay = beats.find(b => b.id === beatId);
    if (beatToPlay) {
      if (currentBeat?.id === beatId) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentPlayingList(filteredBeats);
        setCurrentBeat(beatToPlay);
        setIsPlaying(true);
      }
    }
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    if (!currentBeat) return;
    const currentIndex = currentPlayingList.findIndex(b => b.id === currentBeat.id);
    const nextBeat = currentPlayingList[(currentIndex + 1) % currentPlayingList.length];
    setCurrentBeat(nextBeat);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (!currentBeat) return;
    const currentIndex = currentPlayingList.findIndex(b => b.id === currentBeat.id);
    const prevBeat = currentPlayingList[(currentIndex - 1 + currentPlayingList.length) % currentPlayingList.length];
    setCurrentBeat(prevBeat);
    setIsPlaying(true);
  };

  const handleAddToCartClick = (beat: Beat) => {
    const options: LicenseOption[] = [];
    if (beat.price_mp3 > 0) options.push({ type: 'mp3', name: 'Licença Básica (MP3)', price: beat.price_mp3, description: 'Arquivo MP3 com tag.' });
    if (beat.price_wav > 0) options.push({ type: 'wav', name: 'Licença Premium (WAV)', price: beat.price_wav, description: 'Arquivo WAV sem tag.' });
    if (beat.price_stems > 0) options.push({ type: 'stems', name: 'Licença Stems (WAV)', price: beat.price_stems, description: 'Arquivos de track stems individuais.' });
    if (options.length > 0) {
      setLicenseModalInfo({ beat, options });
    } else {
      setBeatToDownload(beat);
      setIsDownloadGateOpen(true);
    }
  };

  const handleDownloadClick = (beat: Beat) => {
    setBeatToDownload(beat);
    setIsDownloadGateOpen(true);
  };

  const handleAddToCart = (item: Beat | DrumKit, license?: LicenseOption) => {
    const itemId = license ? `beat-${item.id}-${license.type}` : `drum_kit-${item.id}`;
    if (cartItems.some(ci => ci.id === itemId)) {
      addToast('Este item já está no seu carrinho.', 'info');
      return;
    }
    let newItem: CartItem;
    if ('bpm' in item && license) {
      newItem = { id: itemId, productId: item.id, type: 'beat', title: item.title, price: license.price, description: license.name };
    } else {
      newItem = { id: itemId, productId: item.id, type: 'drum_kit', title: item.title, price: (item as DrumKit).price, description: 'Drum Kit' };
    }
    setCartItems(prev => [...prev, newItem]);
    addToast(`${item.title} adicionado ao carrinho!`, 'success');
    setLicenseModalInfo(null);
    setIsCartOpen(true);
  };

  const handleAddMultipleKitsToCart = (kits: DrumKit[]) => {
    let addedCount = 0;
    kits.forEach(kit => {
      const itemId = `drum_kit-${kit.id}`;
      if (!cartItems.some(ci => ci.id === itemId)) {
        const newItem: CartItem = { id: itemId, productId: kit.id, type: 'drum_kit', title: kit.title, price: kit.price, description: 'Drum Kit' };
        setCartItems(prev => [...prev, newItem]);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      addToast(`${addedCount} ${addedCount === 1 ? 'pack adicionado' : 'packs adicionados'} ao carrinho!`, 'success');
      setIsCartOpen(true);
    } else {
      addToast('Todos os packs selecionados já estão no carrinho.', 'info');
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    addToast('Item removido do carrinho.', 'success');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
    navigate('/checkout');
  };

  const handleConfirmPurchase = () => {
    addToast('Pedido enviado via WhatsApp!', 'success');
    setCartItems([]);
    setView('store');
    navigate('/');
  };

  // Admin handlers - save to Supabase
  const handleAddBeat = async (newBeat: Beat) => {
    const { data, error } = await supabase.from('beats').insert([newBeat]).select().single();
    if (error) { addToast('Erro ao salvar beat!', 'error'); return; }
    setBeats(prev => [data, ...prev]);
    addToast('Beat adicionado!', 'success');
  };

  const handleUpdateBeat = async (beatId: string, data: Partial<Beat>) => {
    const { error } = await supabase.from('beats').update(data).eq('id', beatId);
    if (error) { addToast('Erro ao atualizar beat!', 'error'); return; }
    setBeats(prev => prev.map(b => b.id === beatId ? { ...b, ...data } : b));
    addToast('Beat atualizado!', 'success');
  };

  const handleDeleteBeat = async (beat: Beat) => {
    const filesToDelete = [beat.audioPreviewUrl, beat.wavUrl, beat.stemsUrl].filter(Boolean);
    if (filesToDelete.length > 0) {
      try { await fetch('/api/delete-r2-files', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileUrls: filesToDelete }) }); } catch (e) {}
    }
    const { error } = await supabase.from('beats').delete().eq('id', beat.id);
    if (error) { addToast('Erro ao excluir beat!', 'error'); return; }
    setBeats(prev => prev.filter(b => b.id !== beat.id));
    addToast('Beat excluído!', 'success');
  };

  const handleAddDrumKit = async (newKit: DrumKit) => {
    const { samples, ...kitData } = newKit;
    console.log('Inserting kit:', kitData);
    const { data, error } = await supabase.from('drum_kits').insert([kitData]).select().single();
    if (error) { console.error('Supabase error:', error); addToast(`Erro ao salvar kit: ${error.message}`, 'error'); return; }
    if (samples && samples.length > 0) {
      const samplesWithPackId = samples.map(s => ({ ...s, pack_id: data.id }));
      const { error: samplesError } = await supabase.from('drum_kit_samples').insert(samplesWithPackId);
      if (samplesError) console.error('Erro ao salvar samples:', samplesError);
    }
    setDrumKits(prev => [{ ...data, tags: data.tags || [], samples: samples || [] }, ...prev]);
    addToast('Sound Kit adicionado!', 'success');
  };

  const handleDeleteDrumKit = async (kit: DrumKit) => {
    const filesToDelete = [kit.download_url, kit.artworkUrl, ...kit.samples.map(s => s.file_url)].filter(Boolean);
    if (filesToDelete.length > 0) {
      try { await fetch('/api/delete-r2-files', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileUrls: filesToDelete }) }); } catch (e) {}
    }
    await supabase.from('drum_kit_samples').delete().eq('pack_id', kit.id);
    const { error } = await supabase.from('drum_kits').delete().eq('id', kit.id);
    if (error) { addToast('Erro ao excluir kit!', 'error'); return; }
    setDrumKits(prev => prev.filter(k => k.id !== kit.id));
    addToast('Sound Kit excluído!', 'success');
  };

  const handleUpdateDrumKit = async (kitId: string, data: Partial<DrumKit>) => {
    const { samples, ...dbData } = data;
    if (Object.keys(dbData).length > 0) {
      const { error } = await supabase.from('drum_kits').update(dbData).eq('id', kitId);
      if (error) { addToast('Erro ao atualizar kit!', 'error'); return; }
    }
    setDrumKits(prev => prev.map(k => k.id === kitId ? { ...k, ...data } : k));
    if (Object.keys(dbData).length > 0) addToast('Sound Kit atualizado!', 'success');
  };

  const handleUpdateSocials = async (newLinks: SocialLinks) => {
    await supabase.from('settings').upsert({ key: 'social_links', value: newLinks });
    setSocialLinks(newLinks);
    addToast('Links salvos!', 'success');
  };

  const handleUpdateSettings = async (newSettings: AdminSettings) => {
    await supabase.from('settings').upsert({ key: 'admin_settings', value: newSettings });
    setAdminSettings(newSettings);
    addToast('Configurações salvas!', 'success');
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-green-400 font-mono animate-pulse">LOADING_DATABASE...</p>
      </div>
    );
  }

  const renderView = () => {
    if (!isAuthenticated && view === 'admin') {
      return <LoginPage onLogin={handleLogin} />;
    }
    switch (view) {
      case 'store':
        return <StoreSection beats={filteredBeats} onPlayBeat={handlePlayBeat} currentBeat={currentBeat} isPlaying={isPlaying} onAddToCartClick={handleAddToCartClick} onDownloadClick={handleDownloadClick} searchTerm={searchTerm} onSearch={setSearchTerm} socialLinks={socialLinks} />;
      case 'drum_kits':
        return <DrumKitsSection drumKits={drumKits} onAddToCart={handleAddToCart} onAddMultipleToCart={handleAddMultipleKitsToCart} />;
      case 'checkout':
        return <CheckoutPage items={cartItems} settings={adminSettings} onConfirmPurchase={handleConfirmPurchase} onBackToStore={() => { setView('store'); navigate('/'); }} />;
      case 'admin':
        return <AdminPanel beats={beats} drumKits={drumKits} socialLinks={socialLinks} settings={adminSettings} onAddBeat={handleAddBeat} onUpdateBeat={handleUpdateBeat} onDeleteBeat={handleDeleteBeat} onAddDrumKit={handleAddDrumKit} onUpdateDrumKit={handleUpdateDrumKit} onDeleteDrumKit={handleDeleteDrumKit} onUpdateSocialLinks={handleUpdateSocials} onUpdateSettings={handleUpdateSettings} onLogout={handleLogout} />;
      case 'about':
        return <AboutPage />;
      case 'pricing':
        return <PricingPage />;
      case 'producers':
        return <ProducersPage producers={producers} beats={beats} onFilterByProducer={(name) => { setSearchTerm(name); setView('store'); navigate('/'); }} />;
      default:
        return <StoreSection beats={filteredBeats} onPlayBeat={handlePlayBeat} currentBeat={currentBeat} isPlaying={isPlaying} onAddToCartClick={handleAddToCartClick} onDownloadClick={handleDownloadClick} searchTerm={searchTerm} onSearch={setSearchTerm} socialLinks={socialLinks} />;
    }
  };

  return (
    <div className="bg-black text-slate-300 min-h-screen font-sans flex flex-col">
      <Header onNavigate={handleNavigate} onSearch={setSearchTerm} />
      <main className="pt-24 pb-28 flex-grow">
        <Routes>
          <Route path="/beat/:slug" element={
            <BeatPage
              beats={beats}
              currentBeat={currentBeat}
              isPlaying={isPlaying}
              onPlayBeat={handlePlayBeat}
              onAddToCartClick={handleAddToCartClick}
              onDownloadClick={handleDownloadClick}
            />
          } />
          <Route path="/pack/:slug" element={
            <PackDetailPage
              drumKits={drumKits}
              onAddToCart={handleAddToCart}
            />
          } />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={renderView()} />
        </Routes>
      </main>
      <Footer />
      <ShoppingCartComponent items={cartItems} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} isOpen={isCartOpen} setIsOpen={setIsCartOpen} onNavigate={handleNavigate} />
      <AudioPlayer currentBeat={currentBeat} isPlaying={isPlaying} onPlayPause={handlePlayPause} onNext={playNext} onPrevious={playPrevious} isLooping={isLooping} onToggleLoop={() => setIsLooping(!isLooping)} />
      {licenseModalInfo && <LicenseSelectionModal beat={licenseModalInfo.beat} options={licenseModalInfo.options} onClose={() => setLicenseModalInfo(null)} onAddToCart={handleAddToCart} onViewLicenseTerms={(license) => setLicenseTermsInfo({ beat: licenseModalInfo.beat, license })} />}
      {licenseTermsInfo && <LicenseAgreementModal beat={licenseTermsInfo.beat} license={licenseTermsInfo.license} onClose={() => setLicenseTermsInfo(null)} />}
      <DownloadGateModal isOpen={isDownloadGateOpen} onClose={() => setIsDownloadGateOpen(false)} beat={beatToDownload} socialLinks={socialLinks} />
    </div>
  );
};

export default App;
