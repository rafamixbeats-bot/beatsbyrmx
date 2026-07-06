

import React from 'react';
import Card from './ContactSection';

const AboutPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Sobre RMX Beats</h1>
                <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                    Sua fonte #1 para beats de alta qualidade.
                </p>
            </div>
            <div className="max-w-4xl mx-auto">
                <Card className="p-8">
                    <div className="prose prose-invert prose-lg text-slate-300 mx-auto space-y-6">
                        <p>
                            Bem-vindo à RMX Beats, o lugar definitivo para artistas e criadores de conteúdo encontrarem a batida perfeita para o seu próximo sucesso. Fundada com a paixão pela música e um compromisso com a qualidade, nossa missão é fornecer instrumentais que não apenas soem incríveis, mas também inspirem a criatividade.
                        </p>
                        <p>
                            Nossa biblioteca de beats abrange uma vasta gama de gêneros, do Trap ao R&B, do Boom Bap ao Lo-Fi. Cada beat é produzido com atenção meticulosa aos detalhes, garantindo uma qualidade de som profissional que se destacará em qualquer projeto.
                        </p>
                        <p>
                            Acreditamos que a música de qualidade deve ser acessível a todos. É por isso que oferecemos várias opções de licenciamento, desde leases de MP3 para projetos independentes até licenças exclusivas para artistas que buscam total controle sobre sua música.
                        </p>
                        <p>
                            Obrigado por escolher RMX Beats. Vamos fazer história juntos.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AboutPage;