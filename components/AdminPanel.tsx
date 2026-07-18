
import React, { useState, useEffect, useRef } from 'react';
import Card from './ContactSection';
import { UploadCloud, LogOut, BarChart2, Settings, Trash2, Music, Package, DollarSign, InfoIcon, LayersIcon, SoundWave, User, EditIcon, X, AlertTriangleIcon, CheckCircleIcon } from './icons';
import type { Beat, SocialLinks, DrumKit, DrumKitSample, AdminSettings } from '../App';
import { useToast } from './ToastProvider';
import { supabase } from '../supabaseClient';
import KitArtworkGenerator from './KitArtworkGenerator';


interface AdminPanelProps {
    beats: Beat[];
    drumKits: DrumKit[];
    socialLinks: SocialLinks;
    settings: AdminSettings;
    onAddBeat: (newBeat: Beat) => void;
    onUpdateBeat: (beatId: string, data: Partial<Beat>) => void;
    onDeleteBeat: (beat: Beat) => void;
    onAddDrumKit: (newKit: DrumKit) => void;
    onUpdateDrumKit: (kitId: string, data: Partial<DrumKit>) => Promise<void>;
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


const AdminPanel: React.FC<AdminPanelProps> = ({ beats, drumKits, socialLinks, settings, onAddBeat, onDeleteBeat, onUpdateBeat, onAddDrumKit, onUpdateDrumKit, onDeleteDrumKit, onUpdateSocialLinks, onUpdateSettings, onLogout }) => {
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
    const [kitTags, setKitTags] = useState('');
    const [kitSampleFiles, setKitSampleFiles] = useState<File[]>([]);
    const [kitArtworkFile, setKitArtworkFile] = useState<File | null>(null);
    const [kitGeneratedArtwork, setKitGeneratedArtwork] = useState<string | null>(null);
    
    const [kitSubmissionStatus, setKitSubmissionStatus] = useState<SubmissionStatus>('idle');
    const [kitSubmissionMessage, setKitSubmissionMessage] = useState('');

    // Edit Beat Modal State
    const [editingBeat, setEditingBeat] = useState<Beat | null>(null);
    const [editFormData, setEditFormData] = useState<Omit<Partial<Beat>, 'tags'> & { tags?: string }>({});
    const [editMp3File, setEditMp3File] = useState<File | null>(null);
    const [editWavFile, setEditWavFile] = useState<File | null>(null);
    const [editZipFile, setEditZipFile] = useState<File | null>(null);
    const [isEditingSaving, setIsEditingSaving] = useState(false);

    // Edit Kit Modal State
    const [editingKit, setEditingKit] = useState<DrumKit | null>(null);
    const [editKitForm, setEditKitForm] = useState({ title: '', description: '', price: 0, tags: '' });
    const [isEditingKitSaving, setIsEditingKitSaving] = useState(false);
    const [editKitNewFiles, setEditKitNewFiles] = useState<File[]>([]);
    const [editKitUploading, setEditKitUploading] = useState(false);
    const [corruptedSamples, setCorruptedSamples] = useState<Set<string>>(new Set());
    const [checkingSamples, setCheckingSamples] = useState(false);

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

useEffect(() => {
    if (editingKit) {
        setEditKitForm({
            title: editingKit.title,
            description: editingKit.description || '',
            price: editingKit.price,
            tags: editingKit.tags?.join(', ') || ''
        });
    }
}, [editingKit]);

    // Upload para Cloudflare R2 via presigned POST
    const VALID_AUDIO_MIME: Record<string, string> = {
        wav: 'audio/wav', mp3: 'audio/mpeg', aif: 'audio/aif', aiff: 'audio/aiff',
        ogg: 'audio/ogg', flac: 'audio/flac', m4a: 'audio/mp4', aac: 'audio/aac',
    };

    const validateAudioFile = (file: File): string => {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const contentType = VALID_AUDIO_MIME[ext];
        if (!contentType) throw new Error(`Formato não suportado: .${ext} (use WAV, MP3, AIF, AIFF)`);
        return contentType;
    };

    const uploadFile = async (file: File | null, statusSetter: (status: SubmissionStatus) => void, messageSetter: (message: string) => void): Promise<string | null> => {
        if (!file) return null;
        try {
            const contentType = validateAudioFile(file);
            statusSetter('uploading');
            messageSetter(`Enviando ${file.name} para R2...`);

            const res = await fetch(`/api/get-presigned-post?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(contentType)}`);
            if (!res.ok) throw new Error('Falha ao obter URL de upload');
            const { uploadUrl, publicUrl } = await res.json();

            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': contentType },
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

    const uploadAnyFile = async (file: File): Promise<string | null> => {
        try {
            const contentType = file.type || 'application/octet-stream';
            const res = await fetch(`/api/get-presigned-post?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(contentType)}`);
            if (!res.ok) throw new Error('Falha ao obter URL de upload');
            const { uploadUrl, publicUrl } = await res.json();
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': contentType },
            });
            if (!uploadRes.ok) throw new Error(`Upload falhou: ${uploadRes.status}`);
            return publicUrl;
        } catch (error: any) {
            console.error('Erro no upload:', error);
            return null;
        }
    };

    const handleDeleteBeatClick = async (beat: Beat) => {
        if (!confirm(`EXCLUIR "${beat.title}"?`)) return;
        onDeleteBeat(beat);
    };

    const handleDeleteDrumKitClick = async (kit: DrumKit) => {
        if (!confirm(`EXCLUIR "${kit.title}"?`)) return;
        onDeleteDrumKit(kit);
    };

    const [fixingKitId, setFixingKitId] = useState<string | null>(null);
    const [forceFix, setForceFix] = useState(false);

    const handleFixMimeTypes = async (kit: DrumKit, force = false) => {
        if (!kit.samples || kit.samples.length === 0) {
            addToast('Este kit não tem samples.', 'error');
            return;
        }
        const msg = force
            ? `Forçar re-upload de TODOS os ${kit.samples.length} samples de "${kit.title}"?`
            : `Verificar content-type de ${kit.samples.length} samples de "${kit.title}"?`;
        if (!confirm(msg)) return;

        setFixingKitId(kit.id);

        try {
            const res = await fetch('/api/fix-r2-mime', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    samples: kit.samples.map(s => ({ fileUrl: s.file_url, fileName: s.file_name })),
                    force,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Falha ao processar');
            }

            const { results } = await res.json();

            const fixed = results.filter((r: any) => r.status === 'fixed');
            const skipped = results.filter((r: any) => r.status === 'skipped');
            const errors = results.filter((r: any) => r.status === 'error');

            if (fixed.length > 0) {
                const updatedSamples = kit.samples.map(s => {
                    const fix = fixed.find((f: any) => f.fileName === s.file_name);
                    return fix ? { ...s, file_url: fix.newUrl } : s;
                });

                for (const sample of updatedSamples) {
                    const fix = fixed.find((f: any) => f.fileName === sample.file_name);
                    if (fix) {
                        const { error } = await supabase
                            .from('drum_kit_samples')
                            .update({ file_url: sample.file_url })
                            .eq('id', sample.id);
                        if (error) throw new Error(`Erro ao atualizar ${sample.file_name}: ${error.message}`);
                    }
                }

                onUpdateDrumKit(kit.id, { samples: updatedSamples });
            }

            const msgs = [];
            if (fixed.length > 0) msgs.push(`${fixed.length} corrigido(s)`);
            if (skipped.length > 0) msgs.push(`${skipped.length} já correto(s)`);
            if (errors.length > 0) msgs.push(`${errors.length} erro(s)`);

            if (errors.length > 0) {
                addToast(`${msgs.join(' | ')}. Erros: ${errors.map((e: any) => e.fileName).join(', ')}`, 'error');
            } else {
                addToast(`${msgs.join(' | ')}`, 'success');
            }
        } catch (error: any) {
            console.error('Erro ao corrigir MIME:', error);
            addToast(`Erro: ${error.message}`, 'error');
        } finally {
            setFixingKitId(null);
        }
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

        if (!kitTitle || kitPrice === '' || kitSampleFiles.length === 0) {
            addToast("Preencha titulo, preco e envie pelo menos 1 sample.", 'error');
            return;
        }

        try {
            setKitSubmissionStatus('uploading');
            setKitSubmissionMessage('Enviando samples...');

            const sampleUrls = await Promise.all(
                kitSampleFiles.map(async (file) => {
                    const contentType = validateAudioFile(file);
                    const res = await fetch(`/api/get-presigned-post?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(contentType)}`);
                    if (!res.ok) throw new Error('Falha ao obter URL de upload');
                    const { uploadUrl, publicUrl } = await res.json();
                    const uploadRes = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } });
                    if (!uploadRes.ok) throw new Error(`Upload falhou: ${file.name}`);
                    return { file_name: file.name, file_url: publicUrl };
                })
            );

            const artworkUrl = kitArtworkFile ? await uploadFile(kitArtworkFile, setKitSubmissionStatus, setKitSubmissionMessage) : null;
            
            setKitSubmissionStatus('saving');
            setKitSubmissionMessage('Registrando kit...');
            
            const finalArtwork = artworkUrl || kitGeneratedArtwork || `https://placehold.co/400x400/000000/22c55e?text=${encodeURIComponent(kitTitle)}`;
            const slug = kitTitle.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const samples: DrumKitSample[] = sampleUrls.map((s, i) => ({
                id: crypto.randomUUID(),
                pack_id: '',
                file_name: s.file_name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                file_url: s.file_url,
                duration: '',
                key: '',
                bpm: 0,
                sort_order: i
            }));

            const newKitData: DrumKit = {
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                title: kitTitle.toUpperCase(),
                slug,
                description: kitDescription,
                price: Number(kitPrice),
                download_url: sampleUrls[0]?.file_url || '',
                artworkUrl: finalArtwork,
                tags: kitTags.split(',').map(t => t.trim()).filter(Boolean),
                samples
            };
            onAddDrumKit(newKitData);
            setKitTitle(''); setKitDescription(''); setKitPrice(79.90); setKitTags('');
            setKitSampleFiles([]); setKitArtworkFile(null); setKitGeneratedArtwork(null);
            setActiveTab('dashboard');
        } catch (error: any) {
            console.error("Error adding drum kit:", error);
            addToast(`Erro: ${kitSubmissionMessage || error.message}`, 'error');
        } finally {
            setKitSubmissionStatus('idle');
            setKitSubmissionMessage('');
        }
    };

    const handleGenerateKitArtwork = async (kit: DrumKit) => {
        setFixingKitId(kit.id);
        try {
            const canvas = document.createElement('canvas');
            const w = 800, h = 800;
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas not supported');

            const sampleCount = kit.samples?.length || 0;
            const displayTitle = kit.title.toUpperCase().replace(/[^A-Z0-9 _]/g, '').trim();

            // === BACKGROUND - dark lab environment ===
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#1a1a1a');
            bgGrad.addColorStop(0.5, '#0a0a0a');
            bgGrad.addColorStop(1, '#111111');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            // Subtle grid
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.03)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < w; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
            for (let i = 0; i < h; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

            // === TITLE SECTION ===
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(74, 222, 128, 0.3)';
            ctx.shadowBlur = 15;
            ctx.font = 'bold 72px monospace';
            // First word big
            const titleWords = displayTitle.split(/[\s_]+/).filter(Boolean);
            ctx.fillText(titleWords[0] || 'SOUND', w / 2, 100);
            ctx.shadowBlur = 0;

            // Subtitle
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '18px monospace';
            ctx.fillText(displayTitle, w / 2, 135);

            // === CRT MONITOR (center piece) ===
            const monX = 100, monY = 170, monW = 400, monH = 300;

            // Monitor outer frame (3D box look)
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(monX - 15, monY - 15, monW + 30, monH + 50);
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(monX - 15, monY - 15, monW + 30, monH + 50);

            // Monitor screen bezel
            ctx.fillStyle = '#0d0d0d';
            ctx.fillRect(monX, monY, monW, monH);
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.2)';
            ctx.lineWidth = 1;
            ctx.strokeRect(monX, monY, monW, monH);

            // Screen glow
            const screenGrad = ctx.createRadialGradient(monX + monW/2, monY + monH/2, 0, monX + monW/2, monY + monH/2, monW/2);
            screenGrad.addColorStop(0, 'rgba(34, 197, 94, 0.08)');
            screenGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = screenGrad;
            ctx.fillRect(monX, monY, monW, monH);

            // Kit name inside monitor - BIG bold
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
            ctx.shadowBlur = 20;
            const monitorTitle = displayTitle;
            if (monitorTitle.length > 14) {
                const mw = monitorTitle.split(/[\s_]+/).filter(Boolean);
                const mid = Math.ceil(mw.length / 2);
                ctx.font = 'bold 56px monospace';
                ctx.fillText(mw.slice(0, mid).join(' '), monX + monW/2, monY + monH/2 - 20);
                ctx.fillText(mw.slice(mid).join(' '), monX + monW/2, monY + monH/2 + 45);
            } else {
                ctx.font = 'bold 64px monospace';
                ctx.fillText(monitorTitle, monX + monW/2, monY + monH/2 + 15);
            }
            ctx.shadowBlur = 0;

            // ECG line below name
            ctx.beginPath();
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(34, 197, 94, 0.8)';
            ctx.shadowBlur = 8;
            const ecgLineY = monY + monH - 40;
            ctx.moveTo(monX + 15, ecgLineY);
            for (let x = monX + 15; x < monX + monW - 15; x += 2) {
                const progress = (x - monX) / monW;
                let y = ecgLineY;
                const pos = (progress * 6) % 1;
                if (pos > 0.08 && pos < 0.12) y = ecgLineY - 5;
                else if (pos > 0.12 && pos < 0.15) y = ecgLineY + 3;
                else if (pos > 0.15 && pos < 0.2) y = ecgLineY - 25;
                else if (pos > 0.2 && pos < 0.24) y = ecgLineY + 18;
                else if (pos > 0.24 && pos < 0.27) y = ecgLineY - 4;
                else if (pos > 0.35 && pos < 0.45) y = ecgLineY - 8;
                else if (pos > 0.5 && pos < 0.55) y = ecgLineY + 4;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Monitor stand
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(monX + monW/2 - 30, monY + monH + 15, 60, 20);
            ctx.fillRect(monX + monW/2 - 60, monY + monH + 30, 120, 8);
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.2)';
            ctx.lineWidth = 1;
            ctx.strokeRect(monX + monW/2 - 30, monY + monH + 15, 60, 20);
            ctx.strokeRect(monX + monW/2 - 60, monY + monH + 30, 120, 8);

            // === IV BAG / SONDA (right side) ===
            const ivX = monX + monW + 60, ivY = monY + 20;

            // IV bag body
            ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
            ctx.beginPath();
            ctx.roundRect(ivX, ivY, 80, 140, 8);
            ctx.fill();
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(ivX, ivY, 80, 140, 8);
            ctx.stroke();

            // Liquid level (green)
            const liquidH = 90;
            ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
            ctx.beginPath();
            ctx.roundRect(ivX + 5, ivY + 50, 70, liquidH, 4);
            ctx.fill();

            // Liquid glow
            const liqGrad = ctx.createLinearGradient(ivX, ivY + 50, ivX, ivY + 50 + liquidH);
            liqGrad.addColorStop(0, 'rgba(34, 197, 94, 0.1)');
            liqGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.3)');
            liqGrad.addColorStop(1, 'rgba(34, 197, 94, 0.15)');
            ctx.fillStyle = liqGrad;
            ctx.beginPath();
            ctx.roundRect(ivX + 5, ivY + 50, 70, liquidH, 4);
            ctx.fill();

            // IV bag label
            ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
            ctx.font = '7px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('MELODY_VITALS', ivX + 40, ivY + 15);

            // Measurement lines
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 5; i++) {
                const ly = ivY + 55 + i * 18;
                ctx.beginPath(); ctx.moveTo(ivX + 60, ly); ctx.lineTo(ivX + 75, ly); ctx.stroke();
            }

            // IV tube going down
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(ivX + 40, ivY + 140);
            ctx.quadraticCurveTo(ivX + 40, ivY + 200, monX + monW - 20, monY + monH - 30);
            ctx.stroke();

            // Drip drops
            ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
            ctx.beginPath(); ctx.arc(ivX + 40, ivY + 155, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(ivX + 42, ivY + 170, 2, 0, Math.PI * 2); ctx.fill();

            // === ECG LINE (left side, vertical) ===
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
            ctx.shadowBlur = 6;
            ctx.moveTo(30, monY);
            for (let y = monY; y < monY + monH; y += 2) {
                const progress = (y - monY) / monH;
                let x = 30;
                const pos = (progress * 4) % 1;
                if (pos > 0.3 && pos < 0.35) x = 20;
                else if (pos > 0.35 && pos < 0.4) x = 40;
                else if (pos > 0.4 && pos < 0.45) x = 10;
                else if (pos > 0.45 && pos < 0.5) x = 45;
                else if (pos > 0.5 && pos < 0.55) x = 25;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // === INFO PANELS (bottom) ===
            const panelY = 560;

            // Left panel - system info
            ctx.fillStyle = 'rgba(74, 222, 128, 0.04)';
            ctx.fillRect(40, panelY, 340, 160);
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(40, panelY, 340, 160);

            // Brackets
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(45, panelY + 20); ctx.lineTo(45, panelY + 5); ctx.lineTo(60, panelY + 5); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(45, panelY + 140); ctx.lineTo(45, panelY + 155); ctx.lineTo(60, panelY + 155); ctx.stroke();

            ctx.fillStyle = 'rgba(74, 222, 128, 0.5)';
            ctx.font = '11px monospace';
            ctx.textAlign = 'left';
            const infoLines = [
                `cite: SYSTEM:  RMX_LAB`,
                `cite: CREATOR: RMX`,
                ``,
                `cite: CONTENT: ${sampleCount}_SAMPLES`,
                `cite: COMPATIBILITY: ALL_DAWS`,
                `cite: FILE_TYPE: 24-BIT_WAV`,
                `cite: ROYALTY: ROYALTIES_FREE`,
            ];
            infoLines.forEach((line, i) => {
                ctx.fillText(line, 60, panelY + 25 + i * 18);
            });

            // Right panel - acquire button
            const rpX = 410;
            ctx.fillStyle = 'rgba(74, 222, 128, 0.04)';
            ctx.fillRect(rpX, panelY, 340, 160);
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
            ctx.strokeRect(rpX, panelY, 340, 160);

            ctx.fillStyle = 'rgba(74, 222, 128, 0.5)';
            ctx.font = '11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('cite: SOUND KIT INFO _X', rpX + 170, panelY + 25);

            // Acquire button (purple)
            ctx.fillStyle = 'rgba(138, 43, 226, 0.7)';
            ctx.beginPath();
            ctx.roundRect(rpX + 40, panelY + 50, 260, 45, 4);
            ctx.fill();
            ctx.strokeStyle = 'rgba(138, 43, 226, 0.9)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(rpX + 40, panelY + 50, 260, 45, 4);
            ctx.stroke();

            // Cart icon (simple)
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px monospace';
            ctx.fillText('\u{1F6D2}', rpX + 170, panelY + 78);

            ctx.fillStyle = 'rgba(74, 222, 128, 0.5)';
            ctx.font = '11px monospace';
            ctx.fillText('_ACQUIRE_KIT_V1_', rpX + 170, panelY + 120);

            // Price
            const price = kit.price || 0;
            const priceInt = Math.floor(price);
            const priceDec = Math.round((price - priceInt) * 100);
            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 28px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`R$ ${priceInt},${String(priceDec).padStart(2, '0')}`, rpX + 170, panelY + 150);

            // === CORNER MARKERS ===
            const cs = 15;
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(15, 15 + cs); ctx.lineTo(15, 15); ctx.lineTo(15 + cs, 15); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(w - 15 - cs, 15); ctx.lineTo(w - 15, 15); ctx.lineTo(w - 15, 15 + cs); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(15, h - 15 - cs); ctx.lineTo(15, h - 15); ctx.lineTo(15 + cs, h - 15); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(w - 15 - cs, h - 15); ctx.lineTo(w - 15, h - 15); ctx.lineTo(w - 15, h - 15 - cs); ctx.stroke();

            // Reflection at bottom
            const reflGrad = ctx.createLinearGradient(0, h - 30, 0, h);
            reflGrad.addColorStop(0, 'rgba(74, 222, 128, 0)');
            reflGrad.addColorStop(1, 'rgba(74, 222, 128, 0.03)');
            ctx.fillStyle = reflGrad;
            ctx.fillRect(0, h - 30, w, 30);

            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), 'image/png', 1.0);
            });
            const file = new File([blob], `${kit.title.replace(/[^a-zA-Z0-9]/g, '_')}_artwork.png`, { type: 'image/png' });

            const publicUrl = await uploadAnyFile(file);

            if (publicUrl) {
                const { error } = await supabase
                    .from('drum_kits')
                    .update({ artworkUrl: publicUrl })
                    .eq('id', kit.id);
                if (error) throw error;
                onUpdateDrumKit(kit.id, { artworkUrl: publicUrl });
                addToast(`Artwork gerada e salva para "${kit.title}"`, 'success');
            }
        } catch (error: any) {
            console.error("Error generating artwork:", error);
            addToast(`Erro ao gerar artwork: ${error.message}`, 'error');
        } finally {
            setFixingKitId(null);
        }
    };

    const handleGenerateAIArtwork = async (kit: DrumKit) => {
        setFixingKitId(kit.id);
        try {
            const sampleCount = kit.samples?.length || 0;
            const prompt = `Generate a cyberpunk laboratory artwork image for a sound kit called "${kit.title}". The scene shows an old CRT computer monitor in the center displaying the kit name "${kit.title}" in bold white monospace text with a green ECG heartbeat waveform below the name. To the right of the monitor, an IV bag filled with glowing green liquid labeled "MELODY_VITALS" connected to the monitor by a tube. On the left side, a vertical green ECG line pulses. At the bottom, two dark info panels show system details: "${sampleCount} samples | 24-bit WAV | Royalty Free" and a purple "ACQUIRE KIT" button. The background is dark black with a subtle green grid pattern and corner markers. The style is very detailed 3D rendered with reflections on the monitor glass. Cyberpunk medical lab aesthetic, green and black color scheme, cinematic lighting.`;

            const res = await fetch('/api/generate-artwork', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to generate artwork');
            }

            const { imageUrl } = await res.json();

            if (imageUrl) {
                // Download the image and upload to R2
                const imgRes = await fetch(imageUrl);
                const blob = await imgRes.blob();
                const file = new File([blob], `${kit.title.replace(/[^a-zA-Z0-9]/g, '_')}_ai_artwork.png`, { type: 'image/png' });
                const publicUrl = await uploadAnyFile(file);

                if (publicUrl) {
                    const { error } = await supabase
                        .from('drum_kits')
                        .update({ artworkUrl: publicUrl })
                        .eq('id', kit.id);
                    if (error) throw error;
                    onUpdateDrumKit(kit.id, { artworkUrl: publicUrl });
                    addToast(`Artwork IA gerada para "${kit.title}"`, 'success');
                }
            }
        } catch (error: any) {
            console.error("Error generating AI artwork:", error);
            addToast(`Erro IA: ${error.message}`, 'error');
        } finally {
            setFixingKitId(null);
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

    const handleDeleteSample = async (sampleId: string, fileName: string) => {
        if (!editingKit) return;

        try {
            const { error } = await supabase
                .from('drum_kit_samples')
                .delete()
                .eq('id', sampleId);

            if (error) throw new Error(error.message);

            const updatedSamples = editingKit.samples.filter(s => s.id !== sampleId);
            setEditingKit({ ...editingKit, samples: updatedSamples });
            onUpdateDrumKit(editingKit.id, { samples: updatedSamples });
            addToast(`Sample "${fileName}" excluído.`, 'success');
        } catch (error: any) {
            addToast(`Erro ao excluir: ${error.message}`, 'error');
        }
    };

    const handleEditKitUploadSamples = async () => {
        if (!editingKit || editKitNewFiles.length === 0) return;
        setEditKitUploading(true);
        const newSamples: DrumKitSample[] = [];

        try {
            for (const file of editKitNewFiles) {
                const contentType = validateAudioFile(file);

                const res = await fetch(`/api/get-presigned-post?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(contentType)}`);
                if (!res.ok) throw new Error('Falha ao obter URL de upload');
                const { uploadUrl, publicUrl } = await res.json();

                const uploadRes = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { 'Content-Type': contentType },
                });
                if (!uploadRes.ok) throw new Error(`Upload falhou: ${file.name}`);

                const { data: dbSample, error: dbError } = await supabase
                    .from('drum_kit_samples')
                    .insert({
                        pack_id: editingKit.id,
                        file_name: file.name,
                        file_url: publicUrl,
                        duration: '',
                        key: '',
                        bpm: 0,
                        sort_order: editingKit.samples.length + newSamples.length,
                    })
                    .select()
                    .single();

                if (dbError) throw new Error(`Erro ao salvar no banco: ${dbError.message}`);
                newSamples.push(dbSample);
            }

            const updatedSamples = [...editingKit.samples, ...newSamples];
            setEditingKit({ ...editingKit, samples: updatedSamples });
            onUpdateDrumKit(editingKit.id, { samples: updatedSamples });
            setEditKitNewFiles([]);
            addToast(`${newSamples.length} sample(s) adicionado(s)!`, 'success');
        } catch (error: any) {
            addToast(`Erro no upload: ${error.message}`, 'error');
        } finally {
            setEditKitUploading(false);
        }
    };

    const handleDetectCorrupted = async () => {
        if (!editingKit || editingKit.samples.length === 0) return;
        setCheckingSamples(true);
        setCorruptedSamples(new Set());
        const corrupted = new Set<string>();

        const checkPromises = editingKit.samples.map(async (sample) => {
            try {
                const res = await fetch(sample.file_url, { method: 'HEAD' });
                if (!res.ok) { corrupted.add(sample.id); return; }
                const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
                if (contentLength > 0 && contentLength < 1024) { corrupted.add(sample.id); return; }
                const contentType = res.headers.get('content-type') || '';
                if (contentType && !contentType.startsWith('audio/') && !contentType.startsWith('application/octet-stream')) {
                    corrupted.add(sample.id);
                }
            } catch {
                try {
                    const res = await fetch(sample.file_url);
                    if (!res.ok) { corrupted.add(sample.id); return; }
                    const blob = await res.blob();
                    if (blob.size < 1024) { corrupted.add(sample.id); }
                } catch {
                    corrupted.add(sample.id);
                }
            }
        });

        await Promise.all(checkPromises);
        setCorruptedSamples(corrupted);
        setCheckingSamples(false);

        if (corrupted.size > 0) {
            addToast(`${corrupted.size} sample(s) com problema detectados!`, 'error');
        } else {
            addToast('Todos os samples estão OK!', 'success');
        }
    };

    const waveformCache = useRef<Map<string, number[]>>(new Map());

    const MiniWaveform: React.FC<{ url: string; isCorrupted: boolean }> = ({ url, isCorrupted }) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [peaks, setPeaks] = useState<number[] | null>(waveformCache.current.get(url) || null);

        useEffect(() => {
            if (isCorrupted) return;
            if (peaks) return;
            let cancelled = false;
            const load = async () => {
                try {
                    const res = await fetch(url);
                    if (!res.ok) return;
                    const arrayBuffer = await res.arrayBuffer();
                    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                    if (cancelled) return;
                    const rawData = audioBuffer.getChannelData(0);
                    const samples = 40;
                    const blockSize = Math.floor(rawData.length / samples);
                    const p: number[] = [];
                    for (let i = 0; i < samples; i++) {
                        let sum = 0;
                        const start = i * blockSize;
                        for (let j = start; j < start + blockSize && j < rawData.length; j++) {
                            sum += Math.abs(rawData[j]);
                        }
                        p.push(sum / blockSize);
                    }
                    const maxPeak = Math.max(...p, 0.01);
                    const normalized = p.map(val => val / maxPeak);
                    audioCtx.close();
                    waveformCache.current.set(url, normalized);
                    if (!cancelled) setPeaks(normalized);
                } catch { /* skip */ }
            };
            load();
            return () => { cancelled = true; };
        }, [url, isCorrupted]);

        useEffect(() => {
            if (!peaks || isCorrupted) return;
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = 120 * dpr;
            canvas.height = 24 * dpr;
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, 120, 24);
            const barW = 120 / peaks.length;
            peaks.forEach((h, i) => {
                const barH = Math.max(h * 20, 1);
                ctx.fillStyle = 'rgba(74, 222, 128, 0.6)';
                ctx.fillRect(i * barW + 0.5, (24 - barH) / 2, barW - 1, barH);
            });
        }, [peaks, isCorrupted]);

        if (isCorrupted) {
            return <span className="text-[10px] text-red-500 font-mono">CORROMPIDO</span>;
        }
        return <canvas ref={canvasRef} style={{ width: 120, height: 24 }} className="opacity-70" />;
    };

    const handleEditKitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingKit) return;
        setIsEditingKitSaving(true);
        try {
            const slug = editKitForm.title.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const updatedData = {
                title: editKitForm.title.toUpperCase(),
                slug,
                description: editKitForm.description,
                price: Number(editKitForm.price),
                tags: editKitForm.tags.split(',').map(t => t.trim()).filter(Boolean)
            };
            await onUpdateDrumKit(editingKit.id, updatedData);
            setEditingKit(null);
        } catch (error) {
            console.error(error);
            addToast('Erro ao atualizar kit.', 'error');
        } finally {
            setIsEditingKitSaving(false);
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
                                                        <p className="text-[10px] text-green-700 font-mono">
                                                            R$ {kit.price.toFixed(2)} · {kit.samples?.length || 0} samples
                                                            {kit.tags?.length > 0 && ` · ${kit.tags.join(', ')}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleGenerateKitArtwork(kit)} title="GERAR ARTWORK (CANVAS)" disabled={fixingKitId === kit.id} className="p-2 border border-transparent rounded-sm transition-all text-green-700 hover:text-green-400 hover:border-green-500/30">
                                                        <span className="text-xs font-mono">🎨</span>
                                                    </button>
                                                    <button onClick={() => handleGenerateAIArtwork(kit)} title="GERAR ARTWORK (IA)" disabled={fixingKitId === kit.id} className={`p-2 border border-transparent rounded-sm transition-all ${fixingKitId === kit.id ? 'text-yellow-500 animate-pulse border-yellow-500/30' : 'text-green-700 hover:text-purple-400 hover:border-purple-500/30'}`}>
                                                        <span className="text-xs font-mono">{fixingKitId === kit.id ? '⏳' : '🤖'}</span>
                                                    </button>
                                                    <button onClick={() => handleFixMimeTypes(kit)} title="CORRIGIR MIME TYPES" disabled={fixingKitId === kit.id} className={`p-2 border border-transparent rounded-sm transition-all ${fixingKitId === kit.id ? 'text-yellow-500 animate-pulse border-yellow-500/30' : 'text-green-700 hover:text-yellow-400 hover:border-yellow-500/30'}`}>
                                                        <span className="text-xs font-mono">{fixingKitId === kit.id ? '⏳' : '🔧'}</span>
                                                    </button>
                                                    <button onClick={() => handleFixMimeTypes(kit, true)} title="FORÇAR RE-UPLOAD TODOS" disabled={fixingKitId === kit.id} className={`p-2 border border-transparent rounded-sm transition-all ${fixingKitId === kit.id ? 'text-yellow-500 animate-pulse border-yellow-500/30' : 'text-green-700 hover:text-red-400 hover:border-red-500/30'}`}>
                                                        <span className="text-xs font-mono">🔄</span>
                                                    </button>
                                                    <button onClick={() => setEditingKit(kit)} title="EDITAR" className="text-green-700 hover:text-green-400 p-2 border border-transparent hover:border-green-500/30 rounded-sm transition-all">
                                                        <EditIcon className="w-4 h-4"/>
                                                    </button>
                                                    <button onClick={() => handleDeleteDrumKitClick(kit)} title="EXCLUIR" className="text-green-700 hover:text-red-500 p-2 border border-transparent hover:border-red-500/30 rounded-sm transition-all">
                                                        <Trash2 className="w-4 h-4"/>
                                                    </button>
                                                </div>
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
                                      <div className="grid md:grid-cols-3 gap-6">
                                        <InputField label="Preço (R$)" type="number" step="0.01" value={kitPrice} onChange={(e) => setKitPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="79.90" required />
                                        <InputField label="Tags (vírgula)" type="text" value={kitTags} onChange={(e) => setKitTags(e.target.value)} placeholder="drill, trap, melody" />
                                      </div>
                                      
                                      <div className="grid md:grid-cols-2 gap-6">
                                           <div>
                                               <label className="block text-xs font-bold text-green-600 mb-1 font-mono uppercase tracking-widest">
                                                   Samples (WAV/MP3) — {kitSampleFiles.length} selecionados
                                               </label>
                                               <label className="cursor-pointer border border-dashed border-purple-900/30 hover:border-purple-500/50 rounded-sm p-4 flex flex-col items-center justify-center text-center transition-all h-36 bg-black/40 hover:bg-purple-900/5">
                                                   <UploadCloud className="w-8 h-8 text-purple-500 opacity-70 mb-2" />
                                                   <span className="text-[10px] text-purple-700 font-mono uppercase">Selecionar Arquivos</span>
                                                   <input type="file" className="hidden" multiple accept="audio/*,.wav,.mp3,.aif,.aiff" onChange={(e) => { if (e.target.files) setKitSampleFiles(Array.from(e.target.files)); }} />
                                               </label>
                                               {kitSampleFiles.length > 0 && (
                                                   <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                                                       {kitSampleFiles.map((f, i) => (
                                                           <div key={i} className="flex items-center justify-between text-[10px] text-green-700 font-mono bg-green-900/10 px-2 py-1 rounded-sm">
                                                               <span className="truncate">{f.name}</span>
                                                               <span>{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                                                           </div>
                                                       ))}
                                                   </div>
                                               )}
                                       </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-green-600 mb-1 font-mono uppercase tracking-widest">
                                                    Artwork Automática
                                                </label>
                                                <KitArtworkGenerator 
                                                    title={kitTitle} 
                                                    sampleCount={kitSampleFiles.length}
                                                    onGenerated={(dataUrl) => setKitGeneratedArtwork(dataUrl)} 
                                                />
                                            </div>
                                            <FileInputField 
                                              label="Ou envie sua própria capa (400x400)" 
                                              id="kit-artwork-upload" 
                                              file={kitArtworkFile} 
                                              onChange={setKitArtworkFile} 
                                              accept="image/*"
                                              variant="default"
                                              isOptional={true}
                                              icon={<UploadCloud className="w-8 h-8 text-green-500" />} 
                                          />
                                        </div>
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
            {editingKit && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" aria-modal="true" role="dialog">
                    <div className="min-h-[100px] w-full max-w-2xl flex items-center justify-center py-8">
                    <Card className="p-8 w-full relative animate-fade-in-up bg-black border border-green-500/30 shadow-[0_0_30px_rgba(74,222,128,0.1)]">
                        <button onClick={() => setEditingKit(null)} className="absolute top-4 right-4 text-green-700 hover:text-green-400 transition-colors z-10">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-green-400 mb-6 font-mono uppercase tracking-widest">
                            {'[EDIT.KIT] >'} <span className="text-white">{editingKit.title}</span>
                        </h2>
                        <form onSubmit={handleEditKitSubmit} className="space-y-6">
                            <InputField label="Título" type="text" value={editKitForm.title} onChange={(e) => setEditKitForm(p => ({ ...p, title: e.target.value }))} required />
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField label="Preço (R$)" type="number" step="0.01" value={editKitForm.price} onChange={(e) => setEditKitForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} required />
                                <InputField label="Tags (vírgula)" type="text" value={editKitForm.tags} onChange={(e) => setEditKitForm(p => ({ ...p, tags: e.target.value }))} placeholder="drill, trap, melody" />
                            </div>
                            <InputField label="Descrição" as="textarea" rows={3} value={editKitForm.description} onChange={(e) => setEditKitForm(p => ({ ...p, description: e.target.value }))} />

                            {editingKit.samples && editingKit.samples.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-green-600 font-mono uppercase tracking-widest">
                                            SAMPLES ({editingKit.samples.length})
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleDetectCorrupted}
                                            disabled={checkingSamples}
                                            className="text-[10px] font-mono uppercase text-yellow-600 hover:text-yellow-400 transition-colors disabled:opacity-50"
                                        >
                                            {checkingSamples ? '⏳ Verificando...' : '🔍 Detectar Corrompidos'}
                                        </button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto space-y-1 border border-green-900/30 rounded-sm p-2 bg-black/40">
                                        {editingKit.samples.map(sample => {
                                            const isCorrupted = corruptedSamples.has(sample.id);
                                            return (
                                                <div key={sample.id} className={`flex items-center gap-2 text-sm font-mono py-1.5 px-2 rounded-sm transition-colors group ${isCorrupted ? 'bg-red-900/20 border border-red-500/30' : 'bg-green-900/10 hover:bg-green-900/20'}`}>
                                                    <MiniWaveform url={sample.file_url} isCorrupted={isCorrupted} />
                                                    <span className={`truncate flex-1 ${isCorrupted ? 'text-red-400 font-bold' : 'text-green-600'}`}>
                                                        {sample.file_name}
                                                    </span>
                                                    {isCorrupted && <AlertTriangleIcon className="w-3 h-3 text-red-500 flex-shrink-0" />}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteSample(sample.id, sample.file_name)}
                                                        className="text-green-800 hover:text-red-500 transition-colors opacity-50 group-hover:opacity-100 flex-shrink-0"
                                                        title="Excluir sample"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-3">
                                        <label className="cursor-pointer border border-dashed border-green-900/50 hover:border-green-500/50 rounded-sm p-3 flex items-center justify-center gap-2 text-center transition-all bg-black/40 hover:bg-green-900/5">
                                            <UploadCloud className="w-4 h-4 text-green-700" />
                                            <span className="text-[10px] text-green-700 font-mono uppercase">Adicionar samples (WAV/MP3)</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                accept="audio/*,.wav,.mp3,.aif,.aiff"
                                                onChange={(e) => { if (e.target.files) setEditKitNewFiles(Array.from(e.target.files)); }}
                                            />
                                        </label>
                                        {editKitNewFiles.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-[10px] text-green-600 font-mono">{editKitNewFiles.length} arquivo(s) selecionado(s)</p>
                                                <button
                                                    type="button"
                                                    onClick={handleEditKitUploadSamples}
                                                    disabled={editKitUploading}
                                                    className="bg-green-600 hover:bg-green-500 text-black font-bold font-mono text-[10px] uppercase tracking-widest py-1.5 px-4 rounded-sm transition-colors disabled:opacity-50"
                                                >
                                                    {editKitUploading ? 'ENVIANDO...' : `UPLOAD ${editKitNewFiles.length} ARQUIVO(S)`}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-4 border-t border-green-900/30">
                                <button type="button" onClick={() => setEditingKit(null)} className="bg-transparent hover:bg-green-900/20 border border-green-900 text-green-600 font-mono font-bold py-2 px-4 rounded-sm transition-colors uppercase text-xs">Cancelar</button>
                                <button type="submit" disabled={isEditingKitSaving} className="bg-green-600 hover:bg-green-500 text-black font-bold font-mono uppercase tracking-widest py-2 px-6 rounded-sm transition-colors disabled:opacity-50">
                                    {isEditingKitSaving ? '...' : 'SALVAR'}
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
