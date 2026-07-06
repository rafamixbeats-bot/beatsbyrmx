
import React, { useState, useEffect } from 'react';
import Card from './ContactSection';
import { ArrowDownToLine, X, YoutubeIcon, TiktokIcon, InstagramIcon, SpotifyIcon, CheckCircleIcon, TwitterIcon, Download } from './icons';
import { Beat, SocialLinks } from '../App';

interface DownloadGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    beat: Beat | null;
    socialLinks: SocialLinks;
}

type SocialStep = keyof SocialLinks;

const socialIconMap: Record<SocialStep, { label: string; icon: React.FC<{className?: string}> }> = {
    youtube: { label: 'SUBSCRIBE_YOUTUBE', icon: YoutubeIcon },
    tiktok: { label: 'FOLLOW_TIKTOK', icon: TiktokIcon },
    instagram: { label: 'FOLLOW_INSTAGRAM', icon: InstagramIcon },
    spotify: { label: 'FOLLOW_SPOTIFY', icon: SpotifyIcon },
    twitter: { label: 'FOLLOW_TWITTER', icon: TwitterIcon },
};

const DownloadGateModal: React.FC<DownloadGateModalProps> = ({ isOpen, onClose, beat, socialLinks }) => {
    const [completedSteps, setCompletedSteps] = useState<Record<SocialStep, boolean>>({
        youtube: false,
        tiktok: false,
        instagram: false,
        spotify: false,
        twitter: false,
    });
    
    // Filter out links that are not configured in the admin panel
    const availableSocialLinks = (Object.keys(socialLinks) as SocialStep[]).filter(key => socialLinks[key]);

    const allStepsCompleted = availableSocialLinks.every(key => completedSteps[key]);

    useEffect(() => {
        if (isOpen) {
            setCompletedSteps({ youtube: false, tiktok: false, instagram: false, spotify: false, twitter: false });
        }
    }, [isOpen]);

    if (!isOpen || !beat) {
        return null;
    }

    const handleStepClick = (step: SocialStep) => {
        setCompletedSteps(prev => ({ ...prev, [step]: true }));
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = beat.downloadUrl;
        link.setAttribute('download', `${beat.title} - ${beat.producer} (Tagged).mp3`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <Card className="p-8 w-full max-w-md relative animate-fade-in-up bg-black border border-green-500/30 shadow-[0_0_30px_rgba(74,222,128,0.1)]">
                {/* Tech Corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-green-700 hover:text-green-400 transition-colors z-10">
                    <X className="w-5 h-5" />
                    <span className="sr-only">Fechar modal</span>
                </button>
                
                <div className="flex items-center gap-3 mb-2 border-b border-green-900/30 pb-4">
                    <Download className="w-5 h-5 text-green-400" />
                    <div>
                        <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-widest">FREE_ACCESS</h2>
                        <p className="text-[10px] text-green-800 font-mono uppercase tracking-widest">DOWNLOAD_PROTOCOL_INITIATED</p>
                    </div>
                </div>
                
                <div className="my-6 bg-green-900/10 p-3 rounded-sm border border-green-900/30">
                    <p className="text-green-300 font-mono font-bold uppercase text-sm mb-1">TARGET: {beat.title}</p>
                    <p className="text-[10px] text-green-700 font-mono uppercase">FILE_TYPE: MP3 (TAGGED_DEMO)</p>
                </div>
                
                <p className="mb-6 text-green-600/80 text-xs font-mono uppercase tracking-wide">COMPLETE_ACTIONS_TO_UNLOCK:</p>
                
                <div className="space-y-3 mb-8">
                    {availableSocialLinks.map((key) => {
                        const socialInfo = socialIconMap[key];
                        if (!socialInfo) return null;
                        const { label, icon: Icon } = socialInfo;
                        const url = socialLinks[key];
                        return (
                             <a 
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleStepClick(key)}
                                className={`w-full flex items-center justify-between p-3 rounded-sm transition-all duration-300 group border ${
                                    completedSteps[key] 
                                    ? 'bg-green-500/10 border-green-500' 
                                    : 'bg-black border-green-900/30 hover:border-green-500/50 hover:bg-green-900/5'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${completedSteps[key] ? 'text-green-400' : 'text-green-800 group-hover:text-green-600'}`} />
                                    <span className={`font-mono text-xs uppercase tracking-wider font-bold ${completedSteps[key] ? 'text-green-400' : 'text-green-700 group-hover:text-green-500'}`}>{label}</span>
                                </div>
                                {completedSteps[key] && <CheckCircleIcon className="w-5 h-5 text-green-400" />}
                            </a>
                        )
                    })}
                </div>

                <button
                    onClick={handleDownload}
                    disabled={!allStepsCompleted}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-black font-bold font-mono uppercase tracking-widest py-4 px-6 rounded-sm transition-all duration-300 disabled:bg-green-900/10 disabled:text-green-900 disabled:border disabled:border-green-900/30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:shadow-none"
                >
                    {allStepsCompleted ? (
                        <>
                            <ArrowDownToLine className="w-5 h-5" />
                            <span>{'>> START_DOWNLOAD'}</span>
                        </>
                    ) : (
                        <span className="text-[10px]">AWAITING_VERIFICATION...</span>
                    )}
                </button>
            </Card>
        </div>
    );
};

export default DownloadGateModal;
