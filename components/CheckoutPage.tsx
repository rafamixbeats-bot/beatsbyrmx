import React, { useState } from 'react';
import Card from './ContactSection';
import { CartItem, AdminSettings } from '../App';
import { ShoppingCart, ArrowDownToLine, DollarSign, Download } from './icons';

interface CheckoutPageProps {
    items: CartItem[];
    settings: AdminSettings;
    onConfirmPurchase: () => void;
    onBackToStore: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, settings, onConfirmPurchase, onBackToStore }) => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const [loading, setLoading] = useState(false);

    const handleStripeCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });
            const { sessionId } = await res.json();
            const stripe = await (window as any).loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
            await stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            alert('Erro ao processar pagamento. Tente novamente.');
            setLoading(false);
        }
    };

    const handleWhatsAppCheckout = () => {
        if (!settings.whatsappNumber) {
            alert('Erro: O número de WhatsApp não foi configurado no painel.');
            return;
        }
        const phone = settings.whatsappNumber.replace(/\D/g, '');
        let message = `*NOVO PEDIDO - RMX BEATS*\n\n`;
        message += `Olá! Gostaria de finalizar a compra:\n\n`;
        items.forEach(item => {
            message += `▪️ *${item.title}* (${item.description}) - R$ ${item.price.toFixed(2)}\n`;
        });
        message += `\n*TOTAL: R$ ${total.toFixed(2)}*`;
        message += `\n\nPor favor, me envie a chave Pix.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        onConfirmPurchase();
    };

    return (
        <div className="py-12 md:py-24 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Finalizar Compra</h1>
                <p className="mt-4 text-lg text-slate-400">Revise seu pedido e escolha a forma de pagamento.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-4">
                <Card className="p-8 h-fit border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <ShoppingCart className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-2xl font-bold text-slate-100">Resumo do Pedido</h2>
                    </div>
                    <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                        {items.length === 0 && <p className="text-slate-500">Seu carrinho está vazio.</p>}
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-start text-slate-300 border-b border-slate-800/50 pb-4 last:border-0">
                                <div>
                                    <p className="font-bold text-lg text-white">{item.title}</p>
                                    <p className="text-sm text-indigo-400">{item.description}</p>
                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{item.type === 'beat' ? 'Instrumental' : 'Sound Kit'}</p>
                                </div>
                                <span className="font-bold whitespace-nowrap text-slate-200">{`R$ ${item.price.toFixed(2)}`}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-700 pt-6 flex justify-between items-center">
                        <span className="text-xl font-bold text-slate-100">Total a Pagar</span>
                        <span className="text-3xl font-bold text-green-400">{`R$ ${total.toFixed(2)}`}</span>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-8 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                           <DollarSign className="w-6 h-6 text-indigo-400" /> Cartão de Crédito / Débito
                        </h2>
                        <p className="text-slate-300 mb-6">Pagamento internacional via Stripe. Aceita Visa, Mastercard e mais.</p>
                        <button
                            onClick={handleStripeCheckout}
                            disabled={items.length === 0 || loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                        >
                            {loading ? 'REDIRECIONANDO...' : 'PAGAR COM CARTÃO'}
                        </button>
                    </Card>

                    <Card className="p-8 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
                        <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                            <Download className="w-6 h-6 text-green-400" /> Pix / WhatsApp
                        </h2>
                        <p className="text-slate-300 mb-6">Pague via Pix e confirme pelo WhatsApp.</p>
                        {settings.pixKey && (
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Chave Pix</p>
                                <div className="flex items-center justify-between">
                                    <code className="text-green-400 font-mono text-lg">{settings.pixKey}</code>
                                    <button onClick={() => navigator.clipboard.writeText(settings.pixKey)} className="text-xs text-slate-400 hover:text-white underline">Copiar</button>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleWhatsAppCheckout}
                            disabled={items.length === 0}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                        >
                            <span>FINALIZAR NO WHATSAPP</span>
                            <ArrowDownToLine className="w-5 h-5 rotate-[-90deg]" />
                        </button>
                    </Card>

                    <button onClick={onBackToStore} className="w-full bg-transparent hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white font-bold py-3 rounded-lg transition-colors">
                        Continuar Comprando
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
