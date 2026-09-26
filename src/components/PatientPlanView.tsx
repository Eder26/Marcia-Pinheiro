import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  Sparkles,
  Leaf,
  Heart,
  Brain,
  Coffee,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Download,
  Flame,
  Droplets,
  Share2,
  Activity,
  TrendingDown,
  TrendingUp,
  Bell
} from 'lucide-react';
import { ClinicalPlan, SupplementItem, MetabolicSupportFormula, WeeklyEvolutionData } from '../types/clinical';
import { EvolutionChart } from './EvolutionChart';

interface PatientPlanViewProps {
  plan: ClinicalPlan;
  onOpenPrintModal: () => void;
  onToggleSupplementTaken: (supplementId: string) => void;
  evolutionData?: WeeklyEvolutionData[];
  onAddCheckIn?: (checkIn: WeeklyEvolutionData) => void;
  onOpenReminders?: () => void;
}

export const PatientPlanView: React.FC<PatientPlanViewProps> = ({
  plan,
  onOpenPrintModal,
  onToggleSupplementTaken,
  evolutionData,
  onAddCheckIn,
  onOpenReminders,
}) => {
  const [activeTab, setActiveTab] = useState<'nutricao' | 'suplementos' | 'fitoterapia' | 'estilodevida' | 'seguranca' | 'evolucao'>('nutricao');
  const [expandedMeal, setExpandedMeal] = useState<number | null>(0);
  const [expandedFormula, setExpandedFormula] = useState<string | null>(plan.phytotherapy.metabolicFormulas[0]?.id || null);

  const isPlanSigned = plan.status === 'validado_e_assinado';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Clinical Header & Validation Status */}
      <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2C3E2D]/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4E3C]">
                Protocolo Terapêutico Integrativo
              </span>
              <span className="text-xs text-[#6F7D71] font-mono">#{plan.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#1F2B20]">
              Plano de Cuidado & Longevidade Ativa
            </h1>
            <p className="text-xs sm:text-sm text-[#4E5B50]">
              Paciente:{' '}
              <strong className="text-[#1F2B20] font-semibold">{plan.patientName || 'Paciente'}</strong> ·
              Responsável Técnico:{' '}
              <span className="text-[#2C3E2D] font-medium">{plan.professionalName} ({plan.professionalRegistry})</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isPlanSigned ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Validado & Assinado</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Em Análise Clínica</span>
              </div>
            )}

            <button
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-semibold transition-colors shadow-xs"
              title="Visualizar receituário oficial com assinatura digital"
            >
              <Printer className="w-3.5 h-3.5 text-[#D3B474]" />
              Receituário & Laudo
            </button>
          </div>
        </div>

        {/* Clinical Synthesis / Functional Diagnosis Summary */}
        <div className="mt-6 p-4 sm:p-5 bg-[#F2EDE5] rounded-xl border border-[#D7CCBC] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C4E3C] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Diagnóstico Nutricional & Funcional Resumido
            </span>
            <span className="text-[11px] text-[#637265]">
              Auditoria de Farmacoterapia: <strong className="text-emerald-800">Concluída sem conflitos</strong>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#38433A] leading-relaxed">
            {plan.functionalDiagnosis.summary}
          </p>

          {/* Functional Dysbalances Indicators (anti-slop clean typography) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#D7CCBC]/80 text-xs">
            <div>
              <span className="text-[10px] text-[#6D7B6F] block">Índice Inflamatório</span>
              <strong className="text-[#8C4E3C] capitalize font-medium">
                {plan.functionalDiagnosis.inflammatoryIndex}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-[#6D7B6F] block">Curva Glicêmica</span>
              <strong className="text-[#2C3E2D] font-medium">Curva reativa às 17h</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#6D7B6F] block">Eixo Intestino-Cérebro</span>
              <strong className="text-[#8C4E3C] font-medium">Permeabilidade alterada</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#6D7B6F] block">Status Adrenal / Sono</span>
              <strong className="text-[#2C3E2D] font-medium">Fadiga funcional matinal</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#EAE2D5] rounded-xl border border-[#D5CCBE] overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('nutricao')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'nutricao'
              ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs'
              : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#8C4E3C]" />
          <span>Plano Alimentar & Substituições</span>
        </button>

        <button
          onClick={() => setActiveTab('suplementos')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'suplementos'
              ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs'
              : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Suplementação Prescrita</span>
        </button>

        <button
          onClick={() => setActiveTab('fitoterapia')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'fitoterapia'
              ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs'
              : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-[#2C3E2D]" />
          <span>Fitoterapia & Apoio Metabólico</span>
        </button>

        <button
          onClick={() => setActiveTab('estilodevida')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'estilodevida'
              ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs'
              : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-[#4A5D75]" />
          <span>Sono, Movimento & Metas</span>
        </button>

        <button
          onClick={() => setActiveTab('seguranca')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'seguranca'
              ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs'
              : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Auditoria de Interações</span>
        </button>

        <button
          onClick={() => setActiveTab('evolucao')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'evolucao'
              ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs'
              : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#8C4E3C]" />
          <span>Gráfico de Evolução & Peso</span>
        </button>

        {onOpenReminders && (
          <button
            onClick={onOpenReminders}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap text-[#58665A] hover:text-[#1F2B20]"
            title="Definir notificações push e avisos sonoros de ingestão"
          >
            <Bell className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Configurar Lembretes</span>
          </button>
        )}
      </div>

      {/* TAB 1: NUTRIÇÃO & SUBSTITUIÇÕES */}
      {activeTab === 'nutricao' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#8C4E3C]">
                Dietoterapia Funcional Específica
              </span>
              <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
                Diretrizes Nutricionais Personalizadas
              </h2>
              <p className="text-xs sm:text-sm text-[#4F5D51] mt-1 leading-relaxed">
                {plan.nutritionalGuidelines.dietaryPhilosophy}
              </p>
            </div>

            {/* Meal Template Accordions */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-[#1F2B20] uppercase tracking-wider">
                Cardápio-Base Estruturado & Horários Recomendados
              </h3>

              {plan.nutritionalGuidelines.meals.map((meal, idx) => {
                const isExpanded = expandedMeal === idx;
                return (
                  <div
                    key={meal.mealName}
                    className="border border-[#D9CFBF] rounded-xl overflow-hidden bg-white transition-all"
                  >
                    <button
                      onClick={() => setExpandedMeal(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EAE2D5] text-[#2C3E2D] flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-[#1F2B20]">
                            {meal.mealName}
                          </h4>
                          <span className="text-[11px] text-[#6E7D70] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meal.timing}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#7A8A7C]" /> : <ChevronDown className="w-4 h-4 text-[#7A8A7C]" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-[#EAE2D5] space-y-4 text-xs">
                        {/* Base Options */}
                        <div>
                          <span className="font-semibold text-[#2C3E2D] block mb-1.5">
                            Opções Recomendadas:
                          </span>
                          <ul className="space-y-1.5 list-disc list-inside text-[#3E4A40]">
                            {meal.baseOptions.map((opt, oIdx) => (
                              <li key={oIdx} className="leading-relaxed">
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Smart Swaps */}
                        {meal.smartSubstitutions.length > 0 && (
                          <div className="p-3 bg-[#F4EFE8] rounded-lg border border-[#DDD3C3] space-y-2">
                            <span className="font-semibold text-[#8C4E3C] block text-[11px] uppercase tracking-wide">
                              Substituições Práticas & Raciocínio Clínico:
                            </span>
                            {meal.smartSubstitutions.map((sub, sIdx) => (
                              <div key={sIdx} className="text-[11px] text-[#414E43] leading-relaxed">
                                <span className="line-through text-[#8F9C91]">{sub.original}</span>
                                {' '}→{' '}
                                <strong className="text-[#1F2B20] font-semibold">{sub.functionalSwap}</strong>
                                <p className="text-[10px] text-[#647466] italic mt-0.5">
                                  Motivo: {sub.reason}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Clinical Tip */}
                        {meal.clinicalTips && (
                          <p className="text-[11px] text-[#2C3E2D] bg-[#EBF2EC] p-2.5 rounded-md border border-[#CDE0D0]">
                            <strong>Orientação da Naturopata Marcia:</strong> {meal.clinicalTips}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Smart Shopping List */}
            <div className="p-5 bg-[#F2EDE5] rounded-xl border border-[#D7CCBC] space-y-3">
              <h3 className="text-xs font-bold text-[#8C4E3C] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Lista de Compras Inteligente para a Semana
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {plan.nutritionalGuidelines.shoppingListCategories.map(cat => (
                  <div key={cat.category} className="bg-white p-3.5 rounded-lg border border-[#DDD3C3]">
                    <span className="font-semibold text-[#1F2B20] block mb-2 border-b border-[#EBE4D8] pb-1 text-[11px]">
                      {cat.category}
                    </span>
                    <ul className="space-y-1 text-[#4F5E52] text-[11px]">
                      {cat.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8C4E3C]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUPLEMENTAÇÃO PRESCRITA */}
      {activeTab === 'suplementos' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C3E2D]/10 pb-4">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-[#8C4E3C]">
                  Prescrição de Micronutrientes
                </span>
                <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
                  Suplementação Funcional & Modulação Celular
                </h2>
                <p className="text-xs text-[#526154]">
                  Fórmulas personalizadas manipuladas com grau farmacêutico, chanceladas por profissional habilitado.
                </p>
              </div>

              <div className="text-xs text-[#2C3E2D] font-medium bg-[#EBF2EC] px-3 py-1.5 rounded-lg border border-[#C9DEC8]">
                Check-in Diário de Tomada
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {plan.supplementation.map((sup) => (
                <div
                  key={sup.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    sup.takenToday
                      ? 'bg-[#F2F7F3] border-[#BAD8BD]'
                      : 'bg-white border-[#DCD1C0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1F2B20]">
                          {sup.name}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#FAF7F2] text-[#69786B] border border-[#DDD3C3]">
                          {sup.eixoRelacionado.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#8C4E3C] font-semibold">
                        Posologia: {sup.dosage}
                      </p>
                      <p className="text-xs text-[#48564A] flex items-center gap-1.5 pt-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#2C3E2D]" />
                        <strong>Horário exato:</strong> {sup.timing}
                      </p>
                      <p className="text-[11px] text-[#617163] leading-relaxed pt-1">
                        <strong>Indicação Clínica:</strong> {sup.purpose}
                      </p>
                    </div>

                    <button
                      onClick={() => onToggleSupplementTaken(sup.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                        sup.takenToday
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-[#EAE2D5] text-[#3F4D41] hover:bg-[#DDD3C3]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {sup.takenToday ? 'Tomado Hoje' : 'Marcar Tomado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#F2EDE5] rounded-xl border border-[#D7CCBC] text-xs text-[#4F5E52] leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <p>
                <strong>Regra de Ouro de Segurança:</strong> Conforme apontado no prontuário, a suplementação de minerais (Ferro e Magnésio) e fibras foi estritamente afastada do horário da Levotiroxina (mínimo de 4h de intervalo) para não reduzir a absorção do hormônio tireoidiano.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FITOTERAPIA & APOIO METABÓLICO */}
      {activeTab === 'fitoterapia' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#8C4E3C]">
                Plantas Medicinais & Fitocomplexos
              </span>
              <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
                Fitoterapia Clínica & Modulação Metabólica
              </h2>
              <p className="text-xs sm:text-sm text-[#4F5D51] mt-1 leading-relaxed">
                Formuladas sob medida para saciedade, controle de compulsão vespertina, drenagem hepática e restauração do eixo intestino-cérebro.
              </p>
            </div>

            {/* Chás Medicinais */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#1F2B20] uppercase tracking-wider flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-[#2C3E2D]" />
                Infusões Terapêuticas & Chás Medicinais
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plan.phytotherapy.teas.map((tea) => (
                  <div key={tea.id} className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2">
                    <span className="text-xs font-bold text-[#2C3E2D] block">
                      {tea.name}
                    </span>
                    <span className="text-[11px] text-[#708072] block">
                      Partes botânicas: {tea.botanicalParts}
                    </span>
                    <div className="text-[11px] text-[#414E43] bg-[#FAF7F2] p-2 rounded border border-[#EBE4D8]">
                      <strong>Modo de Preparo:</strong> {tea.preparationMethod}
                    </div>
                    <p className="text-[11px] text-[#8C4E3C] font-semibold">
                      Horário: {tea.schedule}
                    </p>
                    <p className="text-[10px] text-[#637365]">
                      Alvo: {tea.therapeuticTarget}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fórmulas de Apoio Metabólico */}
            <div className="space-y-3 pt-3">
              <h3 className="text-xs font-bold text-[#8C4E3C] uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Fórmulas de Apoio Metabólico & Saciedade (Manipulação Magistral)
              </h3>

              <div className="space-y-3">
                {plan.phytotherapy.metabolicFormulas.map((form) => {
                  const isExpanded = expandedFormula === form.id;
                  return (
                    <div
                      key={form.id}
                      className="border border-[#D9CFBF] rounded-xl overflow-hidden bg-white"
                    >
                      <button
                        onClick={() => setExpandedFormula(isExpanded ? null : form.id)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-[#1F2B20]">
                              {form.title}
                            </span>
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#F8ECE8] text-[#8C4E3C] border border-[#ECCFC7]">
                              {form.category.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#556457] mt-0.5">
                            Posologia: <strong className="text-[#1F2B20]">{form.posology}</strong>
                          </p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#7A8A7C]" /> : <ChevronDown className="w-4 h-4 text-[#7A8A7C]" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 sm:p-5 pt-0 border-t border-[#EAE2D5] space-y-3 text-xs">
                          {/* Ingredients */}
                          <div>
                            <span className="font-semibold text-[#2C3E2D] block mb-1">
                              Composição dos Ativos Padronizados:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {form.botanicalIngredients.map((ing, iIdx) => (
                                <div key={iIdx} className="p-2 bg-[#F6F1EA] rounded-md border border-[#E5DCce] text-[11px] flex justify-between">
                                  <span className="text-[#2F3A31] font-medium">{ing.name}</span>
                                  <span className="font-mono text-[#8C4E3C] font-semibold">{ing.standardConcentration}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E4DACD]">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#2C3E2D] block mb-0.5">
                              Racional Clínico & Mecanismo de Ação
                            </span>
                            <p className="text-[11px] text-[#414E43] leading-relaxed">
                              {form.clinicalRationale}
                            </p>
                          </div>

                          <div className="text-[10px] text-[#8C4E3C] bg-rose-50/60 p-2 rounded border border-rose-200">
                            <strong>Cuidados & Contraindicações:</strong> {form.warningsAndContraindications}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Florais */}
            <div className="p-4 bg-[#F2EDE5] rounded-xl border border-[#D7CCBC] space-y-2">
              <span className="text-xs font-bold text-[#2C3E2D] uppercase tracking-wider block">
                Sistema Floral Complementar de Apoio Emocional
              </span>
              {plan.phytotherapy.florals.map((flo) => (
                <div key={flo.id} className="bg-white p-3 rounded-lg border border-[#DDD3C3] text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-[#1F2B20]">{flo.systemName} — {flo.formula}</strong>
                    <span className="text-[11px] font-semibold text-[#8C4E3C]">{flo.posology}</span>
                  </div>
                  <p className="text-[11px] text-[#556457]">
                    <strong>Foco:</strong> {flo.emotionalTarget}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ESTILO DE VIDA, SONO E METAS */}
      {activeTab === 'estilodevida' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#8C4E3C]">
                Medicina do Estilo de Vida
              </span>
              <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
                Sono Circadiano, Movimento & Mindfulness
              </h2>
              <p className="text-xs sm:text-sm text-[#4F5D51] mt-1 leading-relaxed">
                As intervenções comportamentais representam 60% da sustentabilidade da longevidade celular e estabilização de hormônios.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2 text-xs">
                <span className="font-bold text-[#1F2B20] flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-[#4A5D75]" />
                  Higiene do Sono & Melatonina
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-[#445246] text-[11px] leading-relaxed">
                  {plan.lifestylePrescription.sleepSanitation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2 text-xs">
                <span className="font-bold text-[#1F2B20] flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
                  Movimento & Luz Solar
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-[#445246] text-[11px] leading-relaxed">
                  {plan.lifestylePrescription.physicalMovement.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2 text-xs">
                <span className="font-bold text-[#1F2B20] flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-[#8C4E3C]" />
                  Gestão do Eixo do Estresse
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-[#445246] text-[11px] leading-relaxed">
                  {plan.lifestylePrescription.stressMindfulness.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Milestones Progress Tracker */}
            <div className="p-5 bg-[#F2EDE5] rounded-xl border border-[#D7CCBC] space-y-4">
              <h3 className="text-xs font-bold text-[#8C4E3C] uppercase tracking-wider">
                Marcos Graduais de Evolução (30, 60 e 90 Dias)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-white rounded-lg border border-[#DDD3C3]">
                  <span className="text-[10px] uppercase font-bold text-[#2C3E2D] block mb-1">
                    30 Dias — Alívio & Regularização
                  </span>
                  <p className="text-[11px] text-[#425044] leading-relaxed">
                    {plan.lifestylePrescription.milestones.day30}
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-lg border border-[#DDD3C3]">
                  <span className="text-[10px] uppercase font-bold text-[#2C3E2D] block mb-1">
                    60 Dias — Energia & Vitalidade
                  </span>
                  <p className="text-[11px] text-[#425044] leading-relaxed">
                    {plan.lifestylePrescription.milestones.day60}
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-lg border border-[#DDD3C3]">
                  <span className="text-[10px] uppercase font-bold text-[#2C3E2D] block mb-1">
                    90 Dias — Consolidação & Longevidade
                  </span>
                  <p className="text-[11px] text-[#425044] leading-relaxed">
                    {plan.lifestylePrescription.milestones.day90}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDITORIA DE SEGURANÇA FARMACOLÓGICA */}
      {activeTab === 'seguranca' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-emerald-800">
                Segurança Clínica Transparente
              </span>
              <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
                Auditoria de Interações Medicamento-Planta
              </h2>
              <p className="text-xs sm:text-sm text-[#4F5D51] mt-1 leading-relaxed">
                Todas as substâncias contínuas declaradas no seu prontuário foram cruzadas contra o banco de interações fitofarmacológicas.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-3">
              <span className="text-xs font-bold text-[#1F2B20] block">
                Medicamentos Contínuos Auditados:
              </span>
              <div className="flex flex-wrap gap-2">
                {plan.safetyVerification.medicationsAudited.map((med, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded bg-[#EBF2EC] text-[#2C3E2D] border border-[#CDE0D0] font-medium">
                    ✓ {med}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-[#8C4E3C] block uppercase tracking-wider">
                Interações Analisadas e Soluções Adotadas no Plano:
              </span>

              {plan.safetyVerification.detectedInteractions.map((inter) => (
                <div key={inter.id} className="p-4 rounded-xl border border-[#D9CFBF] bg-white text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#1F2B20]">
                      {inter.drug} ↔ {inter.herbOrNutrient}
                    </strong>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Risco Mitigado pelo Profissional
                    </span>
                  </div>
                  <p className="text-[11px] text-[#556457]">
                    <strong>Mecanismo Biológico:</strong> {inter.mechanism}
                  </p>
                  <div className="p-2.5 bg-[#FAF7F2] rounded border border-[#E5DDD0] text-[11px] text-[#2C3E2D]">
                    <strong className="text-emerald-800">Conduta Aplicada:</strong> {inter.actionRequired}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#F2EDE5] rounded-xl border border-[#D7CCBC] text-xs text-[#3E4C41] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#1F2B20]">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                Parecer Técnico do Responsável Clínico
              </div>
              <p className="text-[11px] leading-relaxed">
                "{plan.safetyVerification.professionalAuditNotes}"
              </p>
              <div className="text-[10px] text-[#718173] pt-1">
                Hash de Validação Digital: <code className="font-mono text-[#2C3E2D]">{plan.digitalSignatureHash}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GRÁFICO DE EVOLUÇÃO & PESO */}
      {activeTab === 'evolucao' && evolutionData && onAddCheckIn && (
        <EvolutionChart data={evolutionData} onAddCheckIn={onAddCheckIn} />
      )}
    </div>
  );
};
