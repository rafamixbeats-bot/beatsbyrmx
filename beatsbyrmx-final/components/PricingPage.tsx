
import React from 'react';
import Card from './ContactSection';
import { CheckCircleIcon, X, DollarSign, CrownIcon, BookOpen, AlertTriangleIcon } from './icons';

interface PlanFeature {
    text: string;
    included: boolean;
}

interface LicensePlan {
    name: string;
    priceTier: string;
    description: string;
    features: PlanFeature[];
    isPopular?: boolean;
}

const plans: LicensePlan[] = [
    {
        name: 'LICENSE_BASIC',
        priceTier: 'MP3',
        description: 'USO NÃO-COMERCIAL / DEMOS.',
        features: [
            { text: 'ARQUIVO MP3 (320KBPS)', included: true },
            { text: '1 VIDEOCLIPE', included: true },
            { text: '500.000 STREAMS', included: true },
            { text: 'MONETIZAÇÃO YOUTUBE', included: true },
            { text: 'ARQUIVO WAV', included: false },
            { text: 'TRACKOUT STEMS', included: false },
            { text: 'DIREITOS EXCLUSIVOS', included: false },
        ]
    },
    {
        name: 'LICENSE_PREMIUM',
        priceTier: 'WAV',
        description: 'ALTA FIDELIDADE PARA ARTISTAS.',
        isPopular: true,
        features: [
            { text: 'MP3 + WAV (HQ)', included: true },
            { text: '1 VIDEOCLIPE', included: true },
            { text: 'STREAMS ILIMITADOS', included: true },
            { text: 'MONETIZAÇÃO COMPLETA', included: true },
            { text: 'TRANSMISSÃO RÁDIO', included: true },
            { text: 'TRACKOUT STEMS', included: false },
            { text: 'DIREITOS EXCLUSIVOS', included: false },
        ]
    },
    {
        name: 'LICENSE_PRO',
        priceTier: 'STEMS',
        description: 'CONTROLE TOTAL DE MIXAGEM.',
        features: [
            { text: 'MP3 + WAV + STEMS', included: true },
            { text: 'VIDEOS ILIMITADOS', included: true },
            { text: 'STREAMS ILIMITADOS', included: true },
            { text: 'MONETIZAÇÃO COMPLETA', included: true },
            { text: 'USO TV/FILME/JOGOS', included: true },
            { text: 'TODOS OS ARQUIVOS SEPARADOS', included: true },
            { text: 'DIREITOS EXCLUSIVOS', included: false },
        ]
    }
];

const PlanCard: React.FC<{ plan: LicensePlan }> = ({ plan }) => (
    <Card className={`flex flex-col p-8 transition-all duration-300 relative rounded-sm bg-black border ${plan.isPopular ? 'border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.15)] -translate-y-2' : 'border-green-900/40 hover:border-green-600'}`}>
        {plan.isPopular && (
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 bg-green-500 text-black text-[10px] font-bold px-4 py-1 font-mono uppercase tracking-widest border border-green-400">
                    <CrownIcon className="w-3 h-3" />
                    RECOMMENDED
                </div>
            </div>
        )}
        <div className="border-b border-green-900/30 pb-4 mb-6">
            <h3 className="text-xl font-bold text-green-400 mb-1 font-mono uppercase tracking-widest">{plan.name}</h3>
            <p className="text-sm text-green-600 font-mono uppercase font-bold tracking-wide">{plan.priceTier}</p>
        </div>
        
        <p className="text-xs text-green-800 font-mono uppercase tracking-widest mb-8 flex-grow">{plan.description}</p>
        
        <ul className="space-y-3 mb-8">
            {plan.features.map(feature => (
                <li key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                        <div className="w-4 h-4 flex items-center justify-center border border-green-500/50 rounded-sm">
                            <CheckCircleIcon className="w-3 h-3 text-green-400" />
                        </div>
                    ) : (
                        <div className="w-4 h-4 flex items-center justify-center border border-green-900/30 rounded-sm">
                            <X className="w-3 h-3 text-green-900" />
                        </div>
                    )}
                    <span className={`text-[10px] font-mono uppercase tracking-wide ${feature.included ? 'text-green-300' : 'text-green-900 decoration-green-900/50 line-through'}`}>{feature.text}</span>
                </li>
            ))}
        </ul>
        <button className={`mt-auto w-full font-bold font-mono uppercase tracking-widest py-3 px-6 rounded-sm transition-all border ${plan.isPopular ? 'bg-green-600 hover:bg-green-500 text-black border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]' : 'bg-black hover:bg-green-900/20 text-green-500 border-green-800 hover:border-green-500'}`}>
            SELECT_PLAN
        </button>
        
        {/* Tech Decor */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-green-500/50 rounded-full"></div>
        <div className="absolute top-2 right-2 w-1 h-1 bg-green-500/50 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-green-500/50 rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-1 h-1 bg-green-500/50 rounded-full"></div>
    </Card>
);

const LicensingTerms: React.FC = () => (
    <Card className="mt-20 p-8 md:p-10 bg-black/80 backdrop-blur-xl border border-green-900/40 rounded-sm relative overflow-hidden">
        {/* Scanner line effect */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-green-500/20 animate-pulse"></div>

        <div className="flex items-center gap-3 mb-8 border-b border-green-900/30 pb-4">
            <BookOpen className="w-5 h-5 text-green-400"/>
            <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-widest">TERMS_AND_CONDITIONS.DOC</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
                <h3 className="font-bold text-sm text-green-500 mb-4 font-mono uppercase tracking-wider">[ BASIC_LICENSE_MP3 ]</h3>
                <ul className="space-y-2 text-green-800 text-xs font-mono uppercase tracking-wide">
                    <li>• USO NÃO-COMERCIAL APENAS</li>
                    <li>• LIMITE DE 10.000 PLAYS</li>
                    <li>• ARQUIVO MP3 (TAGGED)</li>
                    <li>• CRÉDITO OBRIGATÓRIO</li>
                </ul>
            </div>
             <div>
                <h3 className="font-bold text-sm text-green-500 mb-4 font-mono uppercase tracking-wider">[ PREMIUM_LICENSE_WAV ]</h3>
                <ul className="space-y-2 text-green-800 text-xs font-mono uppercase tracking-wide">
                    <li>• USO COMERCIAL LIBERADO</li>
                    <li>• STREAMS ILIMITADOS</li>
                    <li>• ARQUIVO WAV + MP3 (UNTAGGED)</li>
                    <li>• SEM TAG DE VOZ</li>
                </ul>
            </div>
        </div>

        <div className="border-t border-green-900/30 pt-8">
             <h3 className="font-bold text-sm text-green-400 mb-6 text-center font-mono uppercase tracking-widest">PERMISSIONS_MATRIX</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="bg-green-900/5 p-4 rounded-sm border border-green-900/20">
                     <div className="flex items-center gap-2 mb-4">
                        <CheckCircleIcon className="w-4 h-4 text-green-500"/>
                        <h4 className="font-bold text-green-400 text-xs font-mono uppercase">ALLOWED_ACTIONS</h4>
                    </div>
                     <ul className="space-y-2 text-green-700 text-[10px] font-mono uppercase tracking-widest list-disc list-inside">
                        <li>DISTRIBUIÇÃO DIGITAL</li>
                        <li>PLATAFORMAS DE STREAMING</li>
                        <li>SHOWS AO VIVO</li>
                        <li>VIDEOCLIPES</li>
                    </ul>
                 </div>
                  <div className="bg-red-900/5 p-4 rounded-sm border border-red-900/20">
                     <div className="flex items-center gap-2 mb-4">
                        <X className="w-4 h-4 text-red-500"/>
                        <h4 className="font-bold text-red-400 text-xs font-mono uppercase">FORBIDDEN_ACTIONS</h4>
                    </div>
                     <ul className="space-y-2 text-red-800/80 text-[10px] font-mono uppercase tracking-widest list-disc list-inside">
                        <li>REVENDA DO INSTRUMENTAL</li>
                        <li>REGISTRO CONTENT ID</li>
                        <li>REMOÇÃO DE CRÉDITOS</li>
                        <li>TRANSFERÊNCIA DE LICENÇA</li>
                    </ul>
                 </div>
             </div>
        </div>

        <div className="mt-8 pt-4 border-t border-green-900/30 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] text-green-800 font-mono uppercase tracking-widest">
                <AlertTriangleIcon className="w-3 h-3" />
                <span>NOTA: TODAS AS LICENÇAS SÃO NÃO-EXCLUSIVAS POR PADRÃO.</span>
            </div>
        </div>
    </Card>
);

const PricingPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 font-mono">
            <div className="text-center mb-16 border-b border-green-900/30 pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-sm mb-4 border border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                    <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-green-400 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                    LICENSING_PLANS
                </h1>
                <p className="mt-4 text-sm text-green-800 max-w-2xl mx-auto uppercase tracking-widest">
                    SELECIONE O NÍVEL DE ACESSO AO SISTEMA DE ÁUDIO.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                {plans.map(plan => <PlanCard key={plan.name} plan={plan} />)}
            </div>

            <div className="max-w-4xl mx-auto">
                <LicensingTerms />

                <Card className="mt-10 p-8 text-center bg-black border border-green-900/40 rounded-sm">
                     <h2 className="text-xl font-bold text-green-400 mb-4 font-mono uppercase tracking-widest">EXCLUSIVE_RIGHTS_REQUEST</h2>
                     <p className="text-green-800 text-xs font-mono uppercase tracking-wide mb-6">
                        PARA AQUISIÇÃO TOTAL E REMOÇÃO DO BEAT DA LOJA, INICIE O PROTOCOLO DE NEGOCIAÇÃO DIRETA.
                     </p>
                     <button className="bg-transparent hover:bg-green-900/20 text-green-500 font-bold font-mono uppercase tracking-widest py-3 px-6 border border-green-700 hover:border-green-400 rounded-sm transition-all shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                         {">> INICIAR CONTATO"}
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default PricingPage;
