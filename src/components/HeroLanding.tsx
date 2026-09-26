import React from 'react';
import {
  ShieldCheck,
  Leaf,
  Heart,
  Brain,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  Lock,
  Stethoscope,
  Activity,
  Droplets,
  Flame
} from 'lucide-react';
import { PricingPlan } from '../types/clinical';
import { PRICING_PLANS } from '../data/mockClinicalData';

interface HeroLandingProps {
  onStartAnamnesis: () => void;
  onViewPlan: () => void;
  onOpenPlans: () => void;
  onOpenVideoCall: () => void;
  onOpenProfessionalPortal: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartAnamnesis,
  onViewPlan,
  onOpenPlans,
  onOpenVideoCall,
  onOpenProfessionalPortal,
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-[#2C3E2D]/12 bg-[#FAF7F2] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[520px]">
          {/* Left Text Zone (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C4E3C] bg-[#F7ECE8] px-3 py-1 rounded-full border border-[#ECCFC7]">
                <Leaf className="w-3.5 h-3.5" />
                <span>Naturopatia · Nutrição Funcional · Fitoterapia</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif-title font-semibold text-[#1F2B20] leading-[1.15] text-balance">
                Cuidado integrativo sério, respaldado pela ciência da longevidade celular.
              </h1>

              <p className="text-sm sm:text-base text-[#4D5C50] leading-relaxed max-w-xl">
                Conectamos você a profissionais habilitados (CRN/CRTH) por meio de um prontuário digital completo, gerando planos terapêuticos e fitoterápicos sob medida — sem promessas milagrosas, com segurança farmacológica ativa.
              </p>
            </div>

            {/* CTAs & Trust Badges */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onStartAnamnesis}
                  className="px-6 py-3.5 rounded-xl bg-[#2C3E2D] hover:bg-[#384F39] text-[#FAF7F2] text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <span>Preencher Prontuário Digital</span>
                  <ArrowRight className="w-4 h-4 text-[#D3B474]" />
                </button>

                <button
                  onClick={onViewPlan}
                  className="px-5 py-3.5 rounded-xl border border-[#2C3E2D]/30 bg-white hover:bg-[#F2ECE3] text-[#1F2B20] text-xs sm:text-sm font-semibold transition-colors"
                >
                  Explorar Plano & Fórmulas
                </button>

                <button
                  onClick={onOpenPlans}
                  className="px-4 py-3.5 rounded-xl text-[#8C4E3C] hover:text-[#6F3728] text-xs sm:text-sm font-semibold transition-colors"
                >
                  Ver Modelos & Planos →
                </button>
              </div>

              {/* Unboxed Metadata Trust Indicators */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5D6B60] pt-2 border-t border-[#2C3E2D]/10">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  Auditoria de Interações Farmacológicas
                </span>
                <span aria-hidden="true">·</span>
                <span>Assinatura Digital CRN / CRTH</span>
                <span aria-hidden="true">·</span>
                <span>LGPD Compliant</span>
              </div>
            </div>
          </div>

          {/* Right Image Zone (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_herbal_clinical_1790386684328.jpg"
              alt="Laboratório botânico clínico de naturopatia e extratos funcionais"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Atmospheric overlay scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#FAF7F2]/90 backdrop-blur-md rounded-xl border border-white/40 text-xs text-[#2C3E2D] shadow-lg">
              <span className="font-bold block text-[11px] text-[#8C4E3C]">FITOTERAPIA BASEADA EM EVIDÊNCIAS</span>
              Extratos secos padronizados com controle de bioativos e proteção hepato-renal.
            </div>
          </div>
        </div>
      </section>

      {/* 3 Clinical Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold text-[#8C4E3C] tracking-wider">
            Arquitetura Terapêutica
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#1F2B20]">
            Apoiando — sem nunca substituir — o raciocínio clínico
          </h2>
          <p className="text-xs sm:text-sm text-[#556457]">
            Nenhum protocolo ou fórmula é liberado sem avaliação prévia e carimbo de profissional habilitado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-7 space-y-4 hover:border-[#8C4E3C]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#EBF2EC] text-[#2C3E2D] flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif-title font-bold text-[#1F2B20]">
              Eixo Intestino-Cérebro & Bristol
            </h3>
            <p className="text-xs sm:text-sm text-[#4E5C50] leading-relaxed">
              Mapeamos a consistência evacuatória (Escala de Bristol), permeabilidade epitelial e correlações de ansiedade com distensão gástrica, prescrevendo cepas-alvo e adaptógenos.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-7 space-y-4 hover:border-[#8C4E3C]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F7ECE8] text-[#8C4E3C] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif-title font-bold text-[#1F2B20]">
              Apoio Metabólico & Saciedade
            </h3>
            <p className="text-xs sm:text-sm text-[#4E5C50] leading-relaxed">
              Fórmulas magistrais botânicas auxiliares no controle da compulsão vespertina por doces (Gymnema + Psyllium), termogênicos naturais e suporte de drenagem biliar e hepática.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-7 space-y-4 hover:border-[#8C4E3C]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#F2EDE5] text-[#2C3E2D] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-800" />
            </div>
            <h3 className="text-lg font-serif-title font-bold text-[#1F2B20]">
              Checagem de Interações Contínuas
            </h3>
            <p className="text-xs sm:text-sm text-[#4E5C50] leading-relaxed">
              Se você faz uso de hormônio tireoidiano, antidepressivos, anti-hipertensivos ou anticoagulantes, o sistema cruza todas as janelas de absorção e contraindicações formais.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Clinical Snapshot with Photography */}
      <section className="bg-white border border-[#2C3E2D]/12 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs uppercase font-bold text-[#8C4E3C] tracking-wider">
            Nutrição Funcional Não Punitiva
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#1F2B20]">
            Substituições inteligentes, listas de compras e cardápios adaptados à sua rotina real.
          </h2>
          <p className="text-xs sm:text-sm text-[#4C5B4E] leading-relaxed">
            Nada de restrições vazias ou suplementação empírica. Cada recomendação do seu plano tem respaldo clínico e visa restaurar a bioenergética mitocondrial.
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center gap-2 text-[#2C3E2D] font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Cardápio-base com trocas práticas para almoço corporativo</span>
            </div>
            <div className="flex items-center gap-2 text-[#2C3E2D] font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Diário com fotos, registro de energia e hidratação</span>
            </div>
            <div className="flex items-center gap-2 text-[#2C3E2D] font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Acompanhamento quinzenal ou mensal via teleconsulta em vídeo</span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={onOpenVideoCall}
              className="px-5 py-2.5 rounded-xl bg-[#2C3E2D] hover:bg-[#384F39] text-[#FAF7F2] text-xs font-bold transition-colors inline-flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D3B474]" />
              <span>Testar Sala de Teleconsulta com Prontuário</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md">
          <img
            src="/src/assets/images/nutrition_lifestyle_harvest_1790386696163.jpg"
            alt="Ingredientes de nutrição funcional e medicina do estilo de vida"
            className="w-full h-80 object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Modelos de Atendimento (Pricing teaser) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#2C3E2D]/10 pb-4">
          <div>
            <span className="text-xs uppercase font-bold text-[#8C4E3C] tracking-wider">
              Acesso & Investimento
            </span>
            <h2 className="text-2xl font-serif-title font-semibold text-[#1F2B20]">
              Planos Mensais e Consulta Avulsa
            </h2>
          </div>
          <button
            onClick={onOpenPlans}
            className="text-xs font-bold text-[#8C4E3C] hover:underline"
          >
            Ver Detalhes de Todos os Planos →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-5 rounded-2xl border bg-white flex flex-col justify-between ${
                plan.isPopular ? 'border-[#8C4E3C] ring-1 ring-[#8C4E3C]/30 bg-[#FAF7F2]' : 'border-[#D9CFBF]'
              }`}
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#8C4E3C]">
                  {plan.highlightText}
                </span>
                <h3 className="font-serif-title text-base font-bold text-[#1F2B20]">
                  {plan.title}
                </h3>
                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-xl font-bold font-mono text-[#1F2B20]">
                    {plan.price}
                  </span>
                  <span className="text-[10px] text-[#69796C]">{plan.period}</span>
                </div>
                <p className="text-[11px] text-[#556457] leading-snug">
                  {plan.suitableFor}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[#EAE2D5]">
                <button
                  onClick={onOpenPlans}
                  className="w-full py-2 rounded-lg bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-semibold transition-colors"
                >
                  Selecionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Portal Teaser Banner */}
      <section className="bg-[#2C3E2D] text-[#FAF7F2] rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs uppercase font-bold text-[#D3B474] tracking-wider block">
            Área Exclusiva para Especialistas
          </span>
          <h2 className="text-2xl font-serif-title font-semibold">
            Você é Naturopata ou Nutricionista Funcional com registro?
          </h2>
          <p className="text-xs sm:text-sm text-[#D7E3D8] leading-relaxed">
            Acesse o prontuário eletrônico completo, o validador de interações farmacológicas e assine laudos digitais com carimbo eletrônico.
          </p>
        </div>

        <button
          onClick={onOpenProfessionalPortal}
          className="px-6 py-3 rounded-xl bg-[#FAF7F2] hover:bg-white text-[#2C3E2D] text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <Stethoscope className="w-4 h-4 text-[#8C4E3C]" />
          <span>Acessar Painel Clínico</span>
        </button>
      </section>
    </div>
  );
};
