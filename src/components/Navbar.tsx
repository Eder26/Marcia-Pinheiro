import React from 'react';
import {
  Leaf,
  Stethoscope,
  User,
  Calendar,
  Sparkles,
  CreditCard,
  MessageSquare,
  FileText
} from 'lucide-react';
import { UserRole } from '../types/clinical';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenPlans: () => void;
  onStartVideoCall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenPlans,
  onStartVideoCall,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#2C3E2D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single text element wordmark with delicate leaf insignia */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange(currentRole === 'patient' ? 'plano' : 'pacientes')}
              className="flex items-center gap-2.5 text-left group"
            >
              <span className="w-8 h-8 rounded-lg bg-[#2C3E2D] flex items-center justify-center text-[#FAF7F2] shadow-xs group-hover:bg-[#39503A] transition-colors">
                <Leaf className="w-4 h-4 text-[#D3B474]" />
              </span>
              <span className="text-xl sm:text-2xl font-serif-title font-semibold tracking-tight text-[#1F2B20]">
                Wellness Longevidade
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (single line, clean typographic hover states) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#4A574C]">
            {currentRole === 'patient' ? (
              <>
                <button
                  onClick={() => onTabChange('plano')}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeTab === 'plano'
                      ? 'text-[#2C3E2D] font-semibold border-b-2 border-[#2C3E2D]'
                      : 'hover:text-[#1F2B20]'
                  }`}
                >
                  Meu Plano & Fórmulas
                </button>
                <button
                  onClick={() => onTabChange('prontuario')}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeTab === 'prontuario'
                      ? 'text-[#2C3E2D] font-semibold border-b-2 border-[#2C3E2D]'
                      : 'hover:text-[#1F2B20]'
                  }`}
                >
                  Prontuário Digital
                </button>
                <button
                  onClick={() => onTabChange('diario')}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeTab === 'diario'
                      ? 'text-[#2C3E2D] font-semibold border-b-2 border-[#2C3E2D]'
                      : 'hover:text-[#1F2B20]'
                  }`}
                >
                  Diário & Sintomas
                </button>
                <button
                  onClick={() => onTabChange('evolucao')}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeTab === 'evolucao'
                      ? 'text-[#2C3E2D] font-semibold border-b-2 border-[#2C3E2D]'
                      : 'hover:text-[#1F2B20]'
                  }`}
                >
                  Gráfico de Evolução
                </button>
                <button
                  onClick={() => onTabChange('chat')}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeTab === 'chat'
                      ? 'text-[#2C3E2D] font-semibold border-b-2 border-[#2C3E2D]'
                      : 'hover:text-[#1F2B20]'
                  }`}
                >
                  Chat com Profissional
                </button>
                <button
                  onClick={() => onTabChange('lembretes')}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeTab === 'lembretes'
                      ? 'text-[#2C3E2D] font-semibold border-b-2 border-[#2C3E2D]'
                      : 'hover:text-[#1F2B20]'
                  }`}
                >
                  Lembretes & Hidratação
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onTabChange('dashboard_pro')}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeTab === 'dashboard_pro'
                      ? 'text-[#2C3E2D] font-semibold border-b-2 border-[#2C3E2D]'
                      : 'hover:text-[#1F2B20]'
                  }`}
                >
                  Central Clínica
                </button>
                <button
                  onClick={() => onTabChange('prontuario_paciente')}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeTab === 'prontuario_paciente'
                      ? 'text-[#2C3E2D] font-semibold border-b-2 border-[#2C3E2D]'
                      : 'hover:text-[#1F2B20]'
                  }`}
                >
                  Prontuário & Interações
                </button>
                <button
                  onClick={() => onTabChange('prescricao_fitoterapica')}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    activeTab === 'prescricao_fitoterapica'
                      ? 'text-[#2C3E2D] font-semibold border-b-2 border-[#2C3E2D]'
                      : 'hover:text-[#1F2B20]'
                  }`}
                >
                  Validador de Protocolos
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Primary Actions & User Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill Control */}
            <div className="flex items-center p-0.5 bg-[#EAE4D9] rounded-lg border border-[#D5CCBE]/80 text-xs font-medium">
              <button
                onClick={() => {
                  onRoleChange('patient');
                  onTabChange('plano');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  currentRole === 'patient'
                    ? 'bg-[#FAF7F2] text-[#2C3E2D] shadow-xs font-semibold'
                    : 'text-[#68756A] hover:text-[#2C3E2D]'
                }`}
                title="Acessar como Paciente"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paciente</span>
              </button>
              <button
                onClick={() => {
                  onRoleChange('professional');
                  onTabChange('dashboard_pro');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  currentRole === 'professional'
                    ? 'bg-[#2C3E2D] text-[#FAF7F2] shadow-xs font-semibold'
                    : 'text-[#68756A] hover:text-[#2C3E2D]'
                }`}
                title="Acessar como Naturopata / Nutricionista"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Profissional</span>
              </button>
            </div>

            {/* Telehealth Teleconsulta quick action */}
            <button
              onClick={onStartVideoCall}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FAF7F2] bg-[#2C3E2D] hover:bg-[#3B523D] rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="Abrir sala de teleconsulta"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D3B474]" />
              <span className="hidden sm:inline">Teleconsulta</span>
            </button>

            {/* Planos & Assinatura */}
            <button
              onClick={onOpenPlans}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8F4835] bg-[#F7ECE8] hover:bg-[#F3DDD7] rounded-lg border border-[#E9C3B8]/60 transition-colors whitespace-nowrap"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Planos</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="md:hidden flex items-center justify-between border-t border-[#2C3E2D]/5 py-2 overflow-x-auto text-xs text-[#526054]">
          {currentRole === 'patient' ? (
            <>
              <button
                onClick={() => onTabChange('plano')}
                className={`px-2 py-1 whitespace-nowrap ${activeTab === 'plano' ? 'text-[#2C3E2D] font-bold' : ''}`}
              >
                Plano & Fórmulas
              </button>
              <button
                onClick={() => onTabChange('prontuario')}
                className={`px-2 py-1 whitespace-nowrap ${activeTab === 'prontuario' ? 'text-[#2C3E2D] font-bold' : ''}`}
              >
                Prontuário
              </button>
              <button
                onClick={() => onTabChange('diario')}
                className={`px-2 py-1 whitespace-nowrap ${activeTab === 'diario' ? 'text-[#2C3E2D] font-bold' : ''}`}
              >
                Diário
              </button>
              <button
                onClick={() => onTabChange('evolucao')}
                className={`px-2 py-1 whitespace-nowrap ${activeTab === 'evolucao' ? 'text-[#2C3E2D] font-bold' : ''}`}
              >
                Evolução
              </button>
              <button
                onClick={() => onTabChange('chat')}
                className={`px-2 py-1 whitespace-nowrap ${activeTab === 'chat' ? 'text-[#2C3E2D] font-bold' : ''}`}
              >
                Chat
              </button>
              <button
                onClick={() => onTabChange('lembretes')}
                className={`px-2 py-1 whitespace-nowrap ${activeTab === 'lembretes' ? 'text-[#2C3E2D] font-bold' : ''}`}
              >
                Lembretes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onTabChange('dashboard_pro')}
                className={`px-2 py-1 whitespace-nowrap ${activeTab === 'dashboard_pro' ? 'text-[#2C3E2D] font-bold' : ''}`}
              >
                Central Clínica
              </button>
              <button
                onClick={() => onTabChange('prontuario_paciente')}
                className={`px-2 py-1 whitespace-nowrap ${activeTab === 'prontuario_paciente' ? 'text-[#2C3E2D] font-bold' : ''}`}
              >
                Anamnese
              </button>
              <button
                onClick={() => onTabChange('prescricao_fitoterapica')}
                className={`px-2 py-1 whitespace-nowrap ${activeTab === 'prescricao_fitoterapica' ? 'text-[#2C3E2D] font-bold' : ''}`}
              >
                Validador
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
