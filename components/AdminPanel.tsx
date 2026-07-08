
import React, { useState, useEffect } from 'react';
import Card from './ContactSection';
import { UploadCloud, LogOut, BarChart2, Settings, Trash2, Music, Package, DollarSign, InfoIcon, LayersIcon, SoundWave, User, EditIcon, X, AlertTriangleIcon, CheckCircleIcon } from './icons';
import type { Beat, SocialLinks, DrumKit, AdminSettings } from '../App';
import { useToast } from './ToastProvider';
import { supabase } from '../supabaseClient';


interface AdminPanelProps {
    beats: Beat[];
    drumKits: DrumKit[];
    socialLinks: SocialLinks;
    settings: AdminSettings;
    onAddBeat: (newBeat: Beat) => void;
    onUpdateBeat: (beatId: string, data: Partial<Beat>) => void;
    onDeleteBeat: (beat: Beat) => void;
    onAddDrumKit: (newKit: DrumKit) => void;
    onDeleteDrumKit: (kit: DrumKit) => void;
    onUpdateSocialLinks: (newLinks: SocialLinks) => void;
    onUpdateSettings: (newSettings: AdminSettings) => void;
    onLogout: () => void;
}

type AdminTab = 'dashboard' | 'add' | 'kits' | 'settings' | 'coupons';
type SubmissionStatus = 'idle' | 'generating_url' | 'uploading' | 'saving' | 'error';


type InputFieldProps = {
    label: string;
} & (
    | (React.InputHTMLAttributes<HTMLInputElement> & { as?: undefined })
    | (React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' })
);

const InputField: React.FC<InputFieldProps> = ({ label, as, ...props }) => (
    <div>
        <label className="block text-xs font-bold text-green-600 mb-1 font-mono uppercase tracking-widest">{label}</label>
        {as === 'textarea' ? (
            <textarea
                {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
                className="w-full bg-black/50 border border-green-900/50 rounded-sm px-3 py-2 text-green-400 placeholder-green-900/50 font-mono text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition outline-none"
            />
        ) : (
            <input
                {...props as React.InputHTMLAttributes<HTMLInputElement>}
                className="w-full bg-black/50 border border-green-900/50 rounded-sm px-3 py-2 text-green-400 placeholder-green-900/50 font-mono text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition outline-none"
            />
        )}
    </div>
);

type FileVariant = 'success' | 'primary' | 'accent' | 'default';

const FileInputField: React.FC<{
    label: string;
    id: string;
    file: File | null;
    onChange: (file: File | null) => void;
    accept?: string;
    isOptional?: boolean;
    helperText?: React.ReactNode;
    icon?: React.ReactNode;
    variant?: FileVariant;
}> = ({ label, id, file, onChange, accept, isOptional = false, helperText, icon, variant = 'default' }) => {
    
    // Lab aesthetic styles
    const styles = {
        default: { border: 'border-green-900/30', bg: 'bg-black/40', activeBorder: 'border-green-500', activeBg: 'bg-green-900/20', text: 'text-green-500' },
        success: { border: 'border-green-900/30', bg: 'bg-black/40', activeBorder: 'border-green-500', activeBg: 'bg-green-900/20', text: 'text-green-400' },
        primary: { border: 'border-blue-900/30', bg: 'bg-black/40', activeBorder: 'border-blue-500', activeBg: 'bg-blue-900/20', text: 'text-blue-400' },
        accent: { border: 'border-purple-900/30', bg: 'bg-black/40', activeBorder: 'border-purple-500', activeBg: 'bg-purple-900/20', text: 'text-purple-400' },
    };

    const currentStyle = styles[variant];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
        } else {
            onChange(null);
        }
    };

    const handleClearFile = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(null);
        const input = document.getElementById(id) as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    };

    const fileSizeMB = file ? file.size / 1024 / 1024 : 0;

    return (
        <div>
            <label className="block text-xs font-bold text-green-600 mb-1 font-mono uppercase tracking-widest flex justify-between">
                <span>{label}</span>
                {isOptional && <span className="text-[10px] text-green-800">OPCIONAL</span>}
            </label>
            <div className="relative">
                <label 
                    htmlFor={id} 
                    className={`cursor-pointer border border-dashed rounded-sm p-4 flex flex-col items-center justify-center text-center transition-all h-36 group relative overflow-hidden
                        ${file ? `${currentStyle.activeBorder} ${currentStyle.activeBg}` : `${currentStyle.border} ${currentStyle.bg} hover:border-green-500/50 hover:bg-green-500/5`}
                    `}
                >
                    <div className={`transition-transform duration-300 ${file ? 'scale-90 opacity-0 absolute' : 'scale-100 opacity-100'}`}>
                         {icon || <UploadCloud className={`w-8 h-8 mb-2 ${currentStyle.text} opacity-70`} />}
                         <span className="text-[10px] text-green-700 block mt-2 font-mono uppercase">Selecionar Arquivo</span>
                    </div>

                    {file && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10 animate-fade-in">
                            <div className={`p-2 rounded-full mb-2 bg-black border border-green-900`}>
                                {icon}
                            </div>
                            <p className={`font-bold text-xs break-all ${currentStyle.text} line-clamp-1 px-2 font-mono`}>{file.name}</p>
                            <p className="mt-1 text-green-800 text-[10px] font-mono">{fileSizeMB.toFixed(2)} MB</p>
                        </div>
                    )}
                </label>
                {file && (
                    <button
                        onClick={handleClearFile}
                        className="absolute -top-2 -right-2 bg-red-900 border border-red-500 text-red-200 hover:text-white rounded-none p-1 z-20 shadow-lg"
                        aria-label="Remover arquivo"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
            <input id={id} type="file" className="hidden" onChange={handleFileChange} accept={accept} />
            {helperText && <div className="text-[10px] text-green-800 mt-1 ml-1 font-mono uppercase">{helperText}</div>}
        </div>
    );
};


const AdminPanel: React.FC<AdminPanelProps> = ({ beats, drumKits, socialLinks, settings, onAddBeat, onDeleteBeat, onUpdateBeat, onAddDrumKit, onDeleteDrumKit, onUpdateSocialLinks, onUpdateSettings, onLogout }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const { addToast } = useToast();
    
    // Add Beat Form State
    const [title, setTitle] = useState('');
    const [producer, setProducer] = useState('RMX');
    const [bpm, setBpm] = useState<number | ''>(120);
    const [key, setKey] = useState('');
    const [duration, setDuration] = useState('');
    const [tags, setTags] = useState('');
    
    const [priceMp3, setPriceMp3] = useState<number | ''>(49.90);
    const [priceWav, setPriceWav] = useState<number | ''>(99.90);
    const [priceStems, setPriceStems] = useState<number | ''>(199.90);
    const [description, setDescription] = useState('');
    
    // Files State
    const [mp3File, setMp3File] = useState<File | null>(null);
    const [wavFile, setWavFile] = useState<File | null>(null);
    const [zipFile, setZipFile] = useState<File | null>(null);
    
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
    const [submissionMessage, setSubmissionMessage] = useState('');

    // Add Drum Kit Form State
    const [kitTitle, setKitTitle] = useState('');
    const [kitDescription, setKitDescription] = useState('');
    const [kitPrice, setKitPrice] = useState<number | ''>(79.90);
    const [kitZipFile, setKitZipFile] = useState<File | null>(null);
    const [kitArtworkFile, setKitArtworkFile] = useState<File | null>(null); // State for kit artwork
    
    const [kitSubmissionStatus, setKitSubmissionStatus] = useState<SubmissionStatus>('idle');
    const [kitSubmissionMessage, setKitSubmissionMessage] = useState('');

    // Edit Beat Modal State
    const [editingBeat, setEditingBeat] = useState<Beat | null>(null);
    const [editFormData, setEditFormData] = useState<Omit<Partial<Beat>, 'tags'> & { tags?: string }>({});
    const [editMp3File, setEditMp3File] = useState<File | null>(null);
    const [editWavFile, setEditWavFile] = useState<File | null>(null);
    const [editZipFile, setEditZipFile] = useState<File | null>(null);
    const [isEditingSaving, setIsEditingSaving] = useState(false);

    // Settings State
    const [links, setLinks] = useState<SocialLinks>(socialLinks);
    const [adminConfig, setAdminConfig] = useState<AdminSettings>(settings);
    const [coupons, setCoupons] = useState<{id: string; code: string; discount_percent: number; active: boolean}[]>([]);
    const [newCouponCode, setNewCouponCode] = useState('');
    const [newCouponDiscount, setNewCouponDiscount] = useState<number>(10);
    // Cloudflare R2 Storage - sempre conectado
    const [isCloudConnected] = useState<boolean>(true);
    const R2_PUBLIC_URL = (import.meta.env.VITE_R2_PUBLIC_URL as string) || 'https://pub-a0e5da93f63a416daff8f99cdaeaefc3.r2.dev';

   useEffect(() => {
  const loadCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*');
    if (data) setCoupons(data);
  };
  loadCoupons();
}, []);

useEffect(() => {
    if (editingBeat) {
        setEditFormData({
            title: editingBeat.title,
            bpm: editingBeat.bpm,
            key: editingBeat.key,
            duration: editingBeat.duration,
            tags: editingBeat.tags.join(', '),
            artworkUrl: editingBeat.artworkUrl,
            price_mp3: editingBeat.price_mp3,
            price_wav: editingBeat.price_wav,
            price_stems: editingBeat.price_stems,
            description: editingBeat.description || '',
        });
        setEditMp3File(null);
        setEditWavFile(null);
        setEditZipFile(null);
    }
}, [editingBeat]);

    // Upload para Cloudflare R2 via presigned POST
    const uploadFile = async (file: File | null, statusSetter: (status: SubmissionStatus) => void, messageSetter: (message: string) => void): Promise<string | null> => {
        if (!file) return null;
        try {
            statusSetter('uploading');
            messageSetter(`Enviando ${file.name} para R2...`);

            const res = await fetch(`/api/get-presigned-post?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type || 'application/octet-stream')}`);
            if (!res.ok) throw new Error('Falha ao obter URL de upload');
            const { uploadUrl, publicUrl } = await res.json();

            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type || 'application/octet-stream',
                },
            });

            if (!uploadRes.ok) {
                const errText = await uploadRes.text();
                throw new Error(`Upload falhou: ${uploadRes.status} - ${errText}`);
            }

            return publicUrl;
        } catch (error: any) {
            console.error('Erro no upload R2:', error);
            statusSetter('error');
            messageSetter(`Erro no upload: ${error.message}`);
            return null;
        }
    };

    const handleDeleteBeatClick = async (beat: Beat) => {
        if (!confirm(`EXCLUIR "${beat.title}"?`)) return;
        
        try {
            // Arquivo será mantido no B2 por segurança
            // Para deletar manualmente, acesse o painel do Backblaze B2
        } catch(e) {}

        onDeleteBeat(beat);
    };

    const handleDeleteDrumKitClick = async (kit: DrumKit) => {
        if (!confirm(`EXCLUIR "${kit.title}"?`)) return;
        onDeleteDrumKit(kit);
    };

    const handleAddBeatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus('idle');

        const priceMp3Num = priceMp3 === '' ? 0 : Number(priceMp3);
        const priceWavNum = priceWav === '' ? 0 : Number(priceWav);
        const priceStemsNum = priceStems === '' ? 0 : Number(priceStems);

        if (!title || !producer || bpm === '' || !key || !duration) {
            addToast("Preencha os campos obrigatórios.", 'error');
            return;
        }
        if (!mp3File && !wavFile) {
            addToast("Envie pelo menos um arquivo de áudio (MP3 ou WAV).", 'error');
            return;
        }

        try {
            const [mp3Url, wavUrl, stemsUrl] = await Promise.all([
                uploadFile(mp3File, setSubmissionStatus, setSubmissionMessage),
                uploadFile(wavFile, setSubmissionStatus, setSubmissionMessage),
                uploadFile(zipFile, setSubmissionStatus, setSubmissionMessage),
            ]);

            const previewUrl = mp3Url || wavUrl;
            if (!previewUrl) throw new Error("Upload de áudio falhou.");

            setSubmissionStatus('saving');
            setSubmissionMessage('Registrando beat...');

            const generatedArtworkUrl = `https://placehold.co/400x400/1e1b4b/ffffff?text=${encodeURIComponent(title.toUpperCase())}`;

            const newBeatData: Beat = {
                id: crypto.randomUUID(),
                producerId: 'p1',
                created_at: new Date().toISOString(),
                title: title.toUpperCase(),
                producer,
                bpm: Number(bpm),
                key: key.toUpperCase().replace(/([A-Z]#?)M\b/g, '$1m'),
                duration,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                artworkUrl: generatedArtworkUrl,
                price_mp3: mp3Url ? priceMp3Num : 0,
                price_wav: wavUrl ? priceWavNum : 0,
                price_stems: stemsUrl ? priceStemsNum : 0,
                description,
                audioPreviewUrl: previewUrl,
                downloadUrl: previewUrl,
                wavUrl: wavUrl,
                stemsUrl: stemsUrl,
            };

            onAddBeat(newBeatData);
            
            setTitle(''); setProducer('RMX'); setBpm(120); setKey(''); setDuration(''); setTags('');
            setPriceMp3(49.90); setPriceWav(99.90); setPriceStems(199.90);
            setDescription('');
            setMp3File(null); setWavFile(null); setZipFile(null);
            
            setActiveTab('dashboard');

        } catch (error: any) {
            console.error("Error adding beat:", error);
            addToast(`Erro: ${submissionMessage || error.message}`, 'error');
        } finally {
            setSubmissionStatus('idle');
            setSubmissionMessage('');
        }
    };

    const handleAddKitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setKitSubmissionStatus('idle');

        if (!kitTitle || kitPrice === '' || !kitZipFile) {
            addToast("Preencha campos e arquivo .ZIP.", 'error');
            return;
        }

        try {
            const [zipUrl, artworkUrl] = await Promise.all([
                 uploadFile(kitZipFile, setKitSubmissionStatus, setKitSubmissionMessage),
                 kitArtworkFile ? uploadFile(kitArtworkFile, setKitSubmissionStatus, setKitSubmissionMessage) : null
            ]);

            if (!zipUrl) throw new Error("Falha no upload do kit.");
            
            setKitSubmissionStatus('saving');
            setKitSubmissionMessage('Adicionando kit...');
            
            const finalKitArtwork = artworkUrl || `https://placehold.co/400x400/1d4ed8/ffffff?text=${encodeURIComponent(kitTitle)}`;

            const newKitData: DrumKit = {
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                title: kitTitle.toUpperCase(),
                description: kitDescription,
                price: Number(kitPrice),
                download_url: zipUrl,
                artworkUrl: finalKitArtwork
            };
            onAddDrumKit(newKitData);
            setKitTitle(''); setKitDescription(''); setKitPrice(79.90);
            setKitZipFile(null); setKitArtworkFile(null);
            setActiveTab('dashboard');
        } catch (error: any) {
            console.error("Error adding drum kit:", error);
            addToast(`Erro: ${kitSubmissionMessage || error.message}`, 'error');
        } finally {
            setKitSubmissionStatus('idle');
            setKitSubmissionMessage('');
        }
    };
    
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumericField = ['bpm', 'price_mp3', 'price_wav', 'price_stems'].includes(name);
        setEditFormData(prev => ({ ...prev, [name]: isNumericField && value !== '' ? parseFloat(value) : value }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBeat) return;
        setIsEditingSaving(true);
        const tempStatusSetter = (s: SubmissionStatus) => {}; 
        const tempMessageSetter = (m: string) => addToast(m, 'info');
        try {
            const newMp3Url = editMp3File ? await uploadFile(editMp3File, tempStatusSetter, tempMessageSetter) : undefined;
            const newWavUrl = editWavFile ? await uploadFile(editWavFile, tempStatusSetter, tempMessageSetter) : undefined;
            const newZipUrl = editZipFile ? await uploadFile(editZipFile, tempStatusSetter, tempMessageSetter) : undefined;
            const { tags, ...restData } = editFormData;
            const updatedData: Partial<Beat> = {
                ...restData,
                title: editFormData.title?.toUpperCase(),
                key: editFormData.key?.toUpperCase().replace(/([A-Z]#?)M\b/g, '$1m'),
                tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : editingBeat.tags,
            };
            if (newMp3Url) { updatedData.audioPreviewUrl = newMp3Url; updatedData.downloadUrl = newMp3Url; }
            if (newWavUrl) updatedData.wavUrl = newWavUrl;
            if (newZipUrl) updatedData.stemsUrl = newZipUrl;
            
            if (editFormData.title && editFormData.title !== editingBeat.title) {
                 updatedData.artworkUrl = `https://placehold.co/400x400/1e1b4b/ffffff?text=${encodeURIComponent(editFormData.title.toUpperCase())}`;
            }

            onUpdateBeat(editingBeat.id, updatedData);
            setEditingBeat(null);
        } catch (error) {
            console.error(error);
            addToast('Erro ao atualizar.', 'error');
        } finally {
            setIsEditingSaving(false);
        }
    };
    const handleAddCoupon = async () => {
  if (!newCouponCode || !newCouponDiscount) return;
  const { data, error } = await supabase.from('coupons').insert([{ code: newCouponCode.toUpperCase(), discount_percent: newCouponDiscount }]).select().single();
  if (!error && data) {
    setCoupons(prev => [...prev, data]);
    setNewCouponCode('');
    setNewCouponDiscount(10);
    addToast('Cupom criado!', 'success');
  }
};

const handleDeleteCoupon = async (id: string) => {
  await supabase.from('coupons').delete().eq('id', id);
  setCoupons(prev => prev.filter(c => c.id !== id));
  addToast('Cupom removido.', 'success');
};
    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSocialLinks(links);
        onUpdateSettings(adminConfig);
    };
    
    const TabButton: React.FC<{
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
    }> = ({ label, icon, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-all border ${
                isActive
                    ? 'bg-green-500/10 text-green-400 border-green-500 shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                    : 'bg-black/40 text-green-800 border-green-900/30 hover:border-green-600 hover:text-green-500'
            }`}
        >
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-4 h-4 ${isActive ? 'text-green-400' : 'text-green-700'}` })}
            {label}
        </button>
    );

    const getSubmitButtonText = (status: SubmissionStatus, message: string, baseText: string) => {
        if (status !== 'idle') return message || 'PROCESSANDO...';
        return baseText.toUpperCase();
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-8 animate-fade-in">
                        {/* SYSTEM STATUS INDICATOR */}
                        <div className={`p-4 rounded-sm border ${isCloudConnected ? 'border-green-500/50 bg-green-900/10' : 'border-yellow-600/50 bg-yellow-900/10'} flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                {isCloudConnected ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />}
                                <div>
                                    <h4 className={`text-sm font-bold font-mono uppercase tracking-widest ${isCloudConnected ? 'text-green-400' : 'text-yellow-500'}`}>
                                        SYSTEM STATUS: {isCloudConnected ? 'CLOUD_CONNECTED' : 'LOCAL_DEMO_MODE'}
                                    </h4>
                                    <p className="text-[10px] text-green-800 font-mono uppercase mt-1">
                                        {isCloudConnected 
                                            ? 'BACKEND DETECTED. CLOUDFLARE R2 STORAGE ACTIVE.' 
                                            : 'NO BACKEND DETECTED. USING LOCAL STORAGE (BROWSER MEMORY). HOST TO ENABLE CLOUD.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <section>
                             <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-3 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">
                                [SYS.METRICS]
                             </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="p-6 flex items-center gap-4 bg-black/40 border-green-900/30 hover:border-green-500/50 transition-colors">
                                    <Music className="w-8 h-8 text-green-500/70" />
                                    <div>
                                        <p className="text-[10px] text-green-700 font-mono uppercase tracking-widest">Database Beats</p>
                                        <p className="text-2xl font-bold text-green-400 font-mono">{beats.length}</p>
                                    </div>
                                </Card>
                                <Card className="p-6 flex items-center gap-4 bg-black/40 border-green-900/30 hover:border-purple-500/50 transition-colors">
                                    <Package className="w-8 h-8 text-purple-500/70" />
                                    <div>
                                        <p className="text-[10px] text-purple-700 font-mono uppercase tracking-widest">Database Kits</p>
                                        <p className="text-2xl font-bold text-purple-400 font-mono">{drumKits.length}</p>
                                    </div>
                                </Card>
                            </div>
                        </section>
                        <section>
                             <h3 className="text-xl font-bold text-green-400 mb-4 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">[SYS.BEATS_MANAGER]</h3>
                             <Card className="p-2 max-h-[500px] overflow-y-auto bg-black/40 border-green-900/30 custom-scrollbar">
                                <div className="space-y-1">
                                    {beats.length === 0 ? (
                                        <p className="text-center text-green-800 py-8 font-mono uppercase text-xs">Nenhum dado encontrado.</p>
                                    ) : (
                                        beats.map(beat => (
                                            <div key={beat.id} className="flex items-center justify-between p-3 rounded-sm bg-black/20 border border-green-900/20 hover:bg-green-900/10 hover:border-green-500/30 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="font-bold text-green-400 font-mono text-sm tracking-wide uppercase">{beat.title}</p>
                                                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase mt-1">
                                                            <span className="text-green-600 bg-green-900/20 px-1 rounded border border-green-900/30">
                                                                {(beat.price_mp3 > 0) ? `R$ ${beat.price_mp3.toFixed(2)}` : (beat.price_wav > 0) ? `R$ ${beat.price_wav.toFixed(2)}` : 'FREE'}
                                                            </span>
                                                            <span className="text-green-800">|</span>
                                                            <span className="text-green-600">{beat.bpm} BPM</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setEditingBeat(beat)} title="EDITAR" className="text-green-700 hover:text-green-400 p-2 border border-transparent hover:border-green-500/30 rounded-sm transition-all">
                                                        <EditIcon className="w-4 h-4"/>
                                                    </button>
                                                    <button onClick={() => handleDeleteBeatClick(beat)} title="EXCLUIR" className="text-green-700 hover:text-red-500 p-2 border border-transparent hover:border-red-500/30 rounded-sm transition-all">
                                                        <Trash2 className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                             </Card>
                        </section>
                    </div>
                );
            case 'add':
                return (
                    <section className="animate-fade-in max-w-5xl mx-auto">
                        <form onSubmit={handleAddBeatSubmit} className="space-y-6">
                            <Card className="p-8 border-green-900/30 bg-black/60 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-green-400 mb-6 flex items-center gap-2 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">
                                    <InfoIcon className="w-4 h-4" /> [INPUT.METADATA]
                                </h3>
                                <div className="space-y-6">
                                    <InputField label="Título (Será convertido para caixa alta)" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="EX: VIBRAÇÕES NOTURNAS" required />
                                    <div className="grid md:grid-cols-4 gap-6">
                                        <InputField label="BPM" type="number" value={bpm} onChange={(e) => setBpm(e.target.value === '' ? '' : parseInt(e.target.value, 10))} placeholder="140" required />
                                        <InputField label="Tom" type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Cm" required />
                                        <InputField label="Duração" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="02:30" required />
                                        <InputField label="Tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="TRAP, DARK" />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-green-600 mb-1 font-mono uppercase tracking-widest">Descrição</label>
                                        <div className="relative">
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="DESCRIÇÃO DO BEAT..."
                                                rows={3}
                                                className="w-full bg-black/50 border border-green-900/50 rounded-sm px-3 py-2 text-green-400 placeholder-green-900/50 font-mono text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-8 border-green-900/30 bg-black/60 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-green-400 mb-6 flex items-center gap-2 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">
                                    <UploadCloud className="w-4 h-4" /> [INPUT.FILES]
                                </h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <FileInputField
                                        label="MP3 (TAGGED)"
                                        id="mp3-upload"
                                        file={mp3File}
                                        onChange={setMp3File}
                                        accept="audio/mpeg,.mp3"
                                        helperText="MP3 OU WAV OBRIGATÓRIO"
                                        variant="success"
                                        icon={<Music className="w-8 h-8 text-green-500" />}
                                    />
                                    <FileInputField
                                        label="WAV (HQ)"
                                        id="wav-upload"
                                        file={wavFile}
                                        onChange={setWavFile}
                                        accept="audio/wav,audio/x-wav,.wav"
                                        helperText="MP3 OU WAV OBRIGATÓRIO"
                                        variant="primary"
                                        icon={<SoundWave className="w-8 h-8 text-blue-500" />}
                                    />
                                    <FileInputField
                                        label="STEMS (.ZIP)"
                                        id="zip-upload"
                                        file={zipFile}
                                        onChange={setZipFile}
                                        isOptional={true}
                                        accept="application/zip,application/x-zip-compressed,.zip"
                                        helperText="TRACKOUT LICENSE"
                                        variant="accent"
                                        icon={<LayersIcon className="w-8 h-8 text-purple-500" />}
                                    />
                                </div>
                            </Card>
                            
                            <Card className="p-8 border-green-900/30 bg-black/60 backdrop-blur-sm">
                                 <h3 className="text-lg font-bold text-green-400 mb-6 flex items-center gap-2 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">
                                    <DollarSign className="w-4 h-4" /> [INPUT.PRICING]
                                 </h3>
                                 <div className="grid md:grid-cols-3 gap-6">
                                     <InputField label="Licença MP3 (R$)" type="number" step="0.01" value={priceMp3} onChange={(e) => setPriceMp3(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="49.90" required />
                                     <InputField label="Licença WAV (R$)" type="number" step="0.01" value={priceWav} onChange={(e) => setPriceWav(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="99.90" />
                                     <InputField label="Licença Stems (R$)" type="number" step="0.01" value={priceStems} onChange={(e) => setPriceStems(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="199.90" />
                                </div>
                            </Card>

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={submissionStatus !== 'idle'} className="bg-green-600 hover:bg-green-500 text-black font-bold font-mono tracking-widest uppercase py-4 px-8 rounded-sm transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] text-center border border-green-400">
                                    {getSubmitButtonText(submissionStatus, submissionMessage, '>> PUBLICAR DADOS')}
                                </button>
                            </div>
                        </form>
                    </section>
                );
             case 'kits':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <section>
                             <h3 className="text-lg font-bold text-green-400 mb-4 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">[SYS.KITS_MANAGER]</h3>
                             <Card className="p-4 max-h-96 overflow-y-auto bg-black/40 border-green-900/30">
                                <div className="space-y-2">
                                    {drumKits.length === 0 ? (
                                        <p className="text-center text-green-800 py-4 font-mono uppercase text-xs">Nenhum kit encontrado.</p>
                                    ) : (
                                        drumKits.map(kit => (
                                            <div key={kit.id} className="flex items-center justify-between p-3 rounded-sm bg-black/20 border border-green-900/20">
                                                <div className="flex items-center gap-4">
                                                     <div className="w-10 h-10 rounded-sm overflow-hidden border border-green-900/50">
                                                        <img src={kit.artworkUrl} alt="" className="w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 transition-all"/>
                                                     </div>
                                                    <div>
                                                        <p className="font-bold text-green-400 font-mono text-sm uppercase">{kit.title}</p>
                                                        <p className="text-xs font-bold text-green-600 font-mono">R$ {kit.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteDrumKitClick(kit)} title="EXCLUIR" className="text-green-700 hover:text-red-500 p-2 border border-transparent hover:border-red-500/30 rounded-sm transition-all">
                                                    <Trash2 className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                             </Card>
                        </section>
                        <section>
                             <Card className="p-8 border-green-900/30 bg-black/60 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-green-400 mb-6 flex items-center gap-2 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">
                                    <Package className="w-4 h-4" /> [INPUT.NEW_KIT]
                                </h3>
                                <form onSubmit={handleAddKitSubmit} className="space-y-6">
                                     <InputField label="Título do Kit" type="text" value={kitTitle} onChange={(e) => setKitTitle(e.target.value)} placeholder="EX: TRAP ESSENTIALS" required />
                                     <InputField label="Descrição" as="textarea" rows={3} value={kitDescription} onChange={(e) => setKitDescription(e.target.value)} placeholder="CONTEÚDO DO KIT..." />
                                     <div className="grid md:grid-cols-2 gap-6">
                                        <InputField label="Preço (R$)" type="number" step="0.01" value={kitPrice} onChange={(e) => setKitPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="79.90" required />
                                     </div>
                                     
                                     <div className="grid md:grid-cols-2 gap-6">
                                          <FileInputField 
                                            label="Arquivo .ZIP" 
                                            id="kit-zip-upload" 
                                            file={kitZipFile} 
                                            onChange={setKitZipFile} 
                                            accept="application/zip,application/x-zip-compressed,.zip"
                                            variant="accent"
                                            icon={<Package className="w-8 h-8 text-purple-500" />} 
                                        />
                                         <FileInputField 
                                            label="Capa (400x400)" 
                                            id="kit-artwork-upload" 
                                            file={kitArtworkFile} 
                                            onChange={setKitArtworkFile} 
                                            accept="image/*"
                                            variant="default"
                                            isOptional={true}
                                            icon={<UploadCloud className="w-8 h-8 text-green-500" />} 
                                        />
                                     </div>

                                    <div className="flex justify-end pt-2">
                                        <button type="submit" disabled={kitSubmissionStatus !== 'idle'} className="bg-green-900/50 hover:bg-green-500/20 text-green-400 border border-green-500/50 font-bold font-mono uppercase tracking-widest py-3 px-6 rounded-sm transition-all disabled:opacity-50 min-w-[180px]">
                                            {getSubmitButtonText(kitSubmissionStatus, kitSubmissionMessage, '>> ADICIONAR KIT')}
                                        </button>
                                    </div>
                                </form>
                            </Card>
                        </section>
                    </div>
                );
                case 'coupons':
    return (
        <section className="animate-fade-in max-w-4xl mx-auto space-y-8">
            <Card className="p-8 border-green-900/30 bg-black/60 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-green-400 mb-6 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">
                    [SYS.COUPONS_MANAGER]
                </h3>
                <div className="space-y-4 mb-6">
                    {coupons.length === 0 ? (
                        <p className="text-center text-green-800 py-4 font-mono uppercase text-xs">Nenhum cupom criado.</p>
                    ) : (
                        coupons.map(coupon => (
                            <div key={coupon.id} className="flex items-center justify-between p-3 rounded-sm bg-black/20 border border-green-900/20">
                                <div className="flex items-center gap-4">
                                    <code className="text-green-400 font-mono text-sm">{coupon.code}</code>
                                    <span className="text-green-600 font-mono text-sm">{coupon.discount_percent}% OFF</span>
                                </div>
                                <button onClick={() => handleDeleteCoupon(coupon.id)} className="text-green-700 hover:text-red-500 p-2 border border-transparent hover:border-red-500/30 rounded-sm transition-all">
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </Card>
            <Card className="p-8 border-green-900/30 bg-black/60 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-green-400 mb-6 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">
                    [INPUT.NEW_COUPON]
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Código do Cupom" type="text" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} placeholder="EX: LANCAMENTO10" />
                    <InputField label="Desconto (%)" type="number" value={newCouponDiscount} onChange={(e) => setNewCouponDiscount(parseInt(e.target.value) || 0)} placeholder="10" />
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleAddCoupon} className="bg-green-600 hover:bg-green-500 text-black font-bold font-mono tracking-widest uppercase py-3 px-6 rounded-sm transition-all border border-green-400">
                        CRIAR CUPOM
                    </button>
                </div>
            </Card>
        </section>
    );
            case 'settings':
                return (
                    <section className="animate-fade-in max-w-4xl mx-auto space-y-8">
                         {/* Payment & Sales Config */}
                         <Card className="p-8 border-green-900/30 bg-black/60 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-green-400 mb-6 flex items-center gap-2 font-mono uppercase tracking-widest border-b border-green-900/30 pb-2">
                                <DollarSign className="w-4 h-4" /> [CONFIG.SALES]
                            </h3>
                            <p className="text-green-800 text-xs font-mono uppercase mb-6 tracking-wide">
                                CONFIGURAR WHATSAPP E PIX PARA PROCESSAMENTO DE PEDIDOS.
                            </p>
                            <form onSubmit={handleSettingsSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                     <InputField 
                                        label="Número WhatsApp" 
                                        type="text" 
                                        value={adminConfig.whatsappNumber} 
                                        onChange={(e) => setAdminConfig({...adminConfig, whatsappNumber: e.target.value})} 
                                        placeholder="5511999999999" 
                                    />
                                    <InputField 
                                        label="Chave Pix" 
                                        type="text" 
                                        value={adminConfig.pixKey} 
                                        onChange={(e) => setAdminConfig({...adminConfig, pixKey: e.target.value})} 
                                        placeholder="CPF/EMAIL/ALEATORIA" 
                                    />
                                </div>
                                
                                <h3 className="text-lg font-bold text-green-400 mt-10 mb-6 flex items-center gap-2 font-mono uppercase tracking-widest border-t border-green-900/30 pt-8">
                                    <Settings className="w-4 h-4" /> [CONFIG.SOCIALS]
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField label="URL YouTube" type="url" value={links.youtube} onChange={(e) => setLinks({...links, youtube: e.target.value})} />
                                    <InputField label="URL TikTok" type="url" value={links.tiktok} onChange={(e) => setLinks({...links, tiktok: e.target.value})} />
                                    <InputField label="URL Instagram" type="url" value={links.instagram} onChange={(e) => setLinks({...links, instagram: e.target.value})} />
                                    <InputField label="URL Spotify" type="url" value={links.spotify} onChange={(e) => setLinks({...links, spotify: e.target.value})} />
                                </div>

                                <h3 className="text-lg font-bold text-red-400 mt-10 mb-6 flex items-center gap-2 font-mono uppercase tracking-widest border-t border-red-900/30 pt-8">
                                    <User className="w-4 h-4" /> [CONFIG.SECURITY]
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField 
                                        label="Novo Usuário Admin" 
                                        type="text" 
                                        value={adminConfig.adminUser} 
                                        onChange={(e) => setAdminConfig({...adminConfig, adminUser: e.target.value})} 
                                    />
                                    <InputField 
                                        label="Nova Senha Admin" 
                                        type="text" 
                                        value={adminConfig.adminPass} 
                                        onChange={(e) => setAdminConfig({...adminConfig, adminPass: e.target.value})} 
                                    />
                                </div>

                                 <div className="flex justify-end pt-6">
                                     <button type="submit" className="bg-green-600 hover:bg-green-500 text-black font-bold font-mono uppercase tracking-widest py-3 px-8 rounded-sm transition-all shadow-lg shadow-green-900/20 border border-green-400">{">> SALVAR SISTEMA"}</button>
                                </div>
                            </form>
                        </Card>
                    </section>
                );
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
                <div className="flex justify-between items-start gap-4 border-b border-green-900/30 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-green-400 font-mono uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                            PAINEL_CONTROLE
                        </h1>
                        <p className="mt-1 text-[10px] text-green-700 font-mono uppercase tracking-widest">
                            SYSTEM.ADMIN.ACCESS // V1.0
                        </p>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="flex-shrink-0 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-green-600 hover:text-red-400 transition-colors bg-black border border-green-900/50 hover:border-red-500/50 px-4 py-2 rounded-sm"
                    >
                        <LogOut className="w-3 h-3" />
                        <span>LOGOUT</span>
                    </button>
                </div>
                
                <div className="border-b border-green-900/30 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <TabButton 
                            label="DASHBOARD" 
                            icon={<BarChart2 />}
                            isActive={activeTab === 'dashboard'} 
                            onClick={() => setActiveTab('dashboard')} 
                        />
                        <TabButton 
                            label="ADD BEAT" 
                            icon={<UploadCloud />}
                            isActive={activeTab === 'add'} 
                            onClick={() => setActiveTab('add')} 
                        />
                         <TabButton 
                            label="SOUND KITS" 
                            icon={<Package />}
                            isActive={activeTab === 'kits'} 
                            onClick={() => setActiveTab('kits')} 
                        />
                        <TabButton 
                            label="CONFIG" 
                            icon={<Settings />}
                            isActive={activeTab === 'settings'} 
                            onClick={() => setActiveTab('settings')} 
                       />
                       <TabButton 
                           label="CUPONS" 
                           icon={<DollarSign />}
                           isActive={activeTab === 'coupons'} 
                           onClick={() => setActiveTab('coupons')} 
                                
                        />
                    </div>
                </div>

                <div className="mt-6">
                    {renderContent()}
                </div>
            </div>

            {editingBeat && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" aria-modal="true" role="dialog">
                    <div className="min-h-[100px] w-full max-w-2xl flex items-center justify-center py-8">
                    <Card className="p-8 w-full relative animate-fade-in-up bg-black border border-green-500/30 shadow-[0_0_30px_rgba(74,222,128,0.1)]">
                        <button onClick={() => setEditingBeat(null)} className="absolute top-4 right-4 text-green-700 hover:text-green-400 transition-colors z-10">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-green-400 mb-6 font-mono uppercase tracking-widest">
                            {'[EDIT.TARGET] >'} <span className="text-white">{editingBeat.title}</span>
                        </h2>
                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <InputField label="Título" type="text" name="title" value={editFormData.title || ''} onChange={handleEditFormChange} required />
                            <div className="grid md:grid-cols-4 gap-6">
                                <InputField label="BPM" type="number" name="bpm" value={editFormData.bpm || ''} onChange={handleEditFormChange} required />
                                <InputField label="Tom" type="text" name="key" value={editFormData.key || ''} onChange={handleEditFormChange} required />
                                <InputField label="Duração" type="text" name="duration" value={editFormData.duration || ''} onChange={handleEditFormChange} placeholder="MM:SS" required />
                                <InputField label="Tags" type="text" name="tags" value={editFormData.tags || ''} onChange={handleEditFormChange} />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-green-600 mb-2 font-mono uppercase tracking-widest">Atualizar Arquivos</label>
                                <div className="grid md:grid-cols-3 gap-4">
                                     <FileInputField
                                        label="Novo MP3"
                                        id="edit-mp3"
                                        file={editMp3File}
                                        onChange={setEditMp3File}
                                        accept=".mp3"
                                        variant="success"
                                        icon={<Music className="w-6 h-6 text-green-500" />}
                                    />
                                    <FileInputField
                                        label="Novo WAV"
                                        id="edit-wav"
                                        file={editWavFile}
                                        onChange={setEditWavFile}
                                        accept=".wav"
                                        variant="primary"
                                        icon={<SoundWave className="w-6 h-6 text-blue-500" />}
                                    />
                                    <FileInputField
                                        label="Novos Stems"
                                        id="edit-zip"
                                        file={editZipFile}
                                        onChange={setEditZipFile}
                                        accept=".zip"
                                        variant="accent"
                                        icon={<LayersIcon className="w-6 h-6 text-purple-500" />}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-green-600 mb-2 font-mono uppercase tracking-widest">Preços</label>
                                <div className="grid md:grid-cols-3 gap-6">
                                     <InputField label="MP3 (R$)" type="number" step="0.01" name="price_mp3" value={editFormData.price_mp3 ?? ''} onChange={handleEditFormChange} required />
                                     <InputField label="WAV (R$)" type="number" step="0.01" name="price_wav" value={editFormData.price_wav ?? ''} onChange={handleEditFormChange} />
                                     <InputField label="Stems (R$)" type="number" step="0.01" name="price_stems" value={editFormData.price_stems ?? ''} onChange={handleEditFormChange} />
                                </div>
                            </div>
                            <div>
                               <InputField 
                                    label="Descrição"
                                    as="textarea"
                                    name="description"
                                    value={editFormData.description || ''}
                                    onChange={handleEditFormChange}
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-4 border-t border-green-900/30">
                                <button type="button" onClick={() => setEditingBeat(null)} className="bg-transparent hover:bg-green-900/20 border border-green-900 text-green-600 font-mono font-bold py-2 px-4 rounded-sm transition-colors uppercase text-xs">Cancelar</button>
                                <button type="submit" disabled={isEditingSaving} className="bg-green-600 hover:bg-green-500 text-black font-bold font-mono uppercase tracking-widest py-2 px-6 rounded-sm transition-colors disabled:opacity-50">
                                    {isEditingSaving ? '...' : 'SALVAR'}
                                </button>
                            </div>
                        </form>
                    </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
