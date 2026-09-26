import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Maximize2,
  FileText,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Clock,
  User,
  AlertTriangle
} from 'lucide-react';
import { AnamnesisData, ClinicalPlan } from '../types/clinical';

interface VideoConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  anamnesis: AnamnesisData;
  plan: ClinicalPlan;
}

export const VideoConsultationModal: React.FC<VideoConsultationModalProps> = ({
  isOpen,
  onClose,
  anamnesis,
  plan,
}) => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [seconds, setSeconds] = useState(145); // started 2m25s ago
  const [activeTab, setActiveTab] = useState<'prontuario' | 'medicamentos' | 'notas'>('prontuario');
  const [liveNotes, setLiveNotes] = useState('Paciente relata excelente adaptação ao desjejum proteico. Queixa de fissura por doces às 17h praticamente zerada após o sachê de Gymnema com Psyllium.');

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-6xl h-[92vh] rounded-3xl border border-[#2C3E2D]/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Video Header */}
        <div className="bg-[#1F2B20] text-[#FAF7F2] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <div>
              <span className="text-xs uppercase font-bold text-[#D3B474] tracking-wider block">
                Teleconsulta Integrativa em Andamento
              </span>
              <span className="text-sm font-serif-title font-semibold">
                {plan.professionalName} ↔ {anamnesis.fullName || 'Paciente'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full text-xs font-mono text-[#D7E3D8]">
              <Clock className="w-3.5 h-3.5 text-[#D3B474]" />
              <span>{formatTime(seconds)}</span>
            </div>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Encerrar Consulta</span>
            </button>
          </div>
        </div>

        {/* Main Body: Video Feed (Left) & Live Chart (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Video Stream Area (7 cols on desktop) */}
          <div className="lg:col-span-7 bg-[#141C15] p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Main Stage (Doctor) */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center">
              {videoEnabled ? (
                <img
                  src="/src/assets/images/professional_naturopath_avatar_1790386705712.jpg"
                  alt={`${plan.professionalName} em teleconsulta`}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center text-white/60 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center">
                    <User className="w-8 h-8 text-white/50" />
                  </div>
                  <p className="text-xs">Câmera da profissional desligada</p>
                </div>
              )}

              {/* Doctor Label overlay */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold">{plan.professionalName}</span>
                <span className="text-[10px] text-white/60">({plan.professionalRegistry})</span>
              </div>

              {/* Patient Picture-in-Picture */}
              <div className="absolute top-3 right-3 w-36 h-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl bg-neutral-800">
                <div className="w-full h-full bg-gradient-to-tr from-[#2C3E2D] to-[#455D46] flex flex-col items-center justify-center text-white p-2 text-center">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs mb-1">
                    {anamnesis.fullName
                      ? anamnesis.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
                      : 'PA'}
                  </div>
                  <span className="text-[10px] font-semibold truncate w-full">
                    {anamnesis.fullName ? anamnesis.fullName.split(' ')[0] : 'Paciente'} (Você)
                  </span>
                  <span className="text-[8px] text-white/70">Áudio HD ativo</span>
                </div>
              </div>
            </div>

            {/* Video Action Controls Bar */}
            <div className="h-16 flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  micEnabled ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-rose-600 text-white'
                }`}
                title={micEnabled ? 'Silenciar microfone' : 'Ativar microfone'}
              >
                {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setVideoEnabled(!videoEnabled)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  videoEnabled ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-rose-600 text-white'
                }`}
                title={videoEnabled ? 'Desligar câmera' : 'Ligar câmera'}
              >
                {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="w-12 h-11 rounded-full bg-rose-700 hover:bg-rose-800 text-white flex items-center justify-center transition-colors"
                title="Desconectar da chamada"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Area: Clinical Live Chart (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF7F2] p-5 flex flex-col h-full border-t lg:border-t-0 lg:border-l border-[#2C3E2D]/12 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C3E2D]/10 pb-3">
              <span className="text-xs uppercase font-bold text-[#8C4E3C] tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Prontuário Simultâneo
              </span>
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setActiveTab('prontuario')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    activeTab === 'prontuario' ? 'bg-[#2C3E2D] text-white' : 'text-[#566558] hover:bg-[#EAE2D5]'
                  }`}
                >
                  Resumo
                </button>
                <button
                  onClick={() => setActiveTab('medicamentos')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    activeTab === 'medicamentos' ? 'bg-[#2C3E2D] text-white' : 'text-[#566558] hover:bg-[#EAE2D5]'
                  }`}
                >
                  Fármacos
                </button>
                <button
                  onClick={() => setActiveTab('notas')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    activeTab === 'notas' ? 'bg-[#2C3E2D] text-white' : 'text-[#566558] hover:bg-[#EAE2D5]'
                  }`}
                >
                  Anotações
                </button>
              </div>
            </div>

            {/* TAB CONTENT: Resumo */}
            {activeTab === 'prontuario' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#D5CCBE] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#718073]">Queixa Principal</span>
                  <p className="font-semibold text-[#1F2B20] capitalize">{anamnesis.mainGoal.replace(/_/g, ' ')}</p>
                  <p className="text-[11px] text-[#556457]">{anamnesis.goal30Days}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D5CCBE] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#718073]">Eixo Intestino-Cérebro</span>
                  <p className="text-[11px] text-[#3F4C41]">
                    Bristol Tipo <strong>{anamnesis.bristolScaleType}</strong> · Evacuação: {anamnesis.bowelFrequency.replace(/_/g, ' ')}
                  </p>
                  <p className="text-[10px] text-[#69796C] italic">{anamnesis.gutBrainMoodCorrelation}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D5CCBE] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#718073]">Sono & Estresse</span>
                  <p className="text-[11px] text-[#3F4C41]">
                    {anamnesis.sleepHoursPerNight}h sono/noite (Qualidade: {anamnesis.sleepQualityRating}/5) · Estresse: <strong>{anamnesis.stressLevel}/10</strong>
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Fármacos */}
            {activeTab === 'medicamentos' && (
              <div className="space-y-3 text-xs">
                <span className="text-[11px] text-[#8C4E3C] font-bold block">
                  Medicamentos Ativos a Proteger de Interações:
                </span>
                {anamnesis.continuousMedications.map(med => (
                  <div key={med.id} className="p-3 bg-white rounded-xl border border-[#D5CCBE] space-y-1">
                    <strong className="text-[#1F2B20] block">{med.name} ({med.dosage})</strong>
                    <span className="text-[11px] text-[#556457] block">Posologia: {med.frequency}</span>
                    <span className="text-[10px] text-[#8C4E3C] block font-medium">Motivo: {med.reason}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Anotações ao Vivo */}
            {activeTab === 'notas' && (
              <div className="space-y-3 text-xs flex-1 flex flex-col">
                <label className="text-[11px] font-semibold text-[#1F2B20]">
                  Evolução Clínica Registrada Durante a Chamada:
                </label>
                <textarea
                  rows={8}
                  value={liveNotes}
                  onChange={e => setLiveNotes(e.target.value)}
                  className="w-full flex-1 text-xs p-3 rounded-xl border border-[#D5CCBE] bg-white leading-relaxed text-[#2C3E2D]"
                />
                <span className="text-[10px] text-[#6A796D]">
                  As anotações são criptografadas e vinculadas ao laudo digital da consulta.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
