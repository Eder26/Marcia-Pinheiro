import React, { useState } from 'react';
import {
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Activity,
  Heart,
  Brain,
  Moon,
  Sparkles,
  Flame,
  Plus,
  Trash2,
  Edit3,
  Video,
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';
import { ClinicalPlan, AnamnesisData, DrugHerbInteraction, BristolStoolType, WeeklyEvolutionData } from '../types/clinical';
import { DRUG_HERB_INTERACTIONS_DB } from '../data/mockClinicalData';
import { EvolutionChart } from './EvolutionChart';

interface ProfessionalDashboardProps {
  plan: ClinicalPlan;
  anamnesis: AnamnesisData;
  onUpdatePlan: (updatedPlan: ClinicalPlan) => void;
  onOpenVideoCall: () => void;
  onOpenPrintModal: () => void;
  onSwitchToPatientView: () => void;
  evolutionData?: WeeklyEvolutionData[];
  onAddCheckIn?: (checkIn: WeeklyEvolutionData) => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  plan,
  anamnesis,
  onUpdatePlan,
  onOpenVideoCall,
  onOpenPrintModal,
  onSwitchToPatientView,
  evolutionData,
  onAddCheckIn,
}) => {
  const [activeTab, setActiveTab] = useState<'triagem' | 'interacoes' | 'editor' | 'assinatura' | 'evolucao'>('triagem');
  const [isSigning, setIsSigning] = useState(false);
  const [customAuditNote, setCustomAuditNote] = useState(plan.safetyVerification.professionalAuditNotes);

  const isSigned = plan.status === 'validado_e_assinado';

  const handleSignAndRelease = () => {
    setIsSigning(true);
    setTimeout(() => {
      onUpdatePlan({
        ...plan,
        status: 'validado_e_assinado',
        signedAt: new Date().toISOString(),
        digitalSignatureHash: `WL-AUT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-CRN48910`,
        safetyVerification: {
          ...plan.safetyVerification,
          professionalAuditNotes: customAuditNote
        }
      });
      setIsSigning(false);
    }, 800);
  };

  const handleToggleValidation = (itemType: 'formula' | 'tea' | 'supplement', id: string) => {
    if (itemType === 'formula') {
      const updatedFormulas = plan.phytotherapy.metabolicFormulas.map(f =>
        f.id === id ? { ...f, validated: !f.validated } : f
      );
      onUpdatePlan({
        ...plan,
        phytotherapy: {
          ...plan.phytotherapy,
          metabolicFormulas: updatedFormulas
        }
      });
    } else if (itemType === 'tea') {
      const updatedTeas = plan.phytotherapy.teas.map(t =>
        t.id === id ? { ...t, validated: !t.validated } : t
      );
      onUpdatePlan({
        ...plan,
        phytotherapy: {
          ...plan.phytotherapy,
          teas: updatedTeas
        }
      });
    } else if (itemType === 'supplement') {
      const updatedSups = plan.supplementation.map(s =>
        s.id === id ? { ...s, validated: !s.validated } : s
      );
      onUpdatePlan({
        ...plan,
        supplementation: updatedSups
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Clinical Bar */}
      <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2C3E2D]/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8C4E3C]" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4E3C]">
                Estação Clínica do Profissional
              </span>
              <span className="text-xs text-[#5F6E61]">CRM/CRN-3 48.910 · CRTH-BR 1892</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#1F2B20]">
              Avaliação & Prescrição Integrativa
            </h1>
            <p className="text-xs sm:text-sm text-[#4E5B50]">
              Paciente em Atendimento:{' '}
              <strong className="text-[#1F2B20]">{anamnesis.fullName || 'Paciente'}</strong> ({anamnesis.age} anos · {anamnesis.profession})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenVideoCall}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-semibold transition-colors shadow-xs"
            >
              <Video className="w-3.5 h-3.5 text-[#D3B474]" />
              Iniciar Teleconsulta
            </button>

            <button
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D5CCBE] bg-white hover:bg-[#F2ECE3] text-[#344036] text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Laudo
            </button>
          </div>
        </div>

        {/* Quick Clinical Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3 bg-[#F2EDE5] rounded-xl border border-[#D9CFBF]">
            <span className="text-[10px] uppercase font-bold text-[#718073] block">
              Queixa Principal
            </span>
            <span className="text-xs font-semibold text-[#1F2B20] block mt-0.5 capitalize">
              {anamnesis.mainGoal.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="p-3 bg-[#F2EDE5] rounded-xl border border-[#D9CFBF]">
            <span className="text-[10px] uppercase font-bold text-[#718073] block">
              Farmacoterapia Declarada
            </span>
            <span className="text-xs font-semibold text-[#8C4E3C] block mt-0.5">
              {anamnesis.continuousMedications.length} Medicamentos Contínuos
            </span>
          </div>

          <div className="p-3 bg-[#F2EDE5] rounded-xl border border-[#D9CFBF]">
            <span className="text-[10px] uppercase font-bold text-[#718073] block">
              Escala de Bristol
            </span>
            <span className="text-xs font-semibold text-[#1F2B20] block mt-0.5">
              Tipo {anamnesis.bristolScaleType} (Trânsito lento)
            </span>
          </div>

          <div className="p-3 bg-[#F2EDE5] rounded-xl border border-[#D9CFBF]">
            <span className="text-[10px] uppercase font-bold text-[#718073] block">
              Status da Assinatura
            </span>
            <span className={`text-xs font-bold block mt-0.5 ${isSigned ? 'text-emerald-800' : 'text-amber-800'}`}>
              {isSigned ? '✓ Liberado ao Paciente' : '● Requer Assinatura'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#EAE2D5] rounded-xl border border-[#D5CCBE] overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('triagem')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'triagem' ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs' : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#2C3E2D]" />
          <span>Cruzamento Clínico & Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('interacoes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'interacoes' ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs' : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#C86D51]" />
          <span>Auditoria de Interações Farmacológicas</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'editor' ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs' : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-[#8C4E3C]" />
          <span>Editor de Fórmulas & Dosagens</span>
        </button>

        <button
          onClick={() => setActiveTab('assinatura')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'assinatura' ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs' : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
          <span>Assinatura Digital & Liberação</span>
        </button>

        <button
          onClick={() => setActiveTab('evolucao')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'evolucao' ? 'bg-[#FAF7F2] text-[#1F2B20] shadow-xs' : 'text-[#58665A] hover:text-[#1F2B20]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#8C4E3C]" />
          <span>Evolução do Paciente (4 Semanas)</span>
        </button>
      </div>

      {/* TAB 1: CRUZAMENTO CLÍNICO & RADAR DE DESEQUILÍBRIOS */}
      {activeTab === 'triagem' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#8C4E3C]">
                Raciocínio Clínico Apoiado por Dados
              </span>
              <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
                Painel Visual de Cruzamento dos 4 Eixos Funcionais
              </h2>
              <p className="text-xs sm:text-sm text-[#4F5D51] mt-1 leading-relaxed">
                O sistema compila os dados da anamnese (recordatório, sintomas gástricos, Bristol, rotina e exames) para apoiar seu diagnóstico clínico.
              </p>
            </div>

            {/* 4 Quadrants Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Axis 1: Inflamatório & Imunológico */}
              <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8C4E3C] flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                    <Flame className="w-3.5 h-3.5" />
                    1. Eixo Inflamatório & Barreira
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    Moderado
                  </span>
                </div>
                <p className="text-[#3F4C41] leading-relaxed text-[11px]">
                  <strong>Sinais mapeados:</strong> PCR ultrassensível 1.8 mg/L (acima do ótimo &lt;0.5); distensão abdominal frequente; rinite alérgica crônica e intolerância aos laticínios.
                </p>
                <div className="p-2 bg-[#FAF7F2] rounded border border-[#E8DFC9] text-[10px] text-[#556457]">
                  <strong>Conduta sugerida:</strong> Curcumina padronizada, quercetina alimentar, suspensão de lácteos e azeite extravirgem com alta concentração de oleocantal.
                </div>
              </div>

              {/* Axis 2: Glicemia & Saciedade */}
              <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8C4E3C] flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    2. Eixo Metabólico & Insulina
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-200">
                    Curva Reativa às 17h
                  </span>
                </div>
                <p className="text-[#3F4C41] leading-relaxed text-[11px]">
                  <strong>Sinais mapeados:</strong> Hipoglicemia reativa clássica desencadeada por almoço rico em carboidratos refinados (arroz branco + suco) e ausência de proteína de suporte às 16h.
                </p>
                <div className="p-2 bg-[#FAF7F2] rounded border border-[#E8DFC9] text-[10px] text-[#556457]">
                  <strong>Conduta sugerida:</strong> Gymnema sylvestre 200mg + Psyllium às 16h00 e troca inteligente para gorduras boas e castanhas no lanche.
                </div>
              </div>

              {/* Axis 3: Eixo Intestino-Cérebro */}
              <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2C3E2D] flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                    <Brain className="w-3.5 h-3.5" />
                    3. Eixo Intestino-Cérebro & Microbiota
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    Permeabilidade Alterada
                  </span>
                </div>
                <p className="text-[#3F4C41] leading-relaxed text-[11px]">
                  <strong>Sinais mapeados:</strong> Fezes tipo 2 na Escala de Bristol; evacuação a cada 2 dias; alta correlação entre estresse com prazos judiciais e piora da motilidade cólica.
                </p>
                <div className="p-2 bg-[#FAF7F2] rounded border border-[#E8DFC9] text-[10px] text-[#556457]">
                  <strong>Conduta sugerida:</strong> Cepa-alvo B. lactis HN019 + L. acidophilus + FOS noturno, além de hidratação ajustada para 2.400 mL.
                </div>
              </div>

              {/* Axis 4: Sono, Ritmo Circadiano & Mitocôndria */}
              <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2C3E2D] flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                    <Moon className="w-3.5 h-3.5" />
                    4. Eixo Adrenal, Sono & Mitocôndria
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                    Fadiga Matinal Funcional
                  </span>
                </div>
                <p className="text-[#3F4C41] leading-relaxed text-[11px]">
                  <strong>Sinais mapeados:</strong> 6 horas de sono com nota 2/5; estresse nível 8/10; Ferritina 31 ng/mL e Vitamina D 24 ng/mL depletados gerando baixa fosforilação oxidativa celular.
                </p>
                <div className="p-2 bg-[#FAF7F2] rounded border border-[#E8DFC9] text-[10px] text-[#556457]">
                  <strong>Conduta sugerida:</strong> Bisglicinato de magnésio 250mg ao deitar, D3 4000 UI com K2 no almoço, e ferro quelato microencapsulado.
                </div>
              </div>
            </div>

            {/* Patient's Continuous Medication Alert Banner */}
            <div className="p-4 bg-[#F5EFE6] rounded-xl border border-[#D8CEBE] space-y-2">
              <span className="text-xs font-bold text-[#8C4E3C] uppercase tracking-wider block">
                Fármacos Ativos da Paciente a serem Respeitados na Prescrição:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {anamnesis.continuousMedications.map((med) => (
                  <div key={med.id} className="bg-white p-3 rounded-lg border border-[#DCD3C5]">
                    <strong className="text-[#1F2B20] block">{med.name} ({med.dosage})</strong>
                    <span className="text-[11px] text-[#69786A] block mt-0.5">Uso: {med.frequency} · Motivo: {med.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDITORIA DE INTERAÇÕES FARMACOLÓGICAS */}
      {activeTab === 'interacoes' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-rose-800">
                Segurança do Paciente & Farmacovigilância
              </span>
              <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
                Cruzamento Ativo de Medicamentos vs. Fitoterápicos
              </h2>
              <p className="text-xs sm:text-sm text-[#4F5D51] mt-1 leading-relaxed">
                O app rastreia os princípios ativos prescritos contra as medicações de uso contínuo da paciente e destaca contraindicações formais para sua decisão clínica.
              </p>
            </div>

            <div className="space-y-4">
              {DRUG_HERB_INTERACTIONS_DB.map((inter) => {
                const isRelevantToPatient = anamnesis.continuousMedications.some(m =>
                  m.name.toLowerCase().includes('levotiroxina') && inter.drug.toLowerCase().includes('levotiroxina') ||
                  m.name.toLowerCase().includes('sertralina') && inter.drug.toLowerCase().includes('sertralina')
                );

                return (
                  <div
                    key={inter.id}
                    className={`p-4 sm:p-5 rounded-xl border text-xs space-y-2.5 transition-all ${
                      isRelevantToPatient
                        ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-200'
                        : 'bg-white border-[#DCD1C0]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${isRelevantToPatient ? 'text-rose-700' : 'text-amber-600'}`} />
                        <span className="font-bold text-[#1F2B20] text-sm">
                          {inter.drug} ↔ {inter.herbOrNutrient}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isRelevantToPatient && (
                          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                            Presente na Paciente
                          </span>
                        )}
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          Severidade: {inter.severity}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#414E43] leading-relaxed">
                      <strong>Mecanismo Farmacológico:</strong> {inter.mechanism}
                    </p>
                    <p className="text-[11px] text-rose-900">
                      <strong>Efeito Clínico Adverso:</strong> {inter.clinicalEffect}
                    </p>
                    <div className="p-3 bg-white rounded-lg border border-[#D5CCBE] text-[11px] text-[#2C3E2D]">
                      <strong>Conduta Clínica Recomendada:</strong> {inter.actionRequired}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EDITOR CLÍNICO DE FÓRMULAS & DOSAGENS */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#8C4E3C]">
                Personalização Técnica
              </span>
              <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
                Validação & Edição de Fórmulas e Suplementos
              </h2>
              <p className="text-xs sm:text-sm text-[#4F5D51] mt-1 leading-relaxed">
                Você tem autonomia para ativar, desativar ou ajustar a posologia de cada item terapêutico antes de assinar.
              </p>
            </div>

            {/* Suplementos */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#1F2B20] uppercase tracking-wider">
                Suplementação Nutracêutica
              </h3>

              {plan.supplementation.map((sup) => (
                <div
                  key={sup.id}
                  className="p-4 bg-white rounded-xl border border-[#D9CFBF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <strong className="text-[#1F2B20] block text-sm">{sup.name}</strong>
                    <span className="text-[#8C4E3C] font-semibold">{sup.dosage}</span>
                    <span className="text-[#647466] block">Horário: {sup.timing}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleValidation('supplement', sup.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        sup.validated
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {sup.validated ? '✓ Item Validado' : '✕ Bloqueado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Fórmulas de Apoio Metabólico */}
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold text-[#8C4E3C] uppercase tracking-wider">
                Fórmulas Botânicas Magistrais
              </h3>

              {plan.phytotherapy.metabolicFormulas.map((form) => (
                <div
                  key={form.id}
                  className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-[#1F2B20] block text-sm">{form.title}</strong>
                      <span className="text-[#8C4E3C] font-medium">Categoria: {form.category.replace(/_/g, ' ')}</span>
                    </div>

                    <button
                      onClick={() => handleToggleValidation('formula', form.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        form.validated
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {form.validated ? '✓ Fórmula Aprovada' : '✕ Retida'}
                    </button>
                  </div>

                  <p className="text-[#556457]">
                    <strong>Posologia:</strong> {form.posology}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSINATURA DIGITAL & LIBERAÇÃO DO PLANO */}
      {activeTab === 'assinatura' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-emerald-800">
                Responsabilidade Técnica & Validação Final
              </span>
              <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
                Chancela e Assinatura Eletrônica Profissional
              </h2>
              <p className="text-xs sm:text-sm text-[#4F5D51] mt-1 leading-relaxed">
                Ao assinar digitalmente, o protocolo completo será liberado no aplicativo da paciente com as devidas orientações e receituário formal.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-[#D9CFBF] space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2B20] mb-1.5">
                  Parecer Clínico Final & Observações para a Paciente:
                </label>
                <textarea
                  rows={4}
                  value={customAuditNote}
                  onChange={e => setCustomAuditNote(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2] text-[#2C3E2D]"
                />
              </div>

              <div className="p-4 bg-[#F2EDE5] rounded-lg border border-[#DCD1BF] text-xs text-[#4F5D51] space-y-1">
                <div className="flex items-center gap-2 text-[#1F2B20] font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Identificação do Profissional Responsável
                </div>
                <p>Nome: <strong>{plan.professionalName}</strong></p>
                <p>Titulação: {plan.professionalTitle}</p>
                <p>Registro Profissional: <strong>{plan.professionalRegistry}</strong></p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#6B796D]">
                  {isSigned ? (
                    <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Protocolo já assinado e liberado em: {new Date(plan.signedAt || '').toLocaleDateString('pt-BR')}
                    </span>
                  ) : (
                    <span>Aguardando chancela para liberação ao paciente.</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSignAndRelease}
                    disabled={isSigning}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isSigning ? 'Processando Assinatura...' : isSigned ? 'Atualizar Assinatura' : 'Assinar & Liberar Protocolo'}
                  </button>

                  <button
                    onClick={onSwitchToPatientView}
                    className="px-4 py-2.5 rounded-xl border border-[#2C3E2D] text-[#2C3E2D] hover:bg-[#FAF7F2] font-semibold text-xs transition-colors"
                  >
                    Ver como Paciente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EVOLUÇÃO LONGITUDINAL DO PACIENTE */}
      {activeTab === 'evolucao' && evolutionData && onAddCheckIn && (
        <EvolutionChart data={evolutionData} onAddCheckIn={onAddCheckIn} />
      )}
    </div>
  );
};
