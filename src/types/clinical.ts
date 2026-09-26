export type UserRole = 'patient' | 'professional';

export type BristolStoolType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ContinuousMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
}

export interface AnamnesisData {
  // 1. Dados gerais
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  age: number;
  gender: 'feminino' | 'masculino' | 'outro' | 'prefiro_nao_dizer';
  heightCm: number;
  weightKg: number;
  profession: string;
  dailyRoutine: string;
  physicalActivityLevel: 'sedentario' | 'leve' | 'moderado' | 'intenso';
  mainGoal: 'emagrecimento' | 'energia_disposicao' | 'sono_estresse' | 'digestao_saude_intestinal' | 'longevidade_antienvelhecimento' | 'equilibrio_hormonal';

  // 2. Histórico de saúde
  diagnosedDiseases: string[];
  pastSurgeries: string;
  knownAllergies: string;
  continuousMedications: ContinuousMedication[];
  familyHistory: string;
  hasRecentExams: boolean;
  recentExamNotes?: string;

  // 3. Hábitos alimentares
  recall24hBreakfast: string;
  recall24hLunch: string;
  recall24hDinner: string;
  recall24hSnacks: string;
  dietaryPreferences: string;
  dietaryRestrictions: string[];
  sugarFrequency: 'raramente' | '1-2x_semana' | 'diariamente' | 'multiplas_vezes_ao_dia';
  ultraProcessedFrequency: 'raramente' | 'moderado' | 'frequente';
  alcoholFrequency: 'nao_bebo' | 'socialmente' | 'frequente';
  caffeineCupsPerDay: number;
  emotionalEatingPattern: 'nenhum' | 'beliscos_estresse' | 'compulsao_noturna' | 'fome_ansiosa_tarde';
  dailyHydrationMl: number;

  // 4. Digestão e eixo intestino-cérebro
  bristolScaleType: BristolStoolType;
  bowelFrequency: 'menos_3x_semana' | '1x_a_cada_2_dias' | '1x_ao_dia' | '2-3x_ao_dia' | 'mais_3x_ao_dia';
  digestiveSymptoms: string[]; // inchaço, gases, refluxo, queimação, azia, peso pós-prandial
  gutBrainMoodCorrelation: string; // ansiedade piora digestão, irritabilidade com fome, etc.
  previousProbioticsUse: boolean;
  probioticNotes?: string;

  // 5. Sono e estresse
  sleepHoursPerNight: number;
  sleepQualityRating: 1 | 2 | 3 | 4 | 5; // 1 muito ruim a 5 excelente
  stressLevel: number; // 0 a 10
  exhaustionSymptoms: string[]; // cansaço ao acordar, queda de energia 15h-17h, insônia inicial, despertares noturnos
  relaxationPractices: string;

  // 6. Estilo de vida
  exerciseTypeAndFrequency: string;
  sunExposureWeeklyMinutes: number;
  dailyScreenTimeHours: number;
  smokingStatus: 'nao_fumante' | 'fumante_ativo' | 'ex_fumante';
  hormonalCycleNotes?: string;

  // 7. Metas e expectativas
  goal30Days: string;
  goal90Days: string;
  goal180Days: string;
  changeReadiness: 'baixo' | 'medio' | 'alto';
  consentAgreed: boolean;
  completedAt?: string;
}

export interface DrugHerbInteraction {
  id: string;
  drug: string;
  herbOrNutrient: string;
  severity: 'baixo' | 'moderado' | 'critico';
  mechanism: string;
  clinicalEffect: string;
  actionRequired: string;
}

export interface SupplementItem {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  purpose: string;
  eixoRelacionado: 'metabolico' | 'eixo_intestino_cerebro' | 'mitocondrial_energia' | 'imunologico';
  validated: boolean;
  takenToday?: boolean;
}

export interface HerbalTeaItem {
  id: string;
  name: string;
  botanicalParts: string;
  preparationMethod: string;
  schedule: string;
  therapeuticTarget: string;
  validated: boolean;
}

export interface MetabolicSupportFormula {
  id: string;
  title: string;
  category: 'saciedade_compulsao' | 'termogenico_natural' | 'drenagem_hepatica_renal' | 'eixo_intestino_cerebro' | 'modulacao_sono_estresse';
  botanicalIngredients: { name: string; standardConcentration: string }[];
  posology: string;
  clinicalRationale: string;
  warningsAndContraindications: string;
  validated: boolean;
}

export interface FloralTherapyItem {
  id: string;
  systemName: string; // Ex: Sistema Bach ou Saint Germain
  formula: string;
  posology: string;
  emotionalTarget: string;
  validated: boolean;
}

export interface MealGuideline {
  mealName: string;
  timing: string;
  baseOptions: string[];
  smartSubstitutions: { original: string; functionalSwap: string; reason: string }[];
  clinicalTips: string;
}

export interface ClinicalPlan {
  id: string;
  patientId: string;
  patientName: string;
  professionalName: string;
  professionalTitle: string;
  professionalRegistry: string; // CRN ou CRTH
  status: 'em_elaboracao' | 'validado_e_assinado';
  createdAt: string;
  signedAt?: string;
  digitalSignatureHash?: string;
  functionalDiagnosis: {
    summary: string;
    inflammatoryIndex: 'baixo' | 'moderado' | 'elevado';
    glycemicDysregulation: 'normal' | 'resistencia_insulina_inicial' | 'curva_reativa';
    gutBrainAxisStatus: 'equilibrado' | 'disbiose_provavel' | 'permeabilidade_alterada';
    hormonalAdrenalStatus: 'normal' | 'fadiga_adrenal_funcional' | 'estresse_cronico';
  };
  nutritionalGuidelines: {
    dietaryPhilosophy: string;
    meals: MealGuideline[];
    hydrationGoalMl: number;
    shoppingListCategories: { category: string; items: string[] }[];
  };
  supplementation: SupplementItem[];
  phytotherapy: {
    teas: HerbalTeaItem[];
    metabolicFormulas: MetabolicSupportFormula[];
    florals: FloralTherapyItem[];
  };
  lifestylePrescription: {
    sleepSanitation: string[];
    physicalMovement: string[];
    stressMindfulness: string[];
    milestones: { day30: string; day60: string; day90: string };
  };
  safetyVerification: {
    medicationsAudited: string[];
    detectedInteractions: DrugHerbInteraction[];
    professionalAuditNotes: string;
  };
}

export interface Appointment {
  id: string;
  patientName: string;
  professionalName: string;
  date: string;
  time: string;
  modality: 'teleconsulta_video' | 'presencial_consultorio';
  status: 'confirmada' | 'em_andamento' | 'realizada';
  notes?: string;
}

export interface FoodDiaryEntry {
  id: string;
  timestamp: string;
  mealType: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia';
  mealDescription: string;
  energyLevel: 1 | 2 | 3 | 4 | 5; // 1 péssima a 5 revigorado
  postMealDigestiveFeeling: 'confortavel' | 'estufado' | 'azia_refluxo' | 'sonolencia_excessiva';
  bristolToday?: BristolStoolType;
  waterIntakeLoggedMl: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'professional';
  text: string;
  timestamp: string;
  isClinicalNote?: boolean;
}

export interface PricingPlan {
  id: 'avulsa' | 'essencial' | 'equilibrio' | 'longevidade_plus';
  title: string;
  subtitle: string;
  price: string;
  period: string;
  isPopular?: boolean;
  highlightText: string;
  features: string[];
  suitableFor: string;
}

export interface WeeklyEvolutionData {
  week: string;
  dateLabel: string;
  weightKg: number;
  wellnessScore: number; // 1 a 10
  energyScore: number; // 1 a 10
  digestiveComfortScore: number; // 1 a 10
  notes?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  category: 'fitoterapico' | 'suplemento' | 'hidratacao' | 'cha' | 'floral' | 'geral';
  time: string; // "HH:MM"
  dosageOrVolume: string;
  instructions: string;
  daysOfWeek: number[]; // 0 to 6
  enabled: boolean;
}

export interface PatientReminderSettings {
  browserNotificationsEnabled: boolean;
  soundEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  hydrationFrequencyMinutes: number;
  hydrationGlassVolumeMl: number;
  hydrationGoalMl: number;
  reminders: ReminderItem[];
}


