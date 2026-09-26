import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Heart,
  Brain,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { AnamnesisData, ContinuousMedication, BristolStoolType } from '../types/clinical';
import { BRISTOL_SCALE_DEFINITIONS } from '../data/mockClinicalData';

interface AnamnesisFormProps {
  initialData: AnamnesisData;
  onSave: (data: AnamnesisData) => void;
  readOnly?: boolean;
}

export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({
  initialData,
  onSave,
  readOnly = false,
}) => {
  const [formData, setFormData] = useState<AnamnesisData>(initialData);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Dynamic IMC calculation
  const heightM = formData.heightCm > 0 ? formData.heightCm / 100 : 1.7;
  const calculatedBmi = formData.weightKg > 0 ? +(formData.weightKg / (heightM * heightM)).toFixed(1) : 0;
  
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Abaixo do peso', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (bmi < 24.9) return { label: 'Eutrófico (Peso saudável)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bmi < 29.9) return { label: 'Sobrepeso (Atenção metabólica)', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    return { label: 'Obesidade funcional', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const bmiClassification = getBmiCategory(calculatedBmi);
  const idealHydrationGoal = Math.round(formData.weightKg * 35); // 35ml por kg

  const steps = [
    { id: 1, title: 'Dados Gerais & Rotina', icon: Activity },
    { id: 2, title: 'Histórico & Medicamentos', icon: ShieldCheck, mandatory: true },
    { id: 3, title: 'Hábitos Alimentares', icon: Heart },
    { id: 4, title: 'Digestão & Eixo Intestino-Cérebro', icon: Brain },
    { id: 5, title: 'Sono & Estresse', icon: Moon },
    { id: 6, title: 'Estilo de Vida & Ambiente', icon: Sun },
    { id: 7, title: 'Metas & Termo de Consentimento', icon: FileText }
  ];

  const handleMedicationChange = (id: string, field: keyof ContinuousMedication, value: string) => {
    setFormData(prev => ({
      ...prev,
      continuousMedications: prev.continuousMedications.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleAddMedication = () => {
    const newMed: ContinuousMedication = {
      id: `med_${Date.now()}`,
      name: '',
      dosage: '',
      frequency: '',
      reason: ''
    };
    setFormData(prev => ({
      ...prev,
      continuousMedications: [...prev.continuousMedications, newMed]
    }));
  };

  const handleRemoveMedication = (id: string) => {
    setFormData(prev => ({
      ...prev,
      continuousMedications: prev.continuousMedications.filter(med => med.id !== id)
    }));
  };

  const handleSaveForm = () => {
    onSave({
      ...formData,
      completedAt: new Date().toISOString()
    });
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header with Title and Autosave status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C3E2D]/10 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4E3C]">
            Avaliação Integrativa Inicial
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#1F2B20]">
            Prontuário Digital & Anamnese Clínica
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6B5E] mt-0.5">
            Dados clínicos aprofundados para nortear o diagnóstico funcional e garantir segurança farmacológica.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccessNotice && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Prontuário salvo e sincronizado
            </span>
          )}
          {!readOnly && (
            <button
              onClick={handleSaveForm}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2C3E2D] hover:bg-[#384F39] rounded-lg transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Alterações
            </button>
          )}
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 bg-[#F0EAE1] p-1.5 rounded-xl border border-[#DED4C5]">
        {steps.map(step => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-[#FAF7F2] text-[#1F2B20] font-semibold shadow-xs border border-[#C5A059]/40'
                  : 'text-[#616E63] hover:text-[#1F2B20] hover:bg-[#FAF7F2]/60'
              }`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs ${
                isActive ? 'bg-[#2C3E2D] text-[#FAF7F2]' : 'bg-[#DDD5C7] text-[#4F5D51]'
              }`}>
                {step.id}
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] truncate leading-tight">
                  {step.title}
                </span>
                {step.mandatory && (
                  <span className="text-[9px] text-[#A64630] font-bold block leading-none">
                    Obrigatório
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Form Body Container */}
      <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* STEP 1: DADOS GERAIS */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-[#2C3E2D]/10 pb-3">
              <h2 className="text-lg font-serif-title font-semibold text-[#1F2B20]">
                1. Dados Gerais & Biometria Funcional
              </h2>
              <p className="text-xs text-[#5C6B5E]">
                Informações antropométricas básicas com cálculo automático do Índice de Massa Corporal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  E-mail de Contato
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Idade (anos)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Gênero
                </label>
                <select
                  value={formData.gender}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                >
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro_nao_dizer">Prefiro não declarar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Profissão & Carga Horária
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={formData.heightCm}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Peso Atual (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weightKg}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                />
              </div>

              {/* Dynamic IMC Box */}
              <div className="p-3 bg-[#F2ECE3] rounded-lg border border-[#DCD3C5] flex flex-col justify-center">
                <div className="flex items-center justify-between text-xs text-[#505D52] mb-1">
                  <span>IMC Calculado</span>
                  <span className="font-mono tabular-nums font-bold text-sm text-[#1F2B20]">
                    {calculatedBmi} kg/m²
                  </span>
                </div>
                <div className={`text-[11px] font-semibold px-2 py-0.5 rounded border inline-block ${bmiClassification.color}`}>
                  {bmiClassification.label}
                </div>
                <span className="text-[10px] text-[#69786B] mt-1">
                  Meta hídrica estimada: <strong className="font-mono tabular-nums">{idealHydrationGoal} mL/dia</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Objetivo Principal com o Acompanhamento
                </label>
                <select
                  value={formData.mainGoal}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, mainGoal: e.target.value as any })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                >
                  <option value="energia_disposicao">Energia & Disposição Mitocondrial</option>
                  <option value="digestao_saude_intestinal">Saúde Digestiva & Modulação Intestinal</option>
                  <option value="emagrecimento">Emagrecimento & Apoio Metabólico</option>
                  <option value="sono_estresse">Sono Reparador & Gestão do Estresse</option>
                  <option value="equilibrio_hormonal">Equilíbrio Hormonal & TPM</option>
                  <option value="longevidade_antienvelhecimento">Longevidade Ativa & Medicina do Estilo de Vida</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Nível de Atividade Física Atual
                </label>
                <select
                  value={formData.physicalActivityLevel}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, physicalActivityLevel: e.target.value as any })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                >
                  <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                  <option value="leve">Leve (1 a 2x por semana)</option>
                  <option value="moderado">Moderado (3 a 4x por semana)</option>
                  <option value="intenso">Intenso (5x ou mais por semana)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                Descrição da sua rotina diária típica (horários de despertar, refeições, trabalho)
              </label>
              <textarea
                rows={3}
                value={formData.dailyRoutine}
                disabled={readOnly}
                onChange={e => setFormData({ ...formData, dailyRoutine: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
                placeholder="Ex: Acordo às 06h30, trabalho das 08h às 18h..."
              />
            </div>
          </div>
        )}

        {/* STEP 2: HISTÓRICO DE SAÚDE & MEDICAMENTOS CONTÍNUOS (CRITICAL) */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-[#2C3E2D]/10 pb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-serif-title font-semibold text-[#1F2B20]">
                    2. Histórico Clínico & Medicamentos Contínuos
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                    Obrigatório
                  </span>
                </div>
                <p className="text-xs text-[#5C6B5E] mt-0.5">
                  O preenchimento preciso dos medicamentos em uso é essencial para a verificação cruzada de interações com plantas medicinais e nutrientes.
                </p>
              </div>
            </div>

            {/* Continuous Medications Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1F2B20] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C86D51]" />
                  Medicamentos em Uso Contínuo (Farmacoterapia Ativa)
                </label>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="flex items-center gap-1.5 text-xs text-[#2C3E2D] font-medium hover:text-[#182319] bg-[#EAE2D5] px-2.5 py-1 rounded-md transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Medicamento
                  </button>
                )}
              </div>

              {formData.continuousMedications.length === 0 ? (
                <div className="p-4 bg-[#F5EFE6] rounded-lg border border-dashed border-[#D5CCBE] text-center text-xs text-[#6B786D]">
                  Nenhum medicamento contínuo adicionado. Se utiliza remédios de prescrição ou regulares (anti-hipertensivos, hormônios tireoidianos, ansiolíticos, etc.), clique em "Adicionar Medicamento".
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.continuousMedications.map((med, index) => (
                    <div
                      key={med.id}
                      className="p-3.5 bg-white rounded-lg border border-[#D5CCBE] grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
                    >
                      <div>
                        <span className="block text-[10px] text-[#6E7C70] mb-0.5">Nome do Fármaco</span>
                        <input
                          type="text"
                          disabled={readOnly}
                          value={med.name}
                          onChange={e => handleMedicationChange(med.id, 'name', e.target.value)}
                          placeholder="Ex: Levotiroxina"
                          className="w-full text-xs px-2.5 py-1.5 border border-[#D5CCBE] rounded bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#6E7C70] mb-0.5">Dosagem</span>
                        <input
                          type="text"
                          disabled={readOnly}
                          value={med.dosage}
                          onChange={e => handleMedicationChange(med.id, 'dosage', e.target.value)}
                          placeholder="Ex: 50 mcg"
                          className="w-full text-xs px-2.5 py-1.5 border border-[#D5CCBE] rounded bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#6E7C70] mb-0.5">Frequência e Horário</span>
                        <input
                          type="text"
                          disabled={readOnly}
                          value={med.frequency}
                          onChange={e => handleMedicationChange(med.id, 'frequency', e.target.value)}
                          placeholder="Ex: 1x/dia em jejum"
                          className="w-full text-xs px-2.5 py-1.5 border border-[#D5CCBE] rounded bg-[#FAF7F2]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <span className="block text-[10px] text-[#6E7C70] mb-0.5">Motivo / Condição</span>
                          <input
                            type="text"
                            disabled={readOnly}
                            value={med.reason}
                            onChange={e => handleMedicationChange(med.id, 'reason', e.target.value)}
                            placeholder="Ex: Hipotireoidismo"
                            className="w-full text-xs px-2.5 py-1.5 border border-[#D5CCBE] rounded bg-[#FAF7F2]"
                          />
                        </div>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(med.id)}
                            className="text-[#964736] hover:text-[#5F2417] p-1.5 mt-3 transition-colors"
                            title="Remover medicamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Doenças já diagnosticadas pelo médico
                </label>
                <textarea
                  rows={2}
                  value={formData.diagnosedDiseases.join('; ')}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, diagnosedDiseases: e.target.value.split(';').map(s => s.trim()) })}
                  placeholder="Ex: Hipotireoidismo subclínico, Síndrome do Intestino Irritável..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                />
                <span className="text-[10px] text-[#718073]">Separe com ponto e vírgula (;)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Alergias e Intolerâncias conhecidas
                </label>
                <textarea
                  rows={2}
                  value={formData.knownAllergies}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, knownAllergies: e.target.value })}
                  placeholder="Ex: Intolerância à lactose, rinite sazonal, alergia a frutos do mar..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Cirurgias prévias e internações
                </label>
                <input
                  type="text"
                  value={formData.pastSurgeries}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, pastSurgeries: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Histórico familiar relevante
                </label>
                <input
                  type="text"
                  value={formData.familyHistory}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, familyHistory: e.target.value })}
                  placeholder="Ex: Diabetes, tireoide, hipertensão..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                Exames laboratoriais recentes (valores relevantes como TSH, Ferritina, Vit D, Glicemia)
              </label>
              <textarea
                rows={2}
                value={formData.recentExamNotes || ''}
                disabled={readOnly}
                onChange={e => setFormData({ ...formData, recentExamNotes: e.target.value })}
                placeholder="Ex: Exames de 45 dias: TSH 3.2, Ferritina 31, Vit D 24..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white"
              />
            </div>
          </div>
        )}

        {/* STEP 3: HÁBITOS ALIMENTARES */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-[#2C3E2D]/10 pb-3">
              <h2 className="text-lg font-serif-title font-semibold text-[#1F2B20]">
                3. Hábitos Alimentares & Recordatório de 24h
              </h2>
              <p className="text-xs text-[#5C6B5E]">
                Mapeamento do padrão alimentar usual para identificar gatilhos inflamatórios e carências funcionais.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1">
                  Café da manhã típico
                </label>
                <input
                  type="text"
                  value={formData.recall24hBreakfast}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, recall24hBreakfast: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1">
                  Almoço típico
                </label>
                <input
                  type="text"
                  value={formData.recall24hLunch}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, recall24hLunch: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1">
                  Lanche da tarde / Beliscos
                </label>
                <input
                  type="text"
                  value={formData.recall24hSnacks}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, recall24hSnacks: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1">
                  Jantar e Ceia
                </label>
                <input
                  type="text"
                  value={formData.recall24hDinner}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, recall24hDinner: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Consumo de Açúcar Refinado / Doces
                </label>
                <select
                  value={formData.sugarFrequency}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, sugarFrequency: e.target.value as any })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                >
                  <option value="raramente">Raramente</option>
                  <option value="1-2x_semana">1 a 2 vezes por semana</option>
                  <option value="diariamente">Diariamente</option>
                  <option value="multiplas_vezes_ao_dia">Múltiplas vezes ao dia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Relação com Fome Emocional & Compulsão
                </label>
                <select
                  value={formData.emotionalEatingPattern}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, emotionalEatingPattern: e.target.value as any })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                >
                  <option value="nenhum">Sem episódios notáveis</option>
                  <option value="fome_ansiosa_tarde">Fome ansiosa no meio/fim da tarde (16h-18h)</option>
                  <option value="compulsao_noturna">Compulsão e beliscos após o jantar</option>
                  <option value="beliscos_estresse">Beliscos contínuos associados a prazos/estresse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Consumo de Café (xícaras/dia)
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={formData.caffeineCupsPerDay}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, caffeineCupsPerDay: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                Ingestão Hídrica Média Atual (mL de água pura por dia)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="100"
                  value={formData.dailyHydrationMl}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, dailyHydrationMl: Number(e.target.value) })}
                  className="w-40 text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-white font-mono tabular-nums"
                />
                <span className="text-xs text-[#59695C]">
                  Sua meta ideal calculada pelo peso ({formData.weightKg}kg): <strong className="font-mono">{idealHydrationGoal} mL</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DIGESTÃO & EIXO INTESTINO-CÉREBRO (BRISTOL SCALE) */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-[#2C3E2D]/10 pb-3">
              <h2 className="text-lg font-serif-title font-semibold text-[#1F2B20]">
                4. Digestão & Eixo Intestino-Cérebro
              </h2>
              <p className="text-xs text-[#5C6B5E]">
                Avaliação da microbiota, consistência das fezes pela Escala de Bristol e sintomas digestivos associados ao humor.
              </p>
            </div>

            {/* Bristol Stool Scale Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2B20] mb-2">
                Escala de Bristol — Selecione o padrão mais comum das suas fezes:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {([1, 2, 3, 4, 5, 6, 7] as BristolStoolType[]).map(type => {
                  const item = BRISTOL_SCALE_DEFINITIONS[type];
                  const isSelected = formData.bristolScaleType === type;
                  const isIdeal = type === 4;
                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={readOnly}
                      onClick={() => setFormData({ ...formData, bristolScaleType: type })}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[#2C3E2D] bg-[#2C3E2D]/8 shadow-xs ring-1 ring-[#2C3E2D]'
                          : 'border-[#D9CFBF] bg-white hover:border-[#8E9B8F]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-[#1F2B20]">
                          Tipo {type}
                        </span>
                        {isIdeal && (
                          <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Padrão Ouro
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#425044] font-medium leading-tight mb-1">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-[#717F72] leading-tight">
                        {item.clinicalMeaning}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Frequência Intestinal Típica
                </label>
                <select
                  value={formData.bowelFrequency}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, bowelFrequency: e.target.value as any })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white"
                >
                  <option value="menos_3x_semana">Menos de 3 vezes por semana (Constipação crônica)</option>
                  <option value="1x_a_cada_2_dias">1 vez a cada 2 dias</option>
                  <option value="1x_ao_dia">1 vez ao dia (Regular)</option>
                  <option value="2-3x_ao_dia">2 a 3 vezes ao dia</option>
                  <option value="mais_3x_ao_dia">Mais de 3 vezes ao dia (Tendência diarreica)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Sintomas Digestivos Frequentes
                </label>
                <input
                  type="text"
                  value={formData.digestiveSymptoms.join(', ')}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, digestiveSymptoms: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="Ex: Inchaço, gases, refluxo, digestão lenta"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                Correlação Intestino-Cérebro: Você nota que a ansiedade, estresse ou preocupação alteram diretamente seu intestino ou digestão?
              </label>
              <textarea
                rows={2}
                value={formData.gutBrainMoodCorrelation}
                disabled={readOnly}
                onChange={e => setFormData({ ...formData, gutBrainMoodCorrelation: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white"
                placeholder="Descreva como o seu humor e o estresse afetam o estômago e o intestino..."
              />
            </div>
          </div>
        )}

        {/* STEP 5: SONO & ESTRESSE */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-[#2C3E2D]/10 pb-3">
              <h2 className="text-lg font-serif-title font-semibold text-[#1F2B20]">
                5. Sono Reparador & Nível de Estresse
              </h2>
              <p className="text-xs text-[#5C6B5E]">
                Mapeamento do ritmo circadiano, latência de sono e ativação do sistema nervoso parassimpático.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Média de Horas de Sono por Noite
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.sleepHoursPerNight}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, sleepHoursPerNight: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Qualidade Subjetiva do Sono (1 a 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      disabled={readOnly}
                      onClick={() => setFormData({ ...formData, sleepQualityRating: star as any })}
                      className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                        formData.sleepQualityRating === star
                          ? 'bg-[#2C3E2D] text-[#FAF7F2] border-[#2C3E2D]'
                          : 'bg-white text-[#4A574C] border-[#D5CCBE] hover:bg-[#F0EAE1]'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-[#718073] mt-1 block">1 = Muito Ruim (não repara) | 5 = Excelente e profundo</span>
              </div>
            </div>

            {/* Stress 0-10 Slider */}
            <div className="p-4 bg-[#F2EDE5] rounded-xl border border-[#D8CEBF]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#1F2B20]">
                  Nível de Estresse Percebido no Cotidiano (0 a 10)
                </label>
                <span className="font-mono font-bold text-base text-[#8C4E3C] tabular-nums">
                  {formData.stressLevel} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.stressLevel}
                disabled={readOnly}
                onChange={e => setFormData({ ...formData, stressLevel: Number(e.target.value) })}
                className="w-full accent-[#8C4E3C] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6E7B70] mt-1">
                <span>0: Serena e sem tensão</span>
                <span>5: Moderado</span>
                <span>10: Exaustão e estresse severo</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                Sintomas de Fadiga e Exaustão percebidos
              </label>
              <textarea
                rows={2}
                value={formData.exhaustionSymptoms.join('; ')}
                disabled={readOnly}
                onChange={e => setFormData({ ...formData, exhaustionSymptoms: e.target.value.split(';').map(s => s.trim()) })}
                placeholder="Ex: Cansaço matinal, queda de energia às 16h, insônia inicial..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white"
              />
            </div>
          </div>
        )}

        {/* STEP 6: ESTILO DE VIDA */}
        {activeStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-[#2C3E2D]/10 pb-3">
              <h2 className="text-lg font-serif-title font-semibold text-[#1F2B20]">
                6. Estilo de Vida & Fatores Ambientais
              </h2>
              <p className="text-xs text-[#5C6B5E]">
                Exposição solar, atividade física, tempo de tela e sincronização circadiana.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Atividade Física (modalidade e frequência semanal)
                </label>
                <input
                  type="text"
                  value={formData.exerciseTypeAndFrequency}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, exerciseTypeAndFrequency: e.target.value })}
                  placeholder="Ex: Pilates 2x na semana, caminhada..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Exposição Solar Semanal (minutos ao ar livre)
                </label>
                <input
                  type="number"
                  value={formData.sunExposureWeeklyMinutes}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, sunExposureWeeklyMinutes: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Tempo Diário em Telas / Dispositivos (horas)
                </label>
                <input
                  type="number"
                  value={formData.dailyScreenTimeHours}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, dailyScreenTimeHours: Number(e.target.value) })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                  Tabagismo
                </label>
                <select
                  value={formData.smokingStatus}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, smokingStatus: e.target.value as any })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white"
                >
                  <option value="nao_fumante">Não fumante</option>
                  <option value="ex_fumante">Ex-fumante</option>
                  <option value="fumante_ativo">Fumante ativo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                Ciclo Menstrual / Notas Hormonais (se aplicável)
              </label>
              <textarea
                rows={2}
                value={formData.hormonalCycleNotes || ''}
                disabled={readOnly}
                onChange={e => setFormData({ ...formData, hormonalCycleNotes: e.target.value })}
                placeholder="Ex: Ciclo regular de 28 dias; TPM com inchaço e muita compulsão por doces..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#D5CCBE] bg-white"
              />
            </div>
          </div>
        )}

        {/* STEP 7: METAS & CONSENTIMENTO */}
        {activeStep === 7 && (
          <div className="space-y-6">
            <div className="border-b border-[#2C3E2D]/10 pb-3">
              <h2 className="text-lg font-serif-title font-semibold text-[#1F2B20]">
                7. Metas Terapêuticas & Termo de Consentimento
              </h2>
              <p className="text-xs text-[#5C6B5E]">
                Definição clara de objetivos compartilhados e validação dos termos de responsabilidade mútua.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-white rounded-xl border border-[#D5CCBE]">
                <span className="text-xs font-bold text-[#8C4E3C] block mb-1">
                  Meta para os Primeiros 30 Dias
                </span>
                <textarea
                  rows={3}
                  value={formData.goal30Days}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, goal30Days: e.target.value })}
                  placeholder="Ex: Desinchar o abdômen e estabilizar intestino..."
                  className="w-full text-xs p-2 border border-[#E0D7C9] rounded bg-[#FAF7F2]"
                />
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#D5CCBE]">
                <span className="text-xs font-bold text-[#8C4E3C] block mb-1">
                  Meta para 90 Dias
                </span>
                <textarea
                  rows={3}
                  value={formData.goal90Days}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, goal90Days: e.target.value })}
                  placeholder="Ex: Eliminar compulsão vespertina e regular exames..."
                  className="w-full text-xs p-2 border border-[#E0D7C9] rounded bg-[#FAF7F2]"
                />
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#D5CCBE]">
                <span className="text-xs font-bold text-[#8C4E3C] block mb-1">
                  Visão de Longevidade (180 Dias)
                </span>
                <textarea
                  rows={3}
                  value={formData.goal180Days}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, goal180Days: e.target.value })}
                  placeholder="Ex: Autonomia nutricional e energia matinal diária..."
                  className="w-full text-xs p-2 border border-[#E0D7C9] rounded bg-[#FAF7F2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B473D] mb-1.5">
                Nível de Disponibilidade para Mudanças Graduais de Estilo de Vida
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['baixo', 'medio', 'alto'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    disabled={readOnly}
                    onClick={() => setFormData({ ...formData, changeReadiness: lvl })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                      formData.changeReadiness === lvl
                        ? 'bg-[#2C3E2D] text-[#FAF7F2] border-[#2C3E2D]'
                        : 'bg-white text-[#4D5A4F] border-[#D5CCBE] hover:bg-[#F2ECE3]'
                    }`}
                  >
                    Disponibilidade {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Informed Consent Agreement Box */}
            <div className="p-4 bg-[#F2EDE5] rounded-xl border border-[#D7CCBC] space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={formData.consentAgreed}
                  disabled={readOnly}
                  onChange={e => setFormData({ ...formData, consentAgreed: e.target.checked })}
                  className="mt-1 accent-[#2C3E2D] rounded w-4 h-4 cursor-pointer"
                />
                <label htmlFor="consentCheckbox" className="text-xs text-[#3E4940] leading-relaxed cursor-pointer">
                  <strong>Termo de Consentimento Informado & Diretrizes LGPD:</strong> Declaro que as informações fornecidas neste prontuário são verídicas, em especial quanto aos medicamentos contínuos e diagnósticos prévios. Estou ciente de que as orientações de naturopatia, nutrição funcional e fitoterapia têm finalidade de promoção da saúde e apoio complementar, não substituindo o acompanhamento ou diagnóstico médico. Concordo que minhas informações clínicas sejam acessadas exclusivamente pelo profissional responsável pelo meu plano.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Footer Buttons */}
        <div className="flex items-center justify-between border-t border-[#2C3E2D]/10 pt-5 mt-6">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4F5D51] hover:text-[#1F2B20] disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Etapa Anterior
          </button>

          <span className="text-xs text-[#718073]">
            Etapa <strong className="text-[#1F2B20]">{activeStep}</strong> de {steps.length}
          </span>

          {activeStep < steps.length ? (
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2C3E2D] hover:bg-[#3B523D] rounded-lg transition-colors shadow-xs"
            >
              Próxima Etapa
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            !readOnly && (
              <button
                type="button"
                onClick={handleSaveForm}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-[#FAF7F2] bg-[#8C4E3C] hover:bg-[#743C2D] rounded-lg transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finalizar e Sincronizar Prontuário
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
