import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingDown,
  TrendingUp,
  Activity,
  Heart,
  Sparkles,
  Plus,
  Scale,
  Smile,
  Calendar,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { WeeklyEvolutionData } from '../types/clinical';

interface EvolutionChartProps {
  data: WeeklyEvolutionData[];
  onAddCheckIn: (checkIn: WeeklyEvolutionData) => void;
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({
  data,
  onAddCheckIn,
}) => {
  const [viewMode, setViewMode] = useState<'combinado' | 'peso' | 'bemestar'>('combinado');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // New check-in state
  const [newWeight, setNewWeight] = useState<number>(69.2);
  const [newWellness, setNewWellness] = useState<number>(9.0);
  const [newEnergy, setNewEnergy] = useState<number>(8.8);
  const [newDigestive, setNewDigestive] = useState<number>(9.0);
  const [newNotes, setNewNotes] = useState('');

  // Calculations for current metrics
  const firstEntry = data[0] || { weightKg: 71.5, wellnessScore: 4.5, energyScore: 4.0, digestiveComfortScore: 3.5 };
  const latestEntry = data[data.length - 1] || firstEntry;
  const weightDelta = +(latestEntry.weightKg - firstEntry.weightKg).toFixed(1);
  const wellnessDelta = +(latestEntry.wellnessScore - firstEntry.wellnessScore).toFixed(1);

  const handleSubmitCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const nextWeekNumber = data.length + 1;
    const now = new Date();
    const dateLabel = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    const newCheckIn: WeeklyEvolutionData = {
      week: `Semana ${nextWeekNumber}`,
      dateLabel,
      weightKg: Number(newWeight),
      wellnessScore: Number(newWellness),
      energyScore: Number(newEnergy),
      digestiveComfortScore: Number(newDigestive),
      notes: newNotes || 'Check-in semanal registrado.'
    };

    onAddCheckIn(newCheckIn);
    setNewNotes('');
    setIsCheckInModalOpen(false);
  };

  // Custom Recharts Tooltip styled with our clinical palette
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entryData = payload[0].payload as WeeklyEvolutionData;
      return (
        <div className="bg-[#FAF7F2] border border-[#2C3E2D]/20 p-3.5 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-[#D5CCBE] pb-1">
            <span className="font-serif-title font-bold text-[#1F2B20] text-sm">
              {entryData.week} ({entryData.dateLabel})
            </span>
            <span className="text-[10px] text-[#718073]">Avaliação Semanal</span>
          </div>

          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-[#8C4E3C] font-semibold">
              <span>Peso Corporal:</span>
              <span className="font-mono tabular-nums">{entryData.weightKg} kg</span>
            </div>
            <div className="flex items-center justify-between text-[#2C3E2D] font-medium">
              <span>Bem-Estar Geral:</span>
              <span className="font-mono tabular-nums">{entryData.wellnessScore} / 10</span>
            </div>
            <div className="flex items-center justify-between text-[#C5A059] font-medium">
              <span>Disposição & Energia:</span>
              <span className="font-mono tabular-nums">{entryData.energyScore} / 10</span>
            </div>
            <div className="flex items-center justify-between text-[#3E6B47] font-medium">
              <span>Conforto Digestivo:</span>
              <span className="font-mono tabular-nums">{entryData.digestiveComfortScore} / 10</span>
            </div>
          </div>

          {entryData.notes && (
            <p className="text-[10px] text-[#556457] italic pt-1 border-t border-[#EAE2D5] leading-snug">
              "{entryData.notes}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#2C3E2D]/12 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C3E2D]/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C4E3C]" />
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C4E3C]">
              Evolução Clínica & Biomarcadores Subjetivos
            </span>
          </div>
          <h2 className="text-2xl font-serif-title font-semibold text-[#1F2B20] mt-0.5">
            Gráfico de Evolução (Últimas {data.length} Semanas)
          </h2>
          <p className="text-xs sm:text-sm text-[#4E5C50] mt-1">
            Cruzamento do peso corporal com a percepção de vitalidade e digestão, monitorando a resposta ao plano terapêutico.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode switcher */}
          <div className="flex items-center p-0.5 bg-[#EAE2D5] rounded-xl border border-[#D5CCBE] text-xs font-semibold">
            <button
              onClick={() => setViewMode('combinado')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'combinado'
                  ? 'bg-white text-[#1F2B20] shadow-xs'
                  : 'text-[#5E6D60] hover:text-[#1F2B20]'
              }`}
            >
              Combinado
            </button>
            <button
              onClick={() => setViewMode('peso')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'peso'
                  ? 'bg-white text-[#1F2B20] shadow-xs'
                  : 'text-[#5E6D60] hover:text-[#1F2B20]'
              }`}
            >
              Apenas Peso
            </button>
            <button
              onClick={() => setViewMode('bemestar')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'bemestar'
                  ? 'bg-white text-[#1F2B20] shadow-xs'
                  : 'text-[#5E6D60] hover:text-[#1F2B20]'
              }`}
            >
              Escala de Bem-Estar
            </button>
          </div>

          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#D3B474]" />
            <span>Novo Check-in</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Highlights Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Peso */}
        <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-1">
          <div className="flex items-center justify-between text-[#708072] text-[11px]">
            <span>Peso Atual</span>
            <Scale className="w-3.5 h-3.5 text-[#8C4E3C]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif-title font-bold text-[#1F2B20] font-mono tabular-nums">
              {latestEntry.weightKg}
            </span>
            <span className="text-xs text-[#526355]">kg</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{weightDelta} kg em 4 semanas</span>
          </div>
        </div>

        {/* Metric 2: Bem-Estar Global */}
        <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-1">
          <div className="flex items-center justify-between text-[#708072] text-[11px]">
            <span>Bem-Estar Global</span>
            <Smile className="w-3.5 h-3.5 text-[#2C3E2D]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif-title font-bold text-[#1F2B20] font-mono tabular-nums">
              {latestEntry.wellnessScore}
            </span>
            <span className="text-xs text-[#526355]">/ 10</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{wellnessDelta} pts (Salto de qualidade)</span>
          </div>
        </div>

        {/* Metric 3: Energia & Disposição */}
        <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-1">
          <div className="flex items-center justify-between text-[#708072] text-[11px]">
            <span>Vitalidade Mitocondrial</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif-title font-bold text-[#1F2B20] font-mono tabular-nums">
              {latestEntry.energyScore}
            </span>
            <span className="text-xs text-[#526355]">/ 10</span>
          </div>
          <span className="text-[11px] text-[#556457] block truncate">
            Sem sonolência às 16h
          </span>
        </div>

        {/* Metric 4: Conforto Intestinal */}
        <div className="p-4 bg-white rounded-xl border border-[#D9CFBF] space-y-1">
          <div className="flex items-center justify-between text-[#708072] text-[11px]">
            <span>Conforto Intestinal</span>
            <Heart className="w-3.5 h-3.5 text-[#3E6B47]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif-title font-bold text-[#1F2B20] font-mono tabular-nums">
              {latestEntry.digestiveComfortScore}
            </span>
            <span className="text-xs text-[#526355]">/ 10</span>
          </div>
          <span className="text-[11px] text-emerald-800 font-semibold block truncate">
            Bristol Tipo 4 (Eubiose)
          </span>
        </div>
      </div>

      {/* Main Interactive Recharts Canvas */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#D9CFBF] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-[#1F2B20]">
            Trajetória Longitudinal ({data[0]?.week} a {data[data.length - 1]?.week})
          </span>
          <div className="flex items-center gap-4 text-[11px] text-[#556457]">
            {(viewMode === 'combinado' || viewMode === 'peso') && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#8C4E3C] rounded-full inline-block" />
                <span>Peso Corporal (kg)</span>
              </span>
            )}
            {(viewMode === 'combinado' || viewMode === 'bemestar') && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#2C3E2D] rounded-full inline-block" />
                  <span>Bem-Estar Geral</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#C5A059] rounded-full inline-block" />
                  <span>Energia & Disposição</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'combinado' ? (
              <ComposedChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8C4E3C" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#8C4E3C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE2D5" vertical={false} />
                <XAxis
                  dataKey="week"
                  stroke="#718073"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#DCD1C0' }}
                />
                {/* Left Axis: Peso */}
                <YAxis
                  yAxisId="weight"
                  domain={[68, 73]}
                  stroke="#8C4E3C"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit="kg"
                />
                {/* Right Axis: Bem-Estar */}
                <YAxis
                  yAxisId="wellness"
                  orientation="right"
                  domain={[0, 10]}
                  stroke="#2C3E2D"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  ticks={[0, 2, 4, 6, 8, 10]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="weight"
                  type="monotone"
                  dataKey="weightKg"
                  name="Peso (kg)"
                  stroke="#8C4E3C"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorWeight)"
                  dot={{ r: 4, fill: '#8C4E3C', strokeWidth: 1, stroke: '#FAF7F2' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="wellness"
                  type="monotone"
                  dataKey="wellnessScore"
                  name="Bem-Estar"
                  stroke="#2C3E2D"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2C3E2D', strokeWidth: 1, stroke: '#FAF7F2' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="wellness"
                  type="monotone"
                  dataKey="energyScore"
                  name="Energia"
                  stroke="#C5A059"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#C5A059' }}
                />
              </ComposedChart>
            ) : viewMode === 'peso' ? (
              <AreaChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightOnly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8C4E3C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8C4E3C" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE2D5" vertical={false} />
                <XAxis dataKey="week" stroke="#718073" fontSize={11} tickLine={false} />
                <YAxis domain={[68, 73]} stroke="#8C4E3C" fontSize={11} tickLine={false} unit="kg" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="weightKg"
                  name="Peso"
                  stroke="#8C4E3C"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightOnly)"
                  dot={{ r: 5, fill: '#8C4E3C' }}
                />
              </AreaChart>
            ) : (
              <ComposedChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="wellnessOnly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2C3E2D" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2C3E2D" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE2D5" vertical={false} />
                <XAxis dataKey="week" stroke="#718073" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#2C3E2D" fontSize={11} tickLine={false} ticks={[0, 2, 4, 6, 8, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="wellnessScore"
                  name="Bem-Estar"
                  stroke="#2C3E2D"
                  strokeWidth={2.5}
                  fill="url(#wellnessOnly)"
                  dot={{ r: 4, fill: '#2C3E2D' }}
                />
                <Line
                  type="monotone"
                  dataKey="energyScore"
                  name="Energia"
                  stroke="#C5A059"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#C5A059' }}
                />
                <Line
                  type="monotone"
                  dataKey="digestiveComfortScore"
                  name="Digestão"
                  stroke="#3E6B47"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#3E6B47' }}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Clinical Milestones Timeline */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#1F2B20] uppercase tracking-wider">
          Marcos Clínicos & Relato Semanal da Paciente
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.map((item, idx) => (
            <div
              key={item.week}
              className="p-3.5 bg-white rounded-xl border border-[#D9CFBF] space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-1">
                <strong className="text-[#1F2B20] font-semibold">{item.week}</strong>
                <span className="text-[10px] text-[#718073] font-mono">{item.dateLabel}</span>
              </div>
              <div className="flex items-baseline justify-between text-[11px]">
                <span className="text-[#8C4E3C] font-semibold">{item.weightKg} kg</span>
                <span className="text-[#2C3E2D] font-bold">Nota {item.wellnessScore}/10</span>
              </div>
              <p className="text-[11px] text-[#526355] leading-snug pt-0.5">
                {item.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Check-In Modal */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-2xl border border-[#2C3E2D]/20 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2C3E2D]/10 pb-3">
              <div>
                <h3 className="text-base font-serif-title font-semibold text-[#1F2B20]">
                  Novo Registro de Check-in
                </h3>
                <span className="text-xs text-[#5C6B5E]">Semana {data.length + 1} de Acompanhamento</span>
              </div>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="text-[#7A8A7D] hover:text-[#1F2B20] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCheckIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#3B473D] mb-1">
                  Peso Aferido em Jejum (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={e => setNewWeight(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#D5CCBE] bg-white font-mono tabular-nums text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-[#3B473D]">
                    Escala de Bem-Estar Subjetivo (0 a 10)
                  </label>
                  <span className="font-mono font-bold text-[#2C3E2D]">{newWellness}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={newWellness}
                  onChange={e => setNewWellness(Number(e.target.value))}
                  className="w-full accent-[#2C3E2D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3B473D] mb-1">
                    Disposição / Energia (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={newEnergy}
                    onChange={e => setNewEnergy(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-[#D5CCBE] bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3B473D] mb-1">
                    Conforto Digestivo (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={newDigestive}
                    onChange={e => setNewDigestive(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-[#D5CCBE] bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3B473D] mb-1">
                  Relato da Semana (Como se sentiu com os chás e suplementos?)
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Ex: Não tive dores de cabeça e a saciedade à tarde foi mantida com o sachê de Gymnema..."
                  className="w-full p-2.5 rounded-lg border border-[#D5CCBE] bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D5CCBE] text-[#556457]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2C3E2D] hover:bg-[#3B523D] text-[#FAF7F2] font-semibold"
                >
                  Salvar Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
