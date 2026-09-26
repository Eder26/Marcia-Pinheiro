/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LegalNoticeBanner } from './components/LegalNoticeBanner';
import { HeroLanding } from './components/HeroLanding';
import { AnamnesisForm } from './components/AnamnesisForm';
import { PatientPlanView } from './components/PatientPlanView';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { FoodAndSymptomDiary } from './components/FoodAndSymptomDiary';
import { ChatWithProfessional } from './components/ChatWithProfessional';
import { VideoConsultationModal } from './components/VideoConsultationModal';
import { SubscriptionPlansModal } from './components/SubscriptionPlansModal';
import { PrintPrescriptionModal } from './components/PrintPrescriptionModal';
import { EvolutionChart } from './components/EvolutionChart';
import { ReminderSettings } from './components/ReminderSettings';

import {
  UserRole,
  AnamnesisData,
  ClinicalPlan,
  FoodDiaryEntry,
  ChatMessage,
  PricingPlan,
  WeeklyEvolutionData,
  PatientReminderSettings
} from './types/clinical';

import {
  INITIAL_ANAMNESIS,
  INITIAL_CLINICAL_PLAN,
  INITIAL_FOOD_DIARY,
  INITIAL_CHAT,
  PRICING_PLANS,
  INITIAL_EVOLUTION_DATA,
  DEFAULT_REMINDER_SETTINGS
} from './data/mockClinicalData';

import { playSoothingChime, sendBrowserNotification } from './utils/notificationSound';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [activeTab, setActiveTab] = useState<string>('inicio');
  
  // Clinical States
  const [anamnesis, setAnamnesis] = useState<AnamnesisData>(INITIAL_ANAMNESIS);
  const [clinicalPlan, setClinicalPlan] = useState<ClinicalPlan>(INITIAL_CLINICAL_PLAN);
  const [diaryEntries, setDiaryEntries] = useState<FoodDiaryEntry[]>(INITIAL_FOOD_DIARY);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [evolutionData, setEvolutionData] = useState<WeeklyEvolutionData[]>(INITIAL_EVOLUTION_DATA);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(PRICING_PLANS[2]); // Plano Equilíbrio
  const [reminderSettings, setReminderSettings] = useState<PatientReminderSettings>(() => {
    try {
      const saved = localStorage.getItem('flora_remedia_reminders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_REMINDER_SETTINGS;
  });

  // Background reminder scheduler
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
      const currentDayOfWeek = now.getDay();

      // Check quiet hours
      if (reminderSettings.quietHoursEnabled) {
        const [startH, startM] = reminderSettings.quietHoursStart.split(':').map(Number);
        const [endH, endM] = reminderSettings.quietHoursEnd.split(':').map(Number);
        const currentMinutesVal = currentHour * 60 + currentMinutes;
        const startMinutesVal = startH * 60 + startM;
        const endMinutesVal = endH * 60 + endM;

        const isQuiet = startMinutesVal > endMinutesVal
          ? currentMinutesVal >= startMinutesVal || currentMinutesVal < endMinutesVal
          : currentMinutesVal >= startMinutesVal && currentMinutesVal < endMinutesVal;

        if (isQuiet) return;
      }

      // Check active reminders
      reminderSettings.reminders.forEach(rem => {
        if (rem.enabled && rem.time === currentTimeStr && rem.daysOfWeek.includes(currentDayOfWeek)) {
          const triggeredKey = `rem_fired_${rem.id}_${currentTimeStr}_${now.toDateString()}`;
          if (!sessionStorage.getItem(triggeredKey)) {
            sessionStorage.setItem(triggeredKey, 'true');
            if (reminderSettings.soundEnabled) playSoothingChime();
            if (reminderSettings.browserNotificationsEnabled) {
              sendBrowserNotification(`Lembrete: ${rem.title}`, {
                body: `${rem.dosageOrVolume} · ${rem.instructions}`
              });
            }
          }
        }
      });
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [reminderSettings]);

  // Modals
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Handlers
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'patient') {
      setActiveTab('plano');
    } else {
      setActiveTab('dashboard_pro');
    }
  };

  const handleSaveAnamnesis = (updatedData: AnamnesisData) => {
    setAnamnesis(updatedData);
    setClinicalPlan(prev => ({
      ...prev,
      patientName: updatedData.fullName || 'Paciente'
    }));
  };

  const handleUpdatePlan = (updatedPlan: ClinicalPlan) => {
    setClinicalPlan(updatedPlan);
  };

  const handleToggleSupplement = (supplementId: string) => {
    setClinicalPlan(prev => ({
      ...prev,
      supplementation: prev.supplementation.map(sup =>
        sup.id === supplementId ? { ...sup, takenToday: !sup.takenToday } : sup
      )
    }));
  };

  const handleAddDiaryEntry = (newEntry: FoodDiaryEntry) => {
    setDiaryEntries(prev => [newEntry, ...prev]);
  };

  const handleAddCheckIn = (newCheckIn: WeeklyEvolutionData) => {
    setEvolutionData(prev => [...prev, newCheckIn]);
    setAnamnesis(prev => ({
      ...prev,
      weightKg: newCheckIn.weightKg
    }));
  };

  const handleUpdateReminderSettings = (newSettings: PatientReminderSettings) => {
    setReminderSettings(newSettings);
    try {
      localStorage.setItem('flora_remedia_reminders', JSON.stringify(newSettings));
    } catch (e) {
      // ignore
    }
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'patient',
      text,
      timestamp: 'Agora'
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Simulated clinical response from Naturopata Marcia R Pinheiro de Moura
    setTimeout(() => {
      let replyText = 'Recebido! Suas anotações no diário alimentar foram sincronizadas com o seu prontuário clínico.';
      if (text.toLowerCase().includes('chá') || text.toLowerCase().includes('gelado')) {
        replyText = 'Pode tomar o chá gelado sim! Faça a infusão morna para extrair os óleos essenciais da planta e depois resfrie com pedras de gelo. Evite apenas adoçar.';
      } else if (text.toLowerCase().includes('desconforto') || text.toLowerCase().includes('gástrico')) {
        replyText = 'Anotei seu relato de desconforto gástrico. Tome a infusão de espinheira santa 15 min antes das refeições e certifique-se de que a Levotiroxina foi ingerida em jejum com água morna pura.';
      } else if (text.toLowerCase().includes('farmácia') || text.toLowerCase().includes('manipula')) {
        replyText = 'As farmácias parceiras já possuem acesso à fórmula magistral assinada (Hash WL-AUT-89F3). Se precisar, você também pode baixar o receituário em PDF.';
      }

      const autoReply: ChatMessage = {
        id: `msg_reply_${Date.now()}`,
        sender: 'professional',
        text: replyText,
        timestamp: 'Poucos segundos atrás'
      };
      setChatMessages(prev => [...prev, autoReply]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#242A24] flex flex-col font-sans">
      {/* 1. Legal Compliance Banner */}
      <LegalNoticeBanner />

      {/* 2. Top Navigation conforming to Top Bar Contract */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenPlans={() => setIsPlansModalOpen(true)}
        onStartVideoCall={() => setIsVideoModalOpen(true)}
      />

      {/* 3. Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* LANDING / INÍCIO */}
        {activeTab === 'inicio' && (
          <HeroLanding
            onStartAnamnesis={() => setActiveTab('prontuario')}
            onViewPlan={() => setActiveTab('plano')}
            onOpenPlans={() => setIsPlansModalOpen(true)}
            onOpenVideoCall={() => setIsVideoModalOpen(true)}
            onOpenProfessionalPortal={() => {
              setCurrentRole('professional');
              setActiveTab('dashboard_pro');
            }}
          />
        )}

        {/* PATIENT VIEWS */}
        {currentRole === 'patient' && (
          <>
            {activeTab === 'plano' && (
              <PatientPlanView
                plan={clinicalPlan}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
                onToggleSupplementTaken={handleToggleSupplement}
                evolutionData={evolutionData}
                onAddCheckIn={handleAddCheckIn}
                onOpenReminders={() => setActiveTab('lembretes')}
              />
            )}

            {activeTab === 'prontuario' && (
              <AnamnesisForm
                initialData={anamnesis}
                onSave={handleSaveAnamnesis}
              />
            )}

            {activeTab === 'diario' && (
              <FoodAndSymptomDiary
                entries={diaryEntries}
                onAddEntry={handleAddDiaryEntry}
                dailyWaterGoalMl={clinicalPlan.nutritionalGuidelines.hydrationGoalMl}
              />
            )}

            {activeTab === 'evolucao' && (
              <div className="space-y-6">
                <EvolutionChart
                  data={evolutionData}
                  onAddCheckIn={handleAddCheckIn}
                />
              </div>
            )}

            {activeTab === 'lembretes' && (
              <ReminderSettings
                settings={reminderSettings}
                onUpdateSettings={handleUpdateReminderSettings}
                patientName={clinicalPlan.patientName}
              />
            )}

            {activeTab === 'chat' && (
              <ChatWithProfessional
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                professionalName={clinicalPlan.professionalName}
                professionalTitle={clinicalPlan.professionalTitle}
              />
            )}
          </>
        )}

        {/* PROFESSIONAL WORKSTATION VIEWS */}
        {currentRole === 'professional' && (
          <>
            {activeTab === 'dashboard_pro' && (
              <ProfessionalDashboard
                plan={clinicalPlan}
                anamnesis={anamnesis}
                onUpdatePlan={handleUpdatePlan}
                onOpenVideoCall={() => setIsVideoModalOpen(true)}
                onOpenPrintModal={() => setIsPrintModalOpen(true)}
                onSwitchToPatientView={() => {
                  setCurrentRole('patient');
                  setActiveTab('plano');
                }}
                evolutionData={evolutionData}
                onAddCheckIn={handleAddCheckIn}
              />
            )}

            {activeTab === 'prontuario_paciente' && (
              <div className="space-y-4">
                <div className="p-4 bg-[#F2EDE5] rounded-xl border border-[#D7CCBC] flex items-center justify-between text-xs">
                  <span>Modo de Inspeção Clínica: Visualizando o prontuário completo submetido pela paciente.</span>
                  <button
                    onClick={() => setActiveTab('dashboard_pro')}
                    className="font-bold text-[#8C4E3C] hover:underline"
                  >
                    Voltar para Central Clínica →
                  </button>
                </div>
                <AnamnesisForm
                  initialData={anamnesis}
                  onSave={handleSaveAnamnesis}
                  readOnly={false}
                />
              </div>
            )}

            {activeTab === 'prescricao_fitoterapica' && (
              <div className="space-y-4">
                <div className="p-4 bg-[#F2EDE5] rounded-xl border border-[#D7CCBC] flex items-center justify-between text-xs">
                  <span>Validador Oficial de Protocolos Fitoterápicos e Fórmulas de Saciedade.</span>
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="font-bold text-[#2C3E2D] hover:underline"
                  >
                    Visualizar Impressão / PDF →
                  </button>
                </div>
                <PatientPlanView
                  plan={clinicalPlan}
                  onOpenPrintModal={() => setIsPrintModalOpen(true)}
                  onToggleSupplementTaken={handleToggleSupplement}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <SubscriptionPlansModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
        onSelectPlan={(p) => {
          setSelectedPlan(p);
          setIsPlansModalOpen(false);
        }}
      />

      <VideoConsultationModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        anamnesis={anamnesis}
        plan={clinicalPlan}
      />

      <PrintPrescriptionModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        plan={clinicalPlan}
      />

      {/* Clean Unboxed Footer */}
      <footer className="border-t border-[#2C3E2D]/10 bg-[#FAF7F2] py-8 text-xs text-[#6A786C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-title font-semibold text-sm text-[#1F2B20]">
              Wellness Longevidade
            </span>
            <span aria-hidden="true">·</span>
            <span>Naturopatia, Nutrição Funcional & Fitoterapia Aplicada</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Resp. Técnica: Naturopata Marcia R Pinheiro de Moura (CRTH-BR 1892 / CRN-3 48.910)</span>
            <span aria-hidden="true">·</span>
            <span>Termos de Uso</span>
            <span aria-hidden="true">·</span>
            <span>Privacidade LGPD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
