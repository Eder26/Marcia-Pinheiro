import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Leaf,
  Sparkles
} from 'lucide-react';
import { ClinicalPlan } from '../types/clinical';

interface PrintPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ClinicalPlan;
}

export const PrintPrescriptionModal: React.FC<PrintPrescriptionModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-[#2C3E2D]/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Action bar (hidden on print) */}
        <div className="no-print px-6 py-4 border-b border-[#2C3E2D]/10 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C4E3C]">
              Visualização de Impressão & Exportação PDF
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#D3B474]" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#7A8A7D] hover:text-[#1F2B20] p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-[#1F2B20] space-y-6 print:p-0 font-sans">
          {/* Clinic & Doctor Letterhead */}
          <div className="border-b-2 border-[#2C3E2D] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-[#2C3E2D]" />
                <span className="text-2xl font-serif-title font-bold text-[#1F2B20] tracking-tight">
                  Wellness Longevidade
                </span>
              </div>
              <p className="text-xs text-[#526355]">
                Centro Clínico de Naturopatia, Nutrição Funcional e Fitoterapia Aplicada
              </p>
            </div>

            <div className="text-right text-xs text-[#4F5E52] space-y-0.5">
              <strong className="text-sm font-semibold text-[#1F2B20] block">
                {plan.professionalName}
              </strong>
              <p>{plan.professionalTitle}</p>
              <p className="font-mono text-[#8C4E3C] font-semibold">{plan.professionalRegistry}</p>
            </div>
          </div>

          {/* Patient Identification Strip */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#D5CCBE] text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-[#6E7E71] block">Paciente:</span>
              <strong className="text-sm text-[#1F2B20]">{plan.patientName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#6E7E71] block">Data de Emissão:</span>
              <span className="font-mono">{new Date(plan.signedAt || '').toLocaleDateString('pt-BR')}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6E7E71] block">Identificador do Protocolo:</span>
              <span className="font-mono text-[#8C4E3C] font-semibold">{plan.id}</span>
            </div>
          </div>

          {/* Functional Diagnosis Section */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-[#8C4E3C] tracking-wider border-b border-[#E0D7C9] pb-1">
              1. Diagnóstico Funcional & Conduta Terapêutica
            </h3>
            <p className="text-xs text-[#38453A] leading-relaxed">
              {plan.functionalDiagnosis.summary}
            </p>
          </div>

          {/* Supplementation Prescription */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold text-[#2C3E2D] tracking-wider border-b border-[#E0D7C9] pb-1">
              2. Prescrição Nutracêutica & Suplementação Individualizada
            </h3>
            <div className="space-y-2.5 text-xs">
              {plan.supplementation.map((sup, idx) => (
                <div key={sup.id} className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E2D8CA] space-y-1">
                  <div className="flex justify-between font-bold text-[#1F2B20]">
                    <span>{idx + 1}. {sup.name}</span>
                    <span className="text-[#8C4E3C]">{sup.dosage}</span>
                  </div>
                  <p className="text-[11px] text-[#556457]">
                    <strong>Horário / Posologia:</strong> {sup.timing}
                  </p>
                  <p className="text-[10px] text-[#6F7F72]">
                    <strong>Alvo Fisiológico:</strong> {sup.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Botanical Formulations */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold text-[#8C4E3C] tracking-wider border-b border-[#E0D7C9] pb-1">
              3. Formulações Magistrais em Fitoterapia & Apoio Metabólico
            </h3>
            <div className="space-y-3 text-xs">
              {plan.phytotherapy.metabolicFormulas.map((form) => (
                <div key={form.id} className="p-3 bg-white rounded-lg border border-[#D5CCBE] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm font-serif-title text-[#1F2B20]">{form.title}</strong>
                    <span className="text-[10px] uppercase font-bold text-[#8C4E3C]">{form.category.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-[11px] text-[#414E43]">
                    <strong>Composição Padronizada:</strong>{' '}
                    {form.botanicalIngredients.map(i => `${i.name} (${i.standardConcentration})`).join(' + ')}
                  </div>
                  <p className="text-[11px] text-[#8C4E3C] font-semibold">
                    Posologia: {form.posology}
                  </p>
                  <p className="text-[10px] text-[#69796C]">
                    Advertências: {form.warningsAndContraindications}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Medicinal Teas */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-[#2C3E2D] tracking-wider border-b border-[#E0D7C9] pb-1">
              4. Chás Medicinais & Infusões
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {plan.phytotherapy.teas.map((tea) => (
                <div key={tea.id} className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E2D8CA]">
                  <strong className="block text-[#1F2B20]">{tea.name}</strong>
                  <span className="text-[10px] text-[#556457] block">{tea.schedule}</span>
                  <p className="text-[10px] text-[#6C7B6E] mt-0.5">{tea.preparationMethod}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Compliance & Digital Signature Stamp */}
          <div className="pt-6 border-t-2 border-[#2C3E2D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Documento Assinado Eletronicamente
              </span>
              <p className="text-[10px] text-[#6B796D]">
                Em conformidade com a MP 2.200-2/2001 e normas do CRN/CRTH.
              </p>
              <code className="text-[9px] text-[#8C4E3C] font-mono block">
                Hash de Autenticação: {plan.digitalSignatureHash}
              </code>
            </div>

            <div className="text-center space-y-1">
              <div className="w-48 border-b border-[#1F2B20] pb-1 mx-auto font-serif-title italic font-bold text-sm text-[#1F2B20]">
                {plan.professionalName}
              </div>
              <span className="text-[10px] text-[#556457] block">
                {plan.professionalRegistry}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
