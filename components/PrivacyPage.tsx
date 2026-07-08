
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from './icons';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-green-300 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-green-700 hover:text-green-400 font-mono text-xs uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar à Loja
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-green-400 font-mono uppercase tracking-widest mb-8">
          Política de Privacidade
        </h1>

        <div className="space-y-8 text-sm leading-relaxed font-mono text-green-300/80">
          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">1. Informações que Coletamos</h2>
            <p>Para processar suas compras e fornecer nosso serviço, coletamos as seguintes informações:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-green-300/60">
              <li>Nome e e-mail (fornecidos no momento da compra ou contato via WhatsApp)</li>
              <li>Informações de pagamento (processadas pela Stripe — não armazenamos dados de cartão)</li>
              <li>Dados de uso do site (páginas visitadas, tempo de permanência)</li>
              <li>Endereço IP e informações do navegador</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">2. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-green-300/60">
              <li>Processar e entregar seus pedidos</li>
              <li>Enviar confirmações de compra e links de download</li>
              <li>Responder a suas mensagens e suporte</li>
              <li>Melhorar nosso site e serviços</li>
              <li>Prevenir fraudos e garantir segurança</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">3. Pagamentos (Stripe)</h2>
            <p>Os pagamentos com cartão de crédito/débito são processados pela <strong className="text-green-400">Stripe</strong>, um processador de pagamentos líder mundial. Nós <strong className="text-green-400">NÃO armazenamos</strong> dados de cartão de crédito em nossos servidores.</p>
            <p className="mt-2">A Stripe utiliza criptografia de nível bancário para proteger suas informações. Para mais detalhes, consulte a <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-400 underline">Política de Privacidade da Stripe</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">4. Cookies e Rastreamento</h2>
            <p>O beatsbyrmx.com utiliza cookies para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-green-300/60">
              <li>Manter sua sessão ativa durante a navegação</li>
              <li>Lembrar itens no seu carrinho de compras</li>
              <li>Analytics (Google Analytics ou similar) para entender como o site é utilizado</li>
            </ul>
            <p className="mt-2">Você pode desativar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">5. Compartilhamento de Dados</h2>
            <p>Não vendemos ou alugamos suas informações pessoais a terceiros. Compartilhamos dados apenas com:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-green-300/60">
              <li><strong className="text-green-300">Stripe</strong> — para processamento de pagamentos</li>
              <li><strong className="text-green-300">Supabase</strong> — para armazenamento de dados do banco</li>
              <li><strong className="text-green-300">Vercel</strong> — para hospedagem do site</li>
              <li>Autoridades legais — quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">6. Segurança dos Dados</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-green-300/60">
              <li>Conexões criptografadas (HTTPS/SSL)</li>
              <li>Acesso restrito a dados pessoais</li>
              <li>Monitoramento regular de segurança</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">7. Retenção de Dados</h2>
            <p>Mantemos seus dados pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais. Dados de compra são mantidos por no mínimo 5 anos conforme exigido pela legislação fiscal brasileira.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">8. Seus Direitos (LGPD)</h2>
            <p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-green-300/60">
              <li><strong className="text-green-300">Acesso</strong> — saber quais dados seus temos</li>
              <li><strong className="text-green-300">Correção</strong> — corrigir dados incompletos ou desatualizados</li>
              <li><strong className="text-green-300">Exclusão</strong> — solicitar a remoção de seus dados</li>
              <li><strong className="text-green-300">Portabilidade</strong> — receber seus dados em formato estruturado</li>
              <li><strong className="text-green-300">Revogação</strong> — revogar o consentimento a qualquer momento</li>
            </ul>
            <p className="mt-2">Para exercer seus direitos, entre em contato conosco pelo WhatsApp disponível no Site.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">9. Menores de Idade</h2>
            <p>Nosso serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações de menores de idade. Se descobrirmos que coletamos dados de um menor, tomaremos providências imediatas para excluí-los.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">10. Alterações nesta Política</h2>
            <p>Podemos atualizar esta Política de Privacidade periodicamente. As alterações serão publicadas nesta página com a data da última atualização. Recomendamos que revise esta política regularmente.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-400 mb-3 uppercase tracking-wide">11. Contato</h2>
            <p>Em caso de dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-green-300/60">
              <li>WhatsApp: disponível no Site</li>
              <li>Site: beatsbyrmx.com</li>
            </ul>
          </section>

          <p className="text-green-800 text-xs mt-8 pt-4 border-t border-green-900/30">
            Última atualização: Julho 2026. beatsbyrmx.com — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
