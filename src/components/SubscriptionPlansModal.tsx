import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  CreditCard,
  QrCode,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { PricingPlan } from '../types/clinical';
import { PRICING_PLANS } from '../data/mockClinicalData';

interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PricingPlan) => void;
}

export const SubscriptionPlansModal: React.FC<SubscriptionPlansModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('equilibrio');
  const [paymentStep, setPaymentStep] = useState<'selection' | 'checkout' | 'success'>('selection');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);

  if (!isOpen) return null;

  const currentPlan = PRICING_PLANS.find(p => p.id === selectedPlanId) || PRICING_PLANS[2];

  const handleProceedToCheckout = (planId: string) => {
    setSelectedPlanId(planId);
    setPaymentStep('checkout');
  };

  const handleConfirmPayment = () => {
    onSelectPlan(currentPlan);
    setPaymentStep('success');
  };

  const handleCopyPix = () => {
    setCopiedPix(true);
    navigator.clipboard?.writeText('00020126580014br.gov.bcb.pix0136wellness.longevidade@clinica.com.br5204000053039865406490.005802BR5925WELLNESS LONGEVIDADE6009SAO PAULO62070503***6304E8A1');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-5xl rounded-3xl border border-[#2C3E2D]/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-[#2C3E2D]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C4E3C]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C4E3C]">
              Modelos de Cuidado & Investimento
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#7A8A7D] hover:text-[#1F2B20] p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {paymentStep === 'selection' && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#1F2B20]">
                  Escolha o Modelo de Atendimento Ideal
                </h2>
                <p className="text-xs sm:text-sm text-[#556457]">
                  Consultas avulsas ou programas mensais com acompanhamento contínuo de fitoterapia, nutrição e interações farmacológicas.
                </p>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {PRICING_PLANS.map((plan) => {
                  const isPopular = plan.isPopular;
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                        isPopular
                          ? 'bg-[#F5EFE6] border-[#8C4E3C] shadow-md ring-1 ring-[#8C4E3C]/30'
                          : 'bg-white border-[#DDD3C3] hover:border-[#8C4E3C]/40'
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8C4E3C] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs tracking-wider">
                          Mais Escolhido
                        </div>
                      )}

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-base font-serif-title font-bold text-[#1F2B20]">
                            {plan.title}
                          </h3>
                          <p className="text-[11px] text-[#69796C] mt-0.5 min-h-[32px] leading-snug">
                            {plan.subtitle}
                          </p>
                        </div>

                        <div className="flex items-baseline gap-1 py-1 border-y border-[#EAE2D5]">
                          <span className="text-2xl font-serif-title font-bold text-[#1F2B20] font-mono tabular-nums">
                            {plan.price}
                          </span>
                          <span className="text-[11px] text-[#718073]">
                            {plan.period}
                          </span>
                        </div>

                        <ul className="space-y-2 text-[11px] text-[#3F4D41]">
                          {plan.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-1.5 leading-snug">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#2C3E2D] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-5 mt-4 border-t border-[#EAE2D5]/80">
                        <button
                          onClick={() => handleProceedToCheckout(plan.id)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isPopular
                              ? 'bg-[#8C4E3C] hover:bg-[#743C2D] text-white shadow-xs'
                              : 'bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2]'
                          }`}
                        >
                          <span>{plan.id === 'avulsa' ? 'Agendar Consulta' : 'Assinar Plano'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust markers */}
              <div className="p-4 bg-[#F2EDE5] rounded-2xl border border-[#D7CCBC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#526154]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>Sem fidelidade obrigatória. Cancele ou altere seu plano quando desejar.</span>
                </div>
                <div className="text-[11px] text-[#718073]">
                  Pagamento protegido com criptografia de 256 bits · PIX & Cartão
                </div>
              </div>
            </div>
          )}

          {paymentStep === 'checkout' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="border-b border-[#2C3E2D]/10 pb-4">
                <button
                  onClick={() => setPaymentStep('selection')}
                  className="text-xs text-[#8C4E3C] font-semibold hover:underline mb-2 block"
                >
                  ← Voltar para escolha de planos
                </button>
                <h3 className="text-xl font-serif-title font-semibold text-[#1F2B20]">
                  Confirmação de Pagamento — {currentPlan.title}
                </h3>
                <p className="text-xs text-[#576859]">
                  Total a acertar:{' '}
                  <strong className="text-base text-[#1F2B20] font-mono tabular-nums">{currentPlan.price}</strong>{' '}
                  ({currentPlan.period})
                </p>
              </div>

              {/* Payment Method Switcher */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === 'pix'
                      ? 'bg-[#2C3E2D] text-white border-[#2C3E2D]'
                      : 'bg-white text-[#4A574C] border-[#D5CCBE]'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>PIX Instantâneo (Aprovação imediata)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cartao')}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === 'cartao'
                      ? 'bg-[#2C3E2D] text-white border-[#2C3E2D]'
                      : 'bg-white text-[#4A574C] border-[#D5CCBE]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cartão de Crédito (Até 12x)</span>
                </button>
              </div>

              {paymentMethod === 'pix' ? (
                <div className="p-6 bg-white rounded-2xl border border-[#D5CCBE] space-y-4 text-center">
                  <span className="text-xs uppercase font-bold text-[#8C4E3C] tracking-wider block">
                    Escaneie o QR Code com o aplicativo do seu banco
                  </span>

                  {/* Simulated QR Code Canvas */}
                  <div className="w-48 h-48 mx-auto bg-[#FAF7F2] p-3 rounded-2xl border-2 border-dashed border-[#2C3E2D]/30 flex flex-col items-center justify-center relative">
                    <QrCode className="w-36 h-36 text-[#2C3E2D]" />
                    <span className="text-[10px] text-[#6E7D70] font-mono mt-1">VALOR: {currentPlan.price}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-[#526355] block">Ou copie a chave Pix Copia e Cola:</span>
                    <div className="flex items-center gap-2 max-w-md mx-auto">
                      <input
                        type="text"
                        readOnly
                        value="00020126580014br.gov.bcb.pix0136wellness.longevidade@clinica.com.br520400005303986..."
                        className="w-full text-xs p-2 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2] font-mono"
                      />
                      <button
                        onClick={handleCopyPix}
                        className="px-3 py-2 rounded-lg bg-[#2C3E2D] text-white text-xs font-semibold shrink-0 flex items-center gap-1"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleConfirmPayment}
                      className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Já realizei o pagamento via PIX
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-white rounded-2xl border border-[#D5CCBE] space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#3B473D] mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• 4242"
                      className="w-full p-2.5 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2]"
                      defaultValue="4242 •••• •••• 9810"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#3B473D] mb-1">Validade (MM/AA)</label>
                      <input
                        type="text"
                        placeholder="11/29"
                        className="w-full p-2.5 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2]"
                        defaultValue="08/29"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#3B473D] mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        placeholder="•••"
                        className="w-full p-2.5 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2]"
                        defaultValue="381"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#3B473D] mb-1">Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      placeholder="Nome do titular como no cartão"
                      className="w-full p-2.5 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2]"
                    />
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="w-full py-3 rounded-xl bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-bold transition-colors shadow-xs"
                  >
                    Confirmar Assinatura ({currentPlan.price})
                  </button>
                </div>
              )}
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="max-w-md mx-auto text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif-title font-bold text-[#1F2B20]">
                Acesso Confirmado com Sucesso!
              </h3>
              <p className="text-xs text-[#526355] leading-relaxed">
                Seu plano <strong>{currentPlan.title}</strong> está ativo. O prontuário já foi vinculado à sua conta e as teleconsultas estão liberadas para agendamento com a Naturopata Marcia R Pinheiro de Moura.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#2C3E2D] text-white text-xs font-bold transition-colors"
                >
                  Voltar ao Meu Plano
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
