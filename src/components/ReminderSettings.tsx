import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Droplets,
  Leaf,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Moon,
  Info,
  Calendar,
  X,
  Play
} from 'lucide-react';
import { PatientReminderSettings, ReminderItem } from '../types/clinical';
import {
  playSoothingChime,
  requestBrowserNotificationPermission,
  sendBrowserNotification
} from '../utils/notificationSound';

interface ReminderSettingsProps {
  settings: PatientReminderSettings;
  onUpdateSettings: (newSettings: PatientReminderSettings) => void;
  patientName?: string;
}

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  settings,
  onUpdateSettings,
  patientName = 'Paciente',
}) => {
  const [localSettings, setLocalSettings] = useState<PatientReminderSettings>(settings);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Custom Reminder state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ReminderItem['category']>('fitoterapico');
  const [newTime, setNewTime] = useState('08:00');
  const [newDosage, setNewDosage] = useState('1 dose');
  const [newInstructions, setNewInstructions] = useState('');

  useEffect(() => {
    if ('Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleRequestPermission = async () => {
    const perm = await requestBrowserNotificationPermission();
    setBrowserPermission(perm);
    if (perm === 'granted') {
      showToast('Permissão de notificações concedida com sucesso!');
      if (localSettings.soundEnabled) playSoothingChime();
      sendBrowserNotification('Lembretes Ativados · Naturopata Marcia R Pinheiro de Moura', {
        body: 'Notificações de fitoterapia e hidratação sincronizadas com o seu perfil.',
      });
    } else if (perm === 'denied') {
      showToast('Permissão bloqueada no navegador. Habilite nas configurações do site.');
    }
  };

  const handleToggleBrowserNotif = (enabled: boolean) => {
    const updated = { ...localSettings, browserNotificationsEnabled: enabled };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    if (enabled && browserPermission !== 'granted') {
      handleRequestPermission();
    }
  };

  const handleToggleSound = (enabled: boolean) => {
    const updated = { ...localSettings, soundEnabled: enabled };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    if (enabled) {
      playSoothingChime();
    }
  };

  const handleToggleQuietHours = (enabled: boolean) => {
    const updated = { ...localSettings, quietHoursEnabled: enabled };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleQuietHoursChange = (start: string, end: string) => {
    const updated = {
      ...localSettings,
      quietHoursStart: start,
      quietHoursEnd: end
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleHydrationSettingChange = (field: 'hydrationFrequencyMinutes' | 'hydrationGlassVolumeMl' | 'hydrationGoalMl', val: number) => {
    const updated = { ...localSettings, [field]: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleReminderItem = (id: string) => {
    const updatedReminders = localSettings.reminders.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    const updated = { ...localSettings, reminders: updatedReminders };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleUpdateReminderTime = (id: string, newTimeStr: string) => {
    const updatedReminders = localSettings.reminders.map(item =>
      item.id === id ? { ...item, time: newTimeStr } : item
    );
    const updated = { ...localSettings, reminders: updatedReminders };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleReminderDay = (id: string, dayIndex: number) => {
    const updatedReminders = localSettings.reminders.map(item => {
      if (item.id !== id) return item;
      const exists = item.daysOfWeek.includes(dayIndex);
      const newDays = exists
        ? item.daysOfWeek.filter(d => d !== dayIndex)
        : [...item.daysOfWeek, dayIndex].sort();
      return { ...item, daysOfWeek: newDays };
    });
    const updated = { ...localSettings, reminders: updatedReminders };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updatedReminders = localSettings.reminders.filter(item => item.id !== id);
    const updated = { ...localSettings, reminders: updatedReminders };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    showToast('Lembrete removido com sucesso.');
  };

  const handleTestSpecificReminder = (reminder: ReminderItem) => {
    if (localSettings.soundEnabled) {
      playSoothingChime();
    }
    const notifBody = `${reminder.dosageOrVolume} · ${reminder.instructions}`;
    if (localSettings.browserNotificationsEnabled && browserPermission === 'granted') {
      sendBrowserNotification(`Lembrete: ${reminder.title}`, {
        body: notifBody,
      });
    }
    showToast(`Lembrete disparado: ${reminder.title} (${reminder.dosageOrVolume})`);
  };

  const handleTestHydrationAlert = () => {
    if (localSettings.soundEnabled) {
      playSoothingChime();
    }
    const notifBody = `Hora de beber ${localSettings.hydrationGlassVolumeMl}ml de água para manter a volemia e atingir a meta de ${localSettings.hydrationGoalMl}ml.`;
    if (localSettings.browserNotificationsEnabled && browserPermission === 'granted') {
      sendBrowserNotification('💧 Momento de Hidratação Celular', {
        body: notifBody,
      });
    }
    showToast(`💧 Alerta de Hidratação: Beba ${localSettings.hydrationGlassVolumeMl}ml de água.`);
  };

  const handleCreateCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReminder: ReminderItem = {
      id: `rem_custom_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      time: newTime,
      dosageOrVolume: newDosage.trim() || '1 dose',
      instructions: newInstructions.trim() || 'Conforme orientação profissional.',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      enabled: true
    };

    const updated = {
      ...localSettings,
      reminders: [...localSettings.reminders, newReminder]
    };

    setLocalSettings(updated);
    onUpdateSettings(updated);

    setNewTitle('');
    setNewInstructions('');
    setIsAddModalOpen(false);
    showToast(`Novo lembrete para "${newReminder.title}" adicionado!`);
  };

  // Estimated glasses
  const estimatedGlasses = Math.ceil(localSettings.hydrationGoalMl / (localSettings.hydrationGlassVolumeMl || 250));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#2C3E2D] text-[#FAF7F2] px-4 py-3 rounded-xl shadow-xl border border-[#C5A059]/40 flex items-center gap-3 text-xs sm:text-sm animate-bounce-short">
          <BellRing className="w-4 h-4 text-[#D3B474] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#D3B474] hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C3E2D]/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8C4E3C]" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#8C4E3C]">
                Sincronização & Crononutrição
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#1F2B20] mt-1">
              Configurações de Lembrete
            </h1>
            <p className="text-xs sm:text-sm text-[#4E5C50] mt-1 max-w-2xl">
              Defina notificações sonoras suaves e avisos do navegador para a ingestão pontual de fitoterápicos, fórmulas de saciedade e hidratação celular contínua.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                playSoothingChime();
                showToast('Chime terapêutico reproduzido (Frequência Solfeggio 528 Hz).');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D5CCBE] bg-white hover:bg-[#F0EAE1] text-[#2C3E2D] text-xs font-semibold transition-colors"
              title="Ouvir som do alerta terapêutico"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Ouvir Chime</span>
            </button>

            <button
              onClick={handleRequestPermission}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs ${
                browserPermission === 'granted'
                  ? 'bg-emerald-900 text-white border border-emerald-800'
                  : 'bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2]'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-[#D3B474]" />
              <span>
                {browserPermission === 'granted'
                  ? 'Navegador Autorizado ✓'
                  : 'Autorizar no Navegador'}
              </span>
            </button>
          </div>
        </div>

        {/* Browser Permission Info Banner if not granted */}
        {browserPermission !== 'granted' && (
          <div className="mt-4 p-3.5 bg-[#F2EDE5] rounded-xl border border-[#D8CDBD] flex items-center justify-between gap-3 text-xs text-[#445145]">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-[#8C4E3C] shrink-0" />
              <span>
                Para receber alertas na área de trabalho mesmo com a aba em segundo plano, clique em <strong>"Autorizar no Navegador"</strong> e confirme a permissão de notificações.
              </span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="underline font-bold text-[#8C4E3C] hover:text-[#2C3E2D] whitespace-nowrap"
            >
              Conceder Permissão
            </button>
          </div>
        )}

        {/* Global Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {/* Card 1: Notificações do Navegador */}
          <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F2B20] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#8C4E3C]" />
                Notificações de Tela
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.browserNotificationsEnabled}
                  onChange={e => handleToggleBrowserNotif(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2C3E2D]"></div>
              </label>
            </div>
            <p className="text-[11px] text-[#5A685B]">
              Avisos nativos flutuantes na tela do computador ou celular no momento exato de cada tomada.
            </p>
          </div>

          {/* Card 2: Chime Terapêutico */}
          <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F2B20] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#C5A059]" />
                Chime Auditivo (528 Hz)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={e => handleToggleSound(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2C3E2D]"></div>
              </label>
            </div>
            <p className="text-[11px] text-[#5A685B]">
              Sino harmônico sereno via Web Audio API. Alerta biológico suave que não gera estresse adrenal.
            </p>
          </div>

          {/* Card 3: Horários de Silêncio */}
          <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1F2B20] flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#4A5D75]" />
                Modo Não Perturbe
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.quietHoursEnabled}
                  onChange={e => handleToggleQuietHours(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2C3E2D]"></div>
              </label>
            </div>
            <div className="flex items-center gap-2 text-xs pt-1">
              <input
                type="time"
                value={localSettings.quietHoursStart}
                onChange={e => handleQuietHoursChange(e.target.value, localSettings.quietHoursEnd)}
                className="p-1 border border-[#D5CCBE] rounded bg-[#FAF7F2] font-mono text-[11px]"
              />
              <span className="text-[#718073]">até</span>
              <input
                type="time"
                value={localSettings.quietHoursEnd}
                onChange={e => handleQuietHoursChange(localSettings.quietHoursStart, e.target.value)}
                className="p-1 border border-[#D5CCBE] rounded bg-[#FAF7F2] font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: LEMBRETES INTELIGENTES DE HIDRATAÇÃO */}
      <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2C3E2D]/10 pb-4">
          <div className="space-y-0.5">
            <span className="text-xs uppercase font-bold tracking-wider text-[#3E6B47] flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-700" />
              Cronograma de Hidratação Funcional
            </span>
            <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20]">
              Meta de Água: {localSettings.hydrationGoalMl} ml / dia
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestHydrationAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5CCBE] bg-white hover:bg-[#F2ECE3] text-[#2C3E2D] text-xs font-semibold transition-colors"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-700" />
              <span>Testar Alerta de Água</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Setting 1: Intervalo */}
          <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2">
            <label className="block text-xs font-semibold text-[#3B473D]">
              Frequência dos Lembretes
            </label>
            <select
              value={localSettings.hydrationFrequencyMinutes}
              onChange={e => handleHydrationSettingChange('hydrationFrequencyMinutes', Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2] text-xs font-medium text-[#1F2B20]"
            >
              <option value={45}>A cada 45 minutos (Intenso)</option>
              <option value={60}>A cada 1 hora (60 min)</option>
              <option value={90}>A cada 1 hora e meia (90 min) — Recomendado</option>
              <option value={120}>A cada 2 horas (120 min)</option>
            </select>
            <span className="text-[10px] text-[#718073] block">
              Distribui a ingestão para evitar sobrecarga gástrica e otimizar absorção.
            </span>
          </div>

          {/* Setting 2: Volume por copo */}
          <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2">
            <label className="block text-xs font-semibold text-[#3B473D]">
              Porção por Copo
            </label>
            <select
              value={localSettings.hydrationGlassVolumeMl}
              onChange={e => handleHydrationSettingChange('hydrationGlassVolumeMl', Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2] text-xs font-medium text-[#1F2B20]"
            >
              <option value={200}>200 ml (Copo padrão)</option>
              <option value={250}>250 ml (Copo americano grande)</option>
              <option value={300}>300 ml (Caneca / Copo alto)</option>
              <option value={500}>500 ml (Squeeze pequeno)</option>
            </select>
            <span className="text-[10px] text-[#718073] block">
              Equivale a aproximadamente <strong>{estimatedGlasses} copos</strong> ao longo do dia.
            </span>
          </div>

          {/* Setting 3: Meta Global */}
          <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-2">
            <label className="block text-xs font-semibold text-[#3B473D]">
              Meta Diária Total (ml)
            </label>
            <input
              type="number"
              step="100"
              min="1000"
              max="5000"
              value={localSettings.hydrationGoalMl}
              onChange={e => handleHydrationSettingChange('hydrationGoalMl', Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2] font-mono tabular-nums text-xs font-semibold text-[#1F2B20]"
            />
            <span className="text-[10px] text-[#718073] block">
              Calculada na consulta com base no seu peso corporal e índice inflamatório.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: LEMBRETES DE FITOTERÁPICOS, CHÁS & FÓRMULAS */}
      <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2C3E2D]/10 pb-4">
          <div className="space-y-0.5">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C4E3C] flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-[#8C4E3C]" />
              Cronograma de Fitoterápicos & Fórmulas Magistrais
            </span>
            <h2 className="text-xl font-serif-title font-semibold text-[#1F2B20]">
              Horários de Ingestão ({localSettings.reminders.length} Ativos)
            </h2>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-semibold transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-[#D3B474]" />
            <span>Adicionar Lembrete</span>
          </button>
        </div>

        {/* Reminder Cards List */}
        <div className="space-y-3">
          {localSettings.reminders.map(reminder => (
            <div
              key={reminder.id}
              className={`p-4 rounded-xl border transition-all ${
                reminder.enabled
                  ? 'bg-white border-[#D9CFBF] shadow-xs'
                  : 'bg-[#F2ECE3]/60 border-[#DCD1C0] opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left Info */}
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#EFE8DD] text-[#4F5D51]">
                      {reminder.category === 'cha'
                        ? 'Chá Terapêutico'
                        : reminder.category === 'floral'
                        ? 'Terapia Floral'
                        : reminder.category === 'hidratacao'
                        ? 'Hidratação'
                        : 'Fitoterápico / Fórmula'}
                    </span>
                    <strong className="text-sm font-semibold text-[#1F2B20]">
                      {reminder.title}
                    </strong>
                  </div>

                  <p className="text-xs text-[#526254]">
                    <strong>Posologia:</strong> {reminder.dosageOrVolume} · {reminder.instructions}
                  </p>

                  {/* Day Pills Selector */}
                  <div className="flex items-center gap-1 pt-1">
                    <span className="text-[10px] text-[#7A8A7C] mr-1">Dias:</span>
                    {DAY_LABELS.map((dayLabel, dayIndex) => {
                      const isActive = reminder.daysOfWeek.includes(dayIndex);
                      return (
                        <button
                          key={dayIndex}
                          type="button"
                          onClick={() => handleToggleReminderDay(reminder.id, dayIndex)}
                          className={`w-6 h-6 rounded-md text-[10px] font-bold transition-colors ${
                            isActive
                              ? 'bg-[#2C3E2D] text-[#FAF7F2]'
                              : 'bg-[#EFE8DC] text-[#718073] hover:text-[#1F2B20]'
                          }`}
                        >
                          {dayLabel.slice(0, 1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Controls: Time Picker, Test button, Toggle, Delete */}
                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#EFE8DD]">
                  <div className="flex items-center gap-1 bg-[#FAF7F2] border border-[#D5CCBE] rounded-lg px-2 py-1">
                    <Clock className="w-3.5 h-3.5 text-[#8C4E3C]" />
                    <input
                      type="time"
                      value={reminder.time}
                      onChange={e => handleUpdateReminderTime(reminder.id, e.target.value)}
                      className="font-mono text-xs font-bold text-[#1F2B20] bg-transparent outline-hidden"
                    />
                  </div>

                  <button
                    onClick={() => handleTestSpecificReminder(reminder)}
                    className="p-1.5 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2] hover:bg-[#EAE2D5] text-[#2C3E2D] text-xs"
                    title="Testar notificação deste item agora"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminder.enabled}
                      onChange={() => handleToggleReminderItem(reminder.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2C3E2D]"></div>
                  </label>

                  {reminder.id.startsWith('rem_custom_') && (
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 transition-colors"
                      title="Excluir lembrete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADICIONAR NOVO LEMBRETE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#FAF7F2] w-full max-w-lg rounded-2xl border border-[#2C3E2D]/20 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C3E2D]/10 pb-3">
              <div>
                <h3 className="text-base font-serif-title font-semibold text-[#1F2B20]">
                  Novo Lembrete de Ingestão
                </h3>
                <span className="text-xs text-[#5C6B5E]">Personalize um horário de fitoterápico, chá ou floral</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#7A8A7D] hover:text-[#1F2B20] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomReminder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#3B473D] mb-1">
                  Nome do Fitoterápico, Chá ou Suplemento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Infusão de Alecrim com Gengibre"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D5CCBE] bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3B473D] mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-[#D5CCBE] bg-white text-xs"
                  >
                    <option value="fitoterapico">Fitoterápico / Cápsula</option>
                    <option value="cha">Chá / Infusão</option>
                    <option value="floral">Floral de Bach</option>
                    <option value="suplemento">Suplemento Alimentar</option>
                    <option value="hidratacao">Água / Eletrólito</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3B473D] mb-1">
                    Horário da Ingestão
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#D5CCBE] bg-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3B473D] mb-1">
                  Dose / Quantidade
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1 xícara de 200ml / 4 gotas sublinguais"
                  value={newDosage}
                  onChange={e => setNewDosage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D5CCBE] bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3B473D] mb-1">
                  Instruções Especiais de Uso
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Tomar quente em jejum ou 20 min antes do jantar..."
                  value={newInstructions}
                  onChange={e => setNewInstructions(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D5CCBE] bg-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#2C3E2D]/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D5CCBE] text-[#556457]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] font-semibold"
                >
                  Criar Lembrete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
