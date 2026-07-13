
import React from 'react';
import { Beat, Producer } from '../App';
import { Users } from './icons';

interface ProducersPageProps {
    producers: Producer[];
    beats: Beat[];
    onFilterByProducer: (producerName: string) => void;
}

const ProducersPage: React.FC<ProducersPageProps> = ({ producers, beats, onFilterByProducer }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <div className="text-center mb-16 border-b border-green-900/30 pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-sm mb-4 border border-green-500/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                    <Users className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-green-400 uppercase font-mono tracking-[0.2em] drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">PRODUCER</h1>
                <p className="mt-4 text-sm text-green-800 max-w-2xl mx-auto font-mono uppercase tracking-widest">
                    CORE SYSTEM OPERATOR.
                </p>
            </div>

            {/* Bio Section */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-black border border-green-900/30 rounded-sm p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500/50"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-green-500/50"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-green-500/50"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500/50"></div>

                    <h2 className="text-xl md:text-2xl font-bold text-green-400 font-mono uppercase tracking-widest mb-8 text-center">
                        Transformando ideias em músicas com identidade, emoção e qualidade profissional.
                    </h2>
                    
                    <div className="text-sm text-green-700 font-mono leading-relaxed mb-8">
                        <p>
                            Sou <span className="text-green-400 font-bold">Rafael Magalhães</span>, mais conhecido como <span className="text-green-400 font-bold">RMX</span> ou <span className="text-green-400 font-bold">Rafa Mix</span>. Sou do Rio de Janeiro, engenheiro de mixagem e masterização, e produzo música desde os 16 anos. Hoje, aos 33 anos, continuo estudando, evoluindo e buscando extrair o melhor de cada projeto que passa pelas minhas mãos.
                        </p>
                    </div>

                    <div className="my-8 rounded-sm overflow-hidden border border-green-900/30">
                        <img 
                            src="/studio-standing.png" 
                            alt="RMX no estúdio" 
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>

                    <div className="text-sm text-green-700 font-mono leading-relaxed mb-8">
                        <p>
                            Acredito que uma boa música vai muito além de uma boa produção. Cada artista tem uma história, uma identidade e uma mensagem que merecem ser respeitadas. Meu compromisso é entregar um trabalho com qualidade, transparência e dedicação, para que sua música represente exatamente quem você é.
                        </p>
                    </div>

                    <div className="my-8 rounded-sm overflow-hidden border border-green-900/30">
                        <img 
                            src="/studio-sitting.png" 
                            alt="RMX produzindo" 
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>

                    <div className="text-sm text-green-700 font-mono leading-relaxed mb-8">
                        <p>
                            A música sempre foi o meu maior propósito. Meu sonho é viver dela, e acredito que o seu também seja transformar sua arte em algo cada vez maior. É por isso que vejo cada projeto como uma parceria, não apenas como um serviço.
                        </p>
                    </div>

                    <div className="text-sm text-green-700 font-mono leading-relaxed mb-8">
                        <p>
                            Se você chegou até aqui, talvez estejamos buscando a mesma coisa: criar músicas que conectem pessoas, despertem emoções e deixem uma marca. Será um prazer fazer parte da sua jornada e contribuir para que sua música alcance o resultado que você sempre imaginou.
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-green-900/30 text-center">
                        <blockquote className="text-green-400 font-mono text-sm italic">
                            "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos."
                        </blockquote>
                        <p className="text-green-700 font-mono text-xs mt-2 uppercase tracking-widest">
                            Provérbios 16:3
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProducersPage;
