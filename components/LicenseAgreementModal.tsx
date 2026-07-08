
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
    const price = license.price.toFixed(2);
    const date = new Date().toLocaleDateString('pt-BR');

    const commonClauses = `
CONTRATO DE LICENÇA NÃO-EXCLUSIVA DE BEAT MUSICAL

Data: ${date}

Entre:

LICENCIANTE: ${producerName} ("Producer")
LICENCIADO: O adquirente desta licença ("Artista")

Objeto: Beat musical intitulado "${beatTitle}"
Tipo de Licença: ${license.name}
Valor Pago: R$ ${price}

---

CLÁUSULA 1 - CONCESSÃO DE DIREITOS

1.1. O Licenciante concede ao Licenciado uma licença NÃO-EXCLUSIVA para utilizar o beat musical descrito acima na produção de UMA (1) nova gravação musical ("Master").

1.2. Esta licença não garante exclusividade. O Licenciante pode vender licenças do mesmo beat para outros artistas.

1.3. O Licenciado não adquire propriedade sobre o beat. A propriedade intelectual permanece integralmente com o Licenciante.

---

CLÁUSULA 2 - CRÉDITO OBRIGATÓRIO

2.1. O Licenciado É OBRIGADO a creditar o Licenciante em TODA gravação, publicação e distribuição da Master, da seguinte forma:

"Prod. by ${producerName}"

2.2. O crédito deve aparecer:
- Na descrição de todas as plataformas de streaming (Spotify, Apple Music, Deezer, etc.)
- Na descrição do YouTube e SoundCloud
- Em quaisquer materiais promocionais da música

2.3. A ausência de crédito configura quebra de contrato.

---

CLÁUSULA 3 - PROPRIEDADE INTELECTUAL

3.1. O Licenciante retém 100% dos direitos autorais e de propriedade intelectual sobre a composição musical do beat.

3.2. O Licenciado NÃO PODE:
- Registrar a composição em sociedades de direitos autorais (ECAD, ASCAP, BMI, SESAC, SACEM, etc.) como autor ou compositor
- Registrar Content ID no YouTube ou qualquer plataforma de Content Match
- Declarar-se autor ou compositor do beat em qualquer contexto

3.3. O Licenciado é responsável por coletar seus próprios direitos de execução fonográfica (neighboring rights) sobre a Master, NÃO sobre a composição.

---

CLÁUSULA 4 - PROIBIÇÕES EXPRESSAS

4.1. O Licenciado NÃO PODE:
a) Revender, sub-licenciar, emprestar ou transferir o beat original a terceiros
b) Usar o beat em mais de UMA (1) gravação Master
c) Remover ou ocultar os créditos do produtor
d) Usar o beat em templates, sample packs, banks de sons ou produtos derivados
e) Enviar o beat para plataformas de distribuição como se fosse próprio
f) Modificar o beat para criar um novo instrumental e revendê-lo

4.2. A violação de qualquer proibição acima resulta na rescisão imediata desta licença.

---

CLÁUSULA 5 - LIMITES DE USO POR TIPO DE LICENÇA

5.1. LICENÇA BÁSICA (MP3):
- Uso: Não-comercial e promocional
- Cópias permitidas: até 2.000
- Streams de áudio/vídeo: até 100.000
- Entrega: MP3 com tag de áudio do produtor
- Não permite vendas comerciais em plataformas digitais

5.2. LICENÇA PREMIUM (WAV):
- Uso: Comercial
- Cópias permitidas: até 10.000
- Streams de áudio/vídeo: até 500.000
- Permite apresentações ao vivo pagas
- Entrega: WAV de alta qualidade, sem tags

5.3. LICENÇA TRACKOUT (STEMS):
- Uso: Comercial ilimitado
- Cópias e streams: Ilimitados
- Permite transmissão em rádio, TV, cinema e jogos
- Entrega: Stems individuais (WAV), sem tags
- Permite mixagem e arranjo avançados

5.4. Ao atingir os limites da licença, o Licenciado deve:
a) Deixar de distribuir/promover a Master, OU
b) Adquirir uma licença de tier superior, OU
c) Negociar uma licença exclusiva com o Licenciante

---

CLÁUSULA 6 - DIVISÃO DE PUBLISHING

6.1. Os direitos autorais da composição musical (publishing) são divididos da seguinte forma:
- Licenciante (Producer): 50%
- Licenciado (Artista): 50%

6.2. Cada parte é responsável por coletar sua fração de publishing junto à sua sociedade de direitos autorais (ECAD no Brasil, ou equivalente internacional).

6.3. O Licenciado NÃO PODE registrar 100% da composição em seu nome. O registro deve refletir a divisão 50/50 acima.

6.4. Esta cláusula aplica-se a todas as licenças (Básica, Premium e Stems).

---

CLÁUSULA 7 - PRAZO E TERRITÓRIO

7.1. Esta licença é VITALÍCIA, vigorando enquanto os limites de uso da Cláusula 5 não forem excedidos.

7.2. O território é MUNDIAL. Esta licença vale em todos os países.

7.3. O Licenciante pode, a seu critério, revogar esta licença em caso de violação dos termos.

---

CLÁUSULA 8 - RESCISÃO

8.1. Esta licença pode ser rescindida por:
a) Quebra de qualquer cláusula por qualquer das partes
b) Notificação escrita com 30 dias de antecedência (exceto em casos de violação grave)

8.2. Em caso de rescisão, o Licenciado deve:
a) Cessar imediatamente toda distribuição e promoção da Master
b) Remover a Master de todas as plataformas em até 30 dias
c) Não utilizar o beat em novos projetos

8.3. A rescisão não gera direito a reembolso do valor pago.

---

CLÁUSULA 9 - GARANTIAS

9.1. O Licenciante garante que:
a) É autor original do beat musical
b) O beat não infringe direitos autorais de terceiros
c) Tem pleno direito de conceder esta licença

9.2. O beat é fornecido "COMO ESTÁ" (as is), sem garantias adicionais além da originalidade.

9.3. O Licenciante não se responsabiliza por eventuais reclamações de terceiros referentes ao uso que o Licenciado faça da Master (ex: samples de terceiros adicionados pelo Licenciado).

---

CLÁUSULA 10 - LIMITAÇÃO DE RESPONSABILIDADE

10.1. Em nenhuma circunstância o Licenciante será responsável por danos indiretos, lucros cessantes, ou perdas decorrentes do uso ou impossibilidade de uso do beat.

10.2. A responsabilidade máxima do Licenciante será limitada ao valor efetivamente pago pelo Licenciado pela licença.

---

CLÁUSULA 11 - DISPOSIÇÕES GERAIS

11.1. Este Contrato constitui o acordo completo entre as partes e substitui todos os acordos anteriores.

11.2. Qualquer modificação deste Contrato deve ser feita por escrito e assinada por ambas as partes.

11.3. A tolerância de qualquer das partes quanto ao descumprimento de cláusulas não configurará renúncia aos direitos.

11.4. Se qualquer cláusula for considerada inválida, as demais permanecerão em pleno vigor.

11.5. Este Contrato é regido pelas leis da República Federativa do Brasil.

11.6. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer questões oriundas deste Contrato.

---

Ao comprar esta licença, o Licenciado declara que leu, compreendeu e aceita TODOS os termos e condições deste Contrato.
    `;

    return commonClauses;
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
                    <FileText className="w-6 h-6 text-green-400" />
                    <div>
                        <h2 className="text-2xl font-bold text-green-400 font-mono uppercase tracking-widest">Contrato de Licença</h2>
                        <p className="text-green-700 text-xs font-mono uppercase">"{beat.title}" — {license.name}</p>
                    </div>
                </div>
                
                <div className="overflow-y-auto pr-4 -mr-4 flex-grow border border-green-900/30 rounded-sm bg-black/50 p-4">
                     <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-green-300">
                        {contractText}
                    </pre>
                </div>

                <div className="mt-6 pt-4 border-t border-green-900/30 flex-shrink-0">
                    <button 
                        onClick={onClose}
                        className="w-full bg-green-700 hover:bg-green-500 text-black font-bold font-mono uppercase text-xs py-3 px-4 rounded-sm transition-colors tracking-widest"
                    >
                        Fechar
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default LicenseAgreementModal;
