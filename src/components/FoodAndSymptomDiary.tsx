import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Activity,
  Plus,
  Smile,
  Frown,
  Meh,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { FoodDiaryEntry, BristolStoolType } from '../types/clinical';
import { BRISTOL_SCALE_DEFINITIONS } from '../data/mockClinicalData';

interface FoodAndSymptomDiaryProps {
  entries: FoodDiaryEntry[];
  onAddEntry: (entry: FoodDiaryEntry) => void;
  dailyWaterGoalMl: number;
}

export const FoodAndSymptomDiary: React.FC<FoodAndSymptomDiaryProps> = ({
  entries,
  onAddEntry,
  dailyWaterGoalMl,
}) => {
  const [currentWaterMl, setCurrentWaterMl] = useState<number>(1600);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Form states for new entry
  const [mealType, setMealType] = useState<FoodDiaryEntry['mealType']>('lanche');
  const [description, setDescription] = useState('');
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [digestiveFeeling, setDigestiveFeeling] = useState<FoodDiaryEntry['postMealDigestiveFeeling']>('confortavel');
  const [bristolSelected, setBristolSelected] = useState<BristolStoolType | undefined>(undefined);
  const [entryNotes, setEntryNotes] = useState('');

  const waterPercentage = Math.min(100, Math.round((currentWaterMl / dailyWaterGoalMl) * 100));

  const handleAddWater = (amount: number) => {
    setCurrentWaterMl(prev => Math.max(0, prev + amount));
  };

  const handleSubmitNewEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newEntry: FoodDiaryEntry = {
      id: `diary_${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      mealType,
      mealDescription: description,
      energyLevel,
      postMealDigestiveFeeling: digestiveFeeling,
      bristolToday: bristolSelected,
      waterIntakeLoggedMl: currentWaterMl,
      notes: entryNotes
    };

    onAddEntry(newEntry);
    setDescription('');
    setEntryNotes('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C3E2D]/10 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8C4E3C]">
            Acompanhamento Contínuo
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-[#1F2B20]">
            Diário Alimentar, Hidratação & Sintomas
          </h1>
          <p className="text-xs sm:text-sm text-[#556457]">
            Registre suas refeições e percepções para que o profissional identifique padrões digestivos em cada retorno.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#D3B474]" />
          {isAdding ? 'Fechar Formulário' : 'Novo Registro de Refeição'}
        </button>
      </div>

      {/* Hydration Widget Bar */}
      <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-5 sm:p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E6F0FA] flex items-center justify-center text-[#2563EB] shrink-0 border border-[#BFDBFE]">
            <Droplets className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-[#526355] block">Meta Hídrica Diária</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-serif-title font-bold text-[#1F2B20] font-mono tabular-nums">
                {currentWaterMl}
              </span>
              <span className="text-xs text-[#6B796D]">/ {dailyWaterGoalMl} mL</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 block">
              {waterPercentage}% da meta alcançada
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-[#E5DDD0] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${waterPercentage}%` }}
            />
          </div>
          <span className="text-[10px] text-[#69796C] block">
            Dica funcional: beba água longe das grandes refeições (intervalo de 30 min antes ou 1h após).
          </span>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center sm:justify-end gap-2">
          <button
            onClick={() => handleAddWater(250)}
            className="px-3 py-1.5 rounded-lg border border-[#D5CCBE] bg-white hover:bg-[#F2ECE3] text-xs font-semibold text-[#1F2B20] transition-colors"
          >
            + 250 mL (Copo)
          </button>
          <button
            onClick={() => handleAddWater(500)}
            className="px-3 py-1.5 rounded-lg border border-[#D5CCBE] bg-white hover:bg-[#F2ECE3] text-xs font-semibold text-[#1F2B20] transition-colors"
          >
            + 500 mL (Garrafa)
          </button>
        </div>
      </div>

      {/* New Entry Form Modal / Collapsible */}
      {isAdding && (
        <form
          onSubmit={handleSubmitNewEntry}
          className="bg-white border border-[#2C3E2D]/15 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#2C3E2D]/10 pb-3">
            <h3 className="text-base font-serif-title font-semibold text-[#1F2B20]">
              Registrar Nova Refeição ou Sintoma
            </h3>
            <span className="text-xs text-[#718073]">Horário Atual</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374539] mb-1">
                Tipo de Refeição
              </label>
              <select
                value={mealType}
                onChange={e => setMealType(e.target.value as any)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2]"
              >
                <option value="cafe">Café da Manhã</option>
                <option value="almoco">Almoço</option>
                <option value="lanche">Lanche da Tarde</option>
                <option value="jantar">Jantar</option>
                <option value="ceia">Ceia / Noturno</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374539] mb-1">
                Nível de Energia Pós-Refeição (1 a 5)
              </label>
              <div className="flex items-center gap-2">
                {([1, 2, 3, 4, 5] as const).map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEnergyLevel(n)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      energyLevel === n
                        ? 'bg-[#2C3E2D] text-white border-[#2C3E2D]'
                        : 'bg-[#FAF7F2] text-[#4C5B4E] border-[#D5CCBE]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374539] mb-1">
              O que você comeu e bebeu? (Descreva alimentos, porções e preparo)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: Salada de rúcula, filé de tilápia grelhado, arroz integral e chá de hortelã sem açúcar..."
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374539] mb-1">
                Sensação Digestiva Percebida
              </label>
              <select
                value={digestiveFeeling}
                onChange={e => setDigestiveFeeling(e.target.value as any)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2]"
              >
                <option value="confortavel">Confortável e leve</option>
                <option value="estufado">Estufamento / Inchaço abdominal</option>
                <option value="azia_refluxo">Azia ou queimação no esôfago</option>
                <option value="sonolencia_excessiva">Sonolência e fadiga pós-prandial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374539] mb-1">
                Escala de Bristol Hoje (opcional)
              </label>
              <select
                value={bristolSelected || ''}
                onChange={e => setBristolSelected(e.target.value ? Number(e.target.value) as BristolStoolType : undefined)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2]"
              >
                <option value="">Não evacuei ainda / Não registrar</option>
                <option value="1">Tipo 1: Caroços duros</option>
                <option value="2">Tipo 2: Salsicha nodosa</option>
                <option value="3">Tipo 3: Salsicha com fendas</option>
                <option value="4">Tipo 4: Macia e cilíndrica (Ideal)</option>
                <option value="5">Tipo 5: Pedaços macios</option>
                <option value="6">Tipo 6: Pastoso</option>
                <option value="7">Tipo 7: Líquido</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374539] mb-1">
              Observações adicionais (gatilhos emocionais, sono ou estresse)
            </label>
            <input
              type="text"
              value={entryNotes}
              onChange={e => setEntryNotes(e.target.value)}
              placeholder="Ex: Tive reunião tensa antes do almoço..."
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#D5CCBE] bg-[#FAF7F2]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg border border-[#D5CCBE] text-xs font-semibold text-[#4C5B4E] hover:bg-[#F2ECE3]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-bold transition-colors shadow-xs"
            >
              Salvar Entrada
            </button>
          </div>
        </form>
      )}

      {/* Diary Timeline Entries */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold text-[#1F2B20] uppercase tracking-wider">
          Histórico Recente de Refeições & Sintomas
        </h3>

        {entries.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 bg-white border border-[#DCD1BF] rounded-xl text-xs space-y-2.5 transition-all shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#8C4E3C] uppercase text-[11px] tracking-wider px-2 py-0.5 rounded bg-[#F8EDE9]">
                  {item.mealType.toUpperCase()}
                </span>
                <span className="text-[11px] text-[#69786A] flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {item.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-[#516053]">
                  Energia: <strong>{item.energyLevel}/5</strong>
                </span>
                <span aria-hidden="true" className="text-[#C5BBAE]">·</span>
                <span className={`font-semibold capitalize ${
                  item.postMealDigestiveFeeling === 'confortavel' ? 'text-emerald-800' : 'text-amber-800'
                }`}>
                  {item.postMealDigestiveFeeling.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#273229] leading-relaxed">
              {item.mealDescription}
            </p>

            {(item.bristolToday || item.notes) && (
              <div className="pt-2 border-t border-[#F0EAE1] flex flex-wrap items-center gap-3 text-[11px] text-[#556457]">
                {item.bristolToday && (
                  <span className="flex items-center gap-1 font-medium text-[#2C3E2D]">
                    Bristol: Tipo {item.bristolToday} ({BRISTOL_SCALE_DEFINITIONS[item.bristolToday]?.label.split(':')[1]?.trim()})
                  </span>
                )}
                {item.notes && (
                  <span className="italic text-[#6B796D]">
                    Nota: "{item.notes}"
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
