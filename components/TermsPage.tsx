
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from './icons';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-green-300 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-green-700 hover:text-green-400 font-mono text-xs uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar à Loja
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-green-400 font-mono uppercase tracking-widest mb-8">
          Termos de Serviço
        </h1>

        <div className="space-y-8 text-sm leading-relaxed font-mono text-green-300/80">
          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar o site beatsbyrmx.com ("Site"), você concorda com estes Termos de Serviço. Se não concordar com algum dos termos, não utilize o Site.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">2. Descrição do Serviço</h2>
            <p>O beatsbyrmx.com é uma loja online que vende beats musicais instrumentais e sound kits para artistas e produtores. Os produtos são distribuídos digitalmente após confirmação do pagamento.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">3. Conta do Usuário</h2>
            <p>Para realizar compras, você pode ser solicitado a fornecer informações de contato. Você é responsável por manter a confidencialidade de suas informações e por todas as atividades que ocorram em sua conta.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">4. Produtos e Licenciamento</h2>
            <p>Todos os beats e sound kits são vendidos sob licença. A compra não transfere propriedade intelectual. Os termos específicos de cada licença estão descritos no Contrato de Licença exibido no momento da seleção do produto.</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-green-300/60">
              <li>Licença Básica (MP3): uso limitado, arquivo com tag</li>
              <li>Licença Premium (WAV): uso comercial, sem tag</li>
              <li>Licença Stems: uso comercial ilimitado, arquivos separados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">5. Preços e Pagamento</h2>
            <p>Os preços estão indicados em Reais (R$). Aceitamos pagamento via cartão de crédito/débito (processado pela Stripe) e Pix/WhatsApp. Todos os preços incluem impostos quando aplicável.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">6. Política de Reembolso</h2>
            <p>Por se tratar de produto digital, <strong className="text-green-400">não oferecemos reembolso após o download do arquivo</strong>. Em caso de problemas técnicos com o download, entre em contato conosco para solução.</p>
            <p className="mt-2">Pagamentos via Stripe que ainda não foram processados podem ser cancelados. Entre em contato imediatamente caso deseje cancelar.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">7. Propriedade Intelectual</h2>
            <p>Todos os beats, sound kits e conteúdo do Site são de propriedade exclusiva do RMX. A compra de uma licença não concede direitos de propriedade sobre a composição musical. O comprador adquire apenas o direito de uso conforme os termos da licença.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">8. Conduta do Usuário</h2>
            <p>Ao utilizar o Site, você concorda em NÃO:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-green-300/60">
              <li>Revender, redistribuir ou compartilhar os arquivos adquiridos</li>
              <li>Registrar Content ID ou content match em plataformas de vídeo</li>
              <li>Remover ou ocultar os créditos do produtor</li>
              <li>Utilizar o conteúdo para fins ilegais ou que violem direitos de terceiros</li>
              <li>Realizar engenharia reversa ou tentar extrair os samples originais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">9. Limitação de Responsabilidade</h2>
            <p>O beatsbyrmx.com não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso dos produtos adquiridos. Nossa responsabilidade máxima será limitada ao valor pago pelo produto.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">10. Links de Terceiros</h2>
            <p>O Site pode conter links para sites de terceiros (redes sociais, plataformas de streaming). Não nos responsabilizamos pelo conteúdo ou práticas de privacidade desses sites.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">11. Modificações</h2>
            <p>Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação no Site. O uso continuado do Site após alterações constitui aceitação dos novos termos.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">12. Lei Aplicável e Foro</h2>
            <p>Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer questões.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">13. Contato</h2>
            <p>Em caso de dúvidas sobre estes Termos, entre em contato conosco pelo WhatsApp disponível no Site.</p>
          </section>

          <p className="text-green-800 text-xs mt-8 pt-4 border-t border-green-900/30">
            Última atualização: Julho 2026. beatsbyrmx.com — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
