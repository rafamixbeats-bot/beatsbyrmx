

import React from 'react';
import Card from './ContactSection';
import { X, FileText } from './icons';
import { Beat, LicenseOption } from '../App';

interface LicenseAgreementModalProps {
    beat: Beat;
    license: LicenseOption;
    onClose: () => void;
}

const getContractText = (beat: Beat, license: LicenseOption): string => {
    const producerName = beat.producer || "RMX";
    const beatTitle = beat.title;

    const commonClauses = `
Este Contrato de Licença Não-Exclusiva ("Contrato") é celebrado entre ${producerName} ("Licenciante") e você ("Licenciado"). Ao comprar esta licença, você aceita os seguintes termos e condições:

**1. Concessão de Direitos:** O Licenciante concede ao Licenciado uma licença não-exclusiva para usar o beat intitulado "${beatTitle}" na produção de uma (1) nova gravação musical ("Master").

**2. Crédito:** O Licenciado deve creditar o Licenciante em todas as formas de mídia, da seguinte forma: "Produzido por ${producerName}".

**3. Propriedade:** O Licenciante retém 100% dos direitos autorais e de propriedade da composição original do beat. O Licenciado não pode registrar direitos autorais sobre o beat.

**4. Proibições:** O Licenciado não pode revender, licenciar, emprestar ou transferir o beat original para terceiros. O Licenciado não pode usar o beat em mais de uma (1) gravação Master.

**5. Lei Aplicável:** Este Contrato será regido pelas leis do Brasil.
    `;

    switch (license.type) {
        case 'mp3':
            return `**TERMOS DA LICENÇA BÁSICA (MP3)**\n${commonClauses}\n**6. Uso e Distribuição:**\n- O Licenciado pode usar a Master para fins não-comerciais e promocionais (Mixtapes, SoundCloud, YouTube sem monetização).\n- Permite a distribuição de até 2.000 cópias ou 100.000 streams de áudio/vídeo.\n- O arquivo fornecido é um MP3 com uma tag de áudio do produtor.`;
        case 'wav':
            return `**TERMOS DA LICENÇA PREMIUM (WAV)**\n${commonClauses}\n**6. Uso e Distribuição:**\n- O Licenciado pode usar a Master para fins comerciais (venda em plataformas como iTunes, Spotify, Apple Music).\n- Permite a distribuição de até 10.000 cópias ou 500.000 streams de áudio/vídeo.\n- Permite apresentações ao vivo pagas.\n- O arquivo fornecido é um WAV de alta qualidade e sem tags de áudio.`;
        case 'stems':
            return `**TERMOS DA LICENÇA TRACKOUT (STEMS)**\n${commonClauses}\n**6. Uso e Distribuição:**\n- O Licenciado pode usar a Master para fins comerciais ilimitados.\n- Permite distribuição e streams de áudio/vídeo ilimitados.\n- Permite apresentações ao vivo pagas e transmissão em rádio.\n- Os arquivos fornecidos são os Stems individuais do beat (WAV), permitindo mixagem e arranjo avançados. Os arquivos são entregues sem tags de áudio.`;
        default:
            return "Termos de licença não disponíveis.";
    }
};


const LicenseAgreementModal: React.FC<LicenseAgreementModalProps> = ({ beat, license, onClose }) => {
    const contractText = getContractText(beat, license);

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4" 
            onClick={onClose}
            aria-modal="true" 
            role="dialog"
        >
            <Card className="p-8 w-full max-w-2xl relative animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors"
                    aria-label="Fechar"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                    <FileText className="w-6 h-6 text-indigo-400" />
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Termos de Licenciamento</h2>
                        <p className="text-slate-400">"{beat.title}" - {license.name}</p>
                    </div>
                </div>
                
                <div className="prose prose-sm prose-invert text-slate-300 overflow-y-auto pr-4 -mr-4 flex-grow">
                     <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {contractText}
                    </pre>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700 flex-shrink-0">
                    <button 
                        onClick={onClose}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
                    >
                        Entendi
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default LicenseAgreementModal;