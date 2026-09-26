import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { ChatMessage } from '../types/clinical';

interface ChatWithProfessionalProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  professionalName: string;
  professionalTitle: string;
}

export const ChatWithProfessional: React.FC<ChatWithProfessionalProps> = ({
  messages,
  onSendMessage,
  professionalName,
  professionalTitle,
}) => {
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'Posso tomar o chá gelado nos dias quentes?',
    'Sentindo leve desconforto gástrico à tarde',
    'Dúvida sobre a farmácia de manipulação parceira',
    'Posso trocar o mamão do café por mirtilos?'
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Header */}
      <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#2C3E2D] flex items-center justify-center text-white font-serif-title text-sm font-semibold border-2 border-[#D3B474]">
            {professionalName.replace(/Naturopata\s*|Dra\.\s*|Dr\.\s*/gi, '').trim().split(' ').slice(0, 2).map(n => n[0]).join('') || 'MP'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-serif-title font-bold text-[#1F2B20]">
                {professionalName}
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            </div>
            <p className="text-[11px] text-[#556457]">
              {professionalTitle} · Resposta média em 2 horas úteis
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Canal Criptografado & LGPD</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="bg-white border border-[#2C3E2D]/10 rounded-2xl p-5 sm:p-6 shadow-xs h-[480px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isPatient = m.sender === 'patient';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isPatient
                    ? 'bg-[#2C3E2D] text-[#FAF7F2] rounded-tr-xs'
                    : m.isClinicalNote
                    ? 'bg-[#F6EFEA] border border-[#E3D1C8] text-[#34241F] rounded-tl-xs'
                    : 'bg-[#F2EDE5] text-[#242F26] rounded-tl-xs border border-[#DDD3C3]'
                }`}
              >
                {!isPatient && (
                  <span className="text-[10px] font-bold text-[#8C4E3C] uppercase tracking-wider block mb-1">
                    {m.isClinicalNote ? 'Aviso Clínico Obrigatório' : professionalName}
                  </span>
                )}
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span className={`block text-[9px] mt-1.5 font-mono ${
                  isPatient ? 'text-[#BFD1C1]' : 'text-[#7D8C7F]'
                }`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
        <span className="text-[11px] text-[#637265] shrink-0 font-medium">Perguntas Rápidas:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(p)}
            className="px-2.5 py-1 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2] hover:bg-[#F2ECE3] text-[11px] text-[#344236] whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Envie sua mensagem sobre receitas, sintomas ou manipulação..."
          className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#D5CCBE] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2C3E2D]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-5 py-3 rounded-xl bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-bold transition-colors shadow-xs disabled:opacity-40 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enviar</span>
        </button>
      </form>
    </div>
  );
};
