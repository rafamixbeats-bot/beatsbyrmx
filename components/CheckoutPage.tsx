import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from './ContactSection';
import { CartItem, AdminSettings } from '../App';
import { ShoppingCart, ArrowDownToLine, DollarSign, Download, CheckCircle, Copy, Clock, QrCode } from './icons';
import { supabase } from '../supabaseClient';

interface CheckoutPageProps {
    items: CartItem[];
    settings: AdminSettings;
    onConfirmPurchase: () => void;
    onBackToStore: () => void;
}

type CheckoutStep = 'summary' | 'pix_qr' | 'pix_paid' | 'pix_expired';

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, settings, onConfirmPurchase, onBackToStore }) => {
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [step, setStep] = useState<CheckoutStep>('summary');
    const [pixData, setPixData] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800);
    const [pixError, setPixError] = useState('');
    const pollRef = useRef<any>(null);
    const timerRef = useRef<any>(null);

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;

    const handleApplyCoupon = async () => {
        setCouponError('');
        setCouponSuccess('');
        if (!couponCode) return;
        const { data } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('active', true).single();
        if (data) {
            setDiscount(data.discount_percent);
            setCouponSuccess(`Cupom aplicado! ${data.discount_percent}% de desconto`);
        } else {
            setDiscount(0);
            setCouponError('Cupom inválido ou expirado');
        }
    };

    const handleStripeCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('URL de checkout não retornada: ' + JSON.stringify(data));
            }
        } catch (error: any) {
            console.error('Stripe error:', error);
            alert('Erro ao processar pagamento: ' + error.message);
            setLoading(false);
        }
    };

    const handlePixCheckout = async () => {
        setLoading(true);
        setPixError('');
        try {
            const res = await fetch('/api/create-mp-pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, total }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Erro ao criar pagamento Pix');
            }
            setPixData(data);
            setStep('pix_qr');
            setTimeLeft(1800);
            startPolling(data.id);
            startTimer();
        } catch (error: any) {
            console.error('Pix error:', error);
            setPixError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = useCallback((orderId: string) => {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/check-mp-status?id=${orderId}`);
                const data = await res.json();
                if (data.payment_status === 'approved' || data.status === 'closed') {
                    clearInterval(pollRef.current);
                    clearInterval(timerRef.current);
                    setStep('pix_paid');
                    onConfirmPurchase();
                } else if (data.payment_status === 'cancelled' || data.payment_status === 'refunded') {
                    clearInterval(pollRef.current);
                    clearInterval(timerRef.current);
                    setStep('pix_expired');
                }
            } catch (err) {
                console.error('Poll error:', err);
            }
        }, 5000);
    }, [onConfirmPurchase]);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    if (pollRef.current) clearInterval(pollRef.current);
                    setStep('pix_expired');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const copyPixCode = () => {
        if (pixData?.qr_code) {
            navigator.clipboard.writeText(pixData.qr_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    return (
        <div className="py-12 md:py-24 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
                    {step === 'pix_paid' ? 'Pagamento Confirmado!' : 'Finalizar Compra'}
                </h1>
                <p className="mt-4 text-lg text-slate-400">
                    {step === 'pix_qr' ? 'Escaneie o QR Code ou copie o código Pix' :
                     step === 'pix_paid' ? 'Seu pagamento foi processado com sucesso.' :
                     step === 'pix_expired' ? 'O código Pix expirou. Gere um novo.' :
                     'Revise seu pedido e escolha a forma de pagamento.'}
                </p>
            </div>

            {step === 'pix_paid' ? (
                <div className="max-w-lg mx-auto px-4 text-center">
                    <Card className="p-12 border-green-500/30 bg-gradient-to-br from-green-900/20 to-black">
                        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono uppercase">Pagamento Aprovado</h2>
                        <p className="text-slate-400 mb-8">Seus beats já estão disponíveis para download na sua conta.</p>
                        <button onClick={onBackToStore} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg transition-all">
                            VOLTAR À LOJA
                        </button>
                    </Card>
                </div>
            ) : step === 'pix_expired' ? (
                <div className="max-w-lg mx-auto px-4 text-center">
                    <Card className="p-12 border-red-500/30 bg-gradient-to-br from-red-900/20 to-black">
                        <Clock className="w-20 h-20 text-red-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-red-400 mb-4 font-mono uppercase">Código Expirado</h2>
                        <p className="text-slate-400 mb-8">O código Pix expirou. Gere um novo para continuar.</p>
                        <div className="flex gap-4">
                            <button onClick={onBackToStore} className="flex-1 bg-transparent border border-slate-700 text-slate-400 hover:text-white font-bold py-3 rounded-lg transition-colors">
                                VOLTAR
                            </button>
                            <button onClick={() => { setStep('summary'); setPixData(null); }} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors">
                                GERAR NOVO
                            </button>
                        </div>
                    </Card>
                </div>
            ) : step === 'pix_qr' && pixData ? (
                <div className="max-w-lg mx-auto px-4">
                    <Card className="p-8 border-green-500/30 bg-gradient-to-br from-green-900/10 to-black">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-500/30 rounded-full px-4 py-2 mb-4">
                                <Clock className="w-4 h-4 text-green-400" />
                                <span className="font-mono text-green-400 text-sm font-bold">Expira em {formatTime(timeLeft)}</span>
                            </div>
                            <p className="text-slate-400 text-sm">Pague <span className="text-green-400 font-bold">R$ {total.toFixed(2)}</span> via Pix</p>
                        </div>

                        {pixData.qr_code_base64 && (
                            <div className="flex justify-center mb-6">
                                <div className="bg-white p-4 rounded-lg">
                                    <img src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Code Pix" className="w-56 h-56" />
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <p className="text-xs text-slate-500 font-mono uppercase mb-2 text-center">Pix Copia e Cola</p>
                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-2">
                                <p className="text-xs text-slate-300 font-mono break-all flex-1 select-all leading-relaxed">
                                    {pixData.qr_code || 'Código não disponível'}
                                </p>
                                <button onClick={copyPixCode} className="flex-shrink-0 bg-green-600 hover:bg-green-500 text-white p-2 rounded transition-colors" title="Copiar código">
                                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            {copied && <p className="text-green-400 text-xs font-mono mt-2 text-center">Código copiado!</p>}
                        </div>

                        {pixData.ticket_url && (
                            <a href={pixData.ticket_url} target="_blank" rel="noopener noreferrer" className="block text-center text-indigo-400 hover:text-indigo-300 text-sm font-mono underline mb-6">
                                Abrir tela de pagamento Mercado Pago
                            </a>
                        )}

                        <div className="border-t border-green-900/30 pt-4">
                            <div className="flex items-center justify-center gap-2 text-slate-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-mono">Aguardando pagamento...</span>
                            </div>
                        </div>

                        <button onClick={() => { setStep('summary'); setPixData(null); if (pollRef.current) clearInterval(pollRef.current); if (timerRef.current) clearInterval(timerRef.current); }} className="w-full mt-4 bg-transparent border border-slate-700 text-slate-400 hover:text-white font-bold py-3 rounded-lg transition-colors text-sm">
                            CANCELAR
                        </button>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-4">
                    <div className="space-y-6">
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
                                        </div>
                                        <span className="font-bold whitespace-nowrap text-slate-200">{`R$ ${item.price.toFixed(2)}`}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-slate-700 pt-4">
                                <p className="text-sm text-slate-400 mb-2">Subtotal: R$ {subtotal.toFixed(2)}</p>
                                {discount > 0 && <p className="text-sm text-green-400 mb-2">Desconto ({discount}%): -R$ {discountAmount.toFixed(2)}</p>}
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-slate-100">Total</span>
                                    <span className="text-3xl font-bold text-green-400">{`R$ ${total.toFixed(2)}`}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border-slate-700">
                            <h3 className="text-lg font-bold text-slate-100 mb-4">Cupom de Desconto</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="DIGITE O CUPOM"
                                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-green-500"
                                />
                                <button onClick={handleApplyCoupon} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                    APLICAR
                                </button>
                            </div>
                            {couponError && <p className="text-red-400 text-sm mt-2">{couponError}</p>}
                            {couponSuccess && <p className="text-green-400 text-sm mt-2">{couponSuccess}</p>}
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 border-slate-700">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="mt-1 w-4 h-4 accent-green-500 bg-slate-800 border-slate-600 rounded"
                                />
                                <span className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                    Li e aceito os{' '}
                                    <a href="/terms" target="_blank" className="text-indigo-400 hover:text-indigo-300 underline">Termos de Serviço</a>
                                    {' '}e a{' '}
                                    <a href="/privacy" target="_blank" className="text-indigo-400 hover:text-indigo-300 underline">Política de Privacidade</a>
                                    {' '}do beatsbyrmx
                                </span>
                            </label>
                        </Card>

                        {pixError && (
                            <Card className="p-4 border-red-500/30 bg-red-900/10">
                                <p className="text-red-400 text-sm font-mono">{pixError}</p>
                            </Card>
                        )}

                        <Card className="p-8 border-green-500/30 bg-gradient-to-br from-green-900/20 to-black">
                            <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2 font-mono uppercase">
                                <QrCode className="w-6 h-6" /> Pagar com Pix
                            </h2>
                            <p className="text-slate-400 mb-6 text-sm">QR Code instantâneo. Pagamento confirmado em segundos.</p>
                            <button
                                onClick={handlePixCheckout}
                                disabled={items.length === 0 || loading || !termsAccepted}
                                className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-4 px-6 rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> GERANDO QR CODE...</span>
                                ) : (
                                    <span className="flex items-center gap-2"><QrCode className="w-5 h-5" /> PAGAR COM PIX</span>
                                )}
                            </button>
                        </Card>

                        <Card className="p-8 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
                            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-indigo-400" /> Cartão de Crédito / Débito
                            </h2>
                            <p className="text-slate-300 mb-6">Pagamento internacional via Stripe.</p>
                            <button
                                onClick={handleStripeCheckout}
                                disabled={items.length === 0 || loading || !termsAccepted}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'REDIRECIONANDO...' : 'PAGAR COM CARTÃO'}
                            </button>
                        </Card>

                        <button onClick={onBackToStore} className="w-full bg-transparent hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white font-bold py-3 rounded-lg transition-colors">
                            Continuar Comprando
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
