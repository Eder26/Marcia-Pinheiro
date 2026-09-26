import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

export const LegalNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#F4ECE3] border-b border-[#E3D6C5] text-[#4A4237] text-xs py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8C4E3C] shrink-0" />
          <p className="leading-snug">
            <span className="font-semibold text-[#2D261E]">Aviso Clínico e Diretrizes de Compliance:</span>{' '}
            Esta plataforma é ferramenta de apoio ao raciocínio clínico em naturopatia, nutrição funcional e fitoterapia.
            Não substitui diagnóstico médico. Protocolos, fitoterápicos e fórmulas metabólicas são liberados apenas após validação e assinatura por profissional habilitado com verificação ativa de interações medicamentosas. (Em conformidade com a LGPD e conselhos profissionais).
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#7A6E5F] hover:text-[#2D261E] p-1 shrink-0 rounded transition-colors"
          title="Minimizar aviso"
          aria-label="Fechar aviso"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
