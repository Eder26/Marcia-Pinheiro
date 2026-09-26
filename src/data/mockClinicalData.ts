import {
  AnamnesisData,
  ClinicalPlan,
  DrugHerbInteraction,
  Appointment,
  FoodDiaryEntry,
  ChatMessage,
  PricingPlan,
  BristolStoolType,
  WeeklyEvolutionData,
  PatientReminderSettings,
  ReminderItem
} from '../types/clinical';

export const BRISTOL_SCALE_DEFINITIONS: Record<BristolStoolType, { label: string; description: string; clinicalMeaning: string }> = {
  1: {
    label: 'Tipo 1: Caroços duros separados',
    description: 'Como nozes, difíceis de evacuar.',
    clinicalMeaning: 'Constipação severa; trânsito colônico muito lentificado e desidratação.'
  },
  2: {
    label: 'Tipo 2: Forma de salsicha, nodoso',
    description: 'Segmentado e compacto.',
    clinicalMeaning: 'Constipação leve a moderada; requer incremento de água e fibras solúveis.'
  },
  3: {
    label: 'Tipo 3: Salsicha com fendas superficiais',
    description: 'Forma cilíndrica com pequenas fissuras.',
    clinicalMeaning: 'Normal/aceitável, trânsito regular.'
  },
  4: {
    label: 'Tipo 4: Salsicha lisa e macia',
    description: 'Cilíndrico, textura homogênea, fácil eliminação.',
    clinicalMeaning: 'Padrão ouro ideal da saúde intestinal e eubiose.'
  },
  5: {
    label: 'Tipo 5: Pedaços macios com bordas nítidas',
    description: 'Fácil evacuação, pedaços definidos.',
    clinicalMeaning: 'Trânsito acelerado leve; comum com excesso de café ou fibras insolúveis.'
  },
  6: {
    label: 'Tipo 6: Pedaços aerados com bordas esfiapadas',
    description: 'Consistência pastosa e sem forma.',
    clinicalMeaning: 'Inflamação intestinal leve, má absorção ou sensibilidade alimentar.'
  },
  7: {
    label: 'Tipo 7: Totalmente líquido',
    description: 'Sem partes sólidas.',
    clinicalMeaning: 'Diarreia aguda/irritabilidade intensa; risco de desidratação e perda eletrolítica.'
  }
};

export const DRUG_HERB_INTERACTIONS_DB: DrugHerbInteraction[] = [
  {
    id: 'int_1',
    drug: 'Levotiroxina sódica',
    herbOrNutrient: 'Cálcio / Ferro / Fibras de Psyllium em jejum',
    severity: 'critico',
    mechanism: 'Quelação e quelação competitiva com a absorção no epitélio intestinal.',
    clinicalEffect: 'Redução drástica na biodisponibilidade da levotiroxina, provocando hipotireoidismo descompensado.',
    actionRequired: 'Manter intervalo de pelo menos 2 a 4 horas entre a levotiroxina e qualquer suplemento ou fitoterápico de fibras/minerais.'
  },
  {
    id: 'int_2',
    drug: 'Sertralina (ou outros ISRS)',
    herbOrNutrient: 'Hypericum perforatum (Erva de São João) / 5-HTP em altas doses',
    severity: 'critico',
    mechanism: 'Aumento sinérgico da neurotransmissão serotoninérgica no SNC.',
    clinicalEffect: 'Risco de Síndrome Serotoninérgica (hipertermia, tremores, rigidez muscular, confusão).',
    actionRequired: 'CONTRAINDICAÇÃO ABSOLUTA de Erva de São João concomitante a ISRS. Substituir por fitoterápicos moduladores GABAérgicos (Passiflora incarnata, Melissa officinalis).'
  },
  {
    id: 'int_3',
    drug: 'Losartana potássica / Anti-hipertensivos',
    herbOrNutrient: 'Altas doses de alcaçuz (Glycyrrhiza glabra) com glicirrizina',
    severity: 'moderado',
    mechanism: 'Inibição da enzima 11-beta-HSD2, elevando cortisol livre e retenção renal de sódio.',
    clinicalEffect: 'Elevação da pressão arterial e atenuação do efeito anti-hipertensivo.',
    actionRequired: 'Evitar alcaçuz com ácido glicirrízico. Optar por DGL (deglicirrizinado) para suporte gástrico.'
  },
  {
    id: 'int_4',
    drug: 'Anti-inflamatórios ou Anticoagulantes (AAS, Varfarina)',
    herbOrNutrient: 'Ginkgo biloba / Curcumina concentrada (>1000mg) / Alho concentrado',
    severity: 'moderado',
    mechanism: 'Inibição do fator ativador de plaquetas (PAF) e agregação plaquetária.',
    clinicalEffect: 'Potencialização do tempo de sangramento.',
    actionRequired: 'Ajustar posologia para doses nutricionais seguras e monitorar coagulograma.'
  }
];

export const INITIAL_ANAMNESIS: AnamnesisData = {
  fullName: '',
  email: '',
  phone: '',
  birthDate: '1988-04-12',
  age: 38,
  gender: 'feminino',
  heightCm: 165,
  weightKg: 69.5,
  profession: 'Advogada Tributarista',
  dailyRoutine: 'Trabalho em escritório e home-office com jornadas de 10h diárias em frente à tela. Almoço apressado e frequentes prazos judiciais com estresse elevado.',
  physicalActivityLevel: 'leve',
  mainGoal: 'energia_disposicao',

  diagnosedDiseases: ['Hipotireoidismo subclínico diagnosticado em 2021', 'Síndrome do Intestino Irritável (SII) com predomínio de constipação'],
  pastSurgeries: 'Apendicectomia aos 19 anos (recuperação sem intercorrências)',
  knownAllergies: 'Rinite alérgica sazonal; desconforto forte com leite de vaca e derivados lácteos integrais.',
  continuousMedications: [
    {
      id: 'med_1',
      name: 'Levotiroxina sódica (Puran T4)',
      dosage: '50 mcg',
      frequency: '1x ao dia pela manhã em jejum',
      reason: 'Hipotireoidismo'
    },
    {
      id: 'med_2',
      name: 'Cloridrato de Sertralina',
      dosage: '50 mg',
      frequency: '1x ao dia após o café da manhã',
      reason: 'Controle de ansiedade e oscilações de humor'
    }
  ],
  familyHistory: 'Mãe com hipotireoidismo de Hashimoto e osteopenia; pai com hipertensão arterial e histórico de esteatose hepática.',
  hasRecentExams: true,
  recentExamNotes: 'Exames de há 45 dias: TSH 3.2 mUI/L, T4L 1.1 ng/dL, Ferritina 31 ng/mL (baixa), Vitamina D 24 ng/mL (insuficiente), Glicemia de jejum 94 mg/dL, PCR ultrassensível 1.8 mg/L.',

  recall24hBreakfast: 'Café preto com açúcar refinado (1 xícara), 2 fatias de pão de forma branco com requeijão comum.',
  recall24hLunch: 'Prato comercial: arroz branco, feijão, filé de frango grelhado, pouca salada (tomate/alface), suco de laranja de caixinha.',
  recall24hDinner: 'Misto quente ou delivery de massa/pizza quando chega cansada às 21h30.',
  recall24hSnacks: 'Às 16h30: bolachas recheadas ou chocolate ao leite na cafeteria do escritório com segundo café expresso.',
  dietaryPreferences: 'Gosta de comidas quentes, caldos, frutas vermelhas, sementes; quer reduzir ultraprocessados sem dietas punitivas.',
  dietaryRestrictions: ['Lactose (intolerância percebida)', 'Glúten em excesso gera distensão imediata'],
  sugarFrequency: 'diariamente',
  ultraProcessedFrequency: 'frequente',
  alcoholFrequency: 'socialmente',
  caffeineCupsPerDay: 3,
  emotionalEatingPattern: 'fome_ansiosa_tarde',
  dailyHydrationMl: 1100,

  bristolScaleType: 2,
  bowelFrequency: '1x_a_cada_2_dias',
  digestiveSymptoms: ['Inchaço abdominal visível no final da tarde', 'Gases com cólicas', 'Refluxo e queimação após café em jejum', 'Sensação de digestão parada por horas'],
  gutBrainMoodCorrelation: 'Percebe que semanas de fechamento de prazos no tribunal travam o intestino e aumentam compulsão incontrolável por açúcar.',
  previousProbioticsUse: true,
  probioticNotes: 'Tomou sachê genérico de farmácia há 6 meses por 10 dias, notou melhora temporária mas parou.',

  sleepHoursPerNight: 6,
  sleepQualityRating: 2,
  stressLevel: 8,
  exhaustionSymptoms: ['Cansaço extremo ao despertar como se não tivesse dormido', 'Queda brutal de energia entre 15h e 17h', 'Dificuldade para desligar os pensamentos na cama'],
  relaxationPractices: 'Tenta respirar fundo, mas não possui rotina estruturada de meditação.',

  exerciseTypeAndFrequency: 'Pilates 2x por semana (terça e quinta, 50 minutos). Caminhada irregular nos finais de semana.',
  sunExposureWeeklyMinutes: 40,
  dailyScreenTimeHours: 11,
  smokingStatus: 'nao_fumante',
  hormonalCycleNotes: 'Ciclo regular de 28 dias; TPM com retenção de líquido, inchaço nas mamas e muita fissura por doces no período lúteo.',

  goal30Days: 'Recuperar energia matinal sem precisar de tanto café, desinchar o abdômen e estabilizar o intestino.',
  goal90Days: 'Controlar a compulsão vespertina por doces, otimizar Ferritina e Vitamina D, consolidar alimentação anti-inflamatória.',
  goal180Days: 'Manter longevidade ativa, saúde mitocondrial, modular eixo intestino-cérebro e reduzir necessidade de estimulantes.',
  changeReadiness: 'alto',
  consentAgreed: true,
  completedAt: '2026-09-24T14:30:00.000Z'
};

export const INITIAL_CLINICAL_PLAN: ClinicalPlan = {
  id: 'plan_clm_01',
  patientId: 'patient_01',
  patientName: 'Paciente',
  professionalName: 'Naturopata Marcia R Pinheiro de Moura',
  professionalTitle: 'Naturopata Clínica & Nutricionista Funcional',
  professionalRegistry: 'CRTH-BR 1892 / CRN-3 48.910',
  status: 'validado_e_assinado',
  createdAt: '2026-09-25T10:15:00.000Z',
  signedAt: '2026-09-25T11:45:00.000Z',
  digitalSignatureHash: 'WL-AUT-89F3-48910-EUBIOSE-2026',
  functionalDiagnosis: {
    summary: 'Quadro clínico de fadiga mitocondrial funcional associada a Disbiose Intestinal com trânsito lentificado (Bristol 2), esteatose de rotina e depleção de micronutrientes chaves (Ferritina 31 e 25-OH-VitD 24). Interação medicamentosa crítica checada: paciente em uso de Levotiroxina (necessita janela de 2h de suplementos de minerais) e Sertralina (contraindica fitoterápicos serotoninérgicos diretos como Hipericão). Protocolo validado para foco no eixo intestino-cérebro, suporte hepático e modulação de saciedade.',
    inflammatoryIndex: 'moderado',
    glycemicDysregulation: 'curva_reativa',
    gutBrainAxisStatus: 'permeabilidade_alterada',
    hormonalAdrenalStatus: 'fadiga_adrenal_funcional'
  },
  nutritionalGuidelines: {
    dietaryPhilosophy: 'Dietoterapia Anti-inflamatória Mediterrânea Funcional com foco no Eixo Intestino-Cérebro. Eliminação de ultraprocessados, açúcares refinados e aditivos sintéticos. Priorização de alimentos densos em polifenóis, fibras prebióticas fermentáveis e gorduras monoinsaturadas.',
    hydrationGoalMl: 2400,
    meals: [
      {
        mealName: 'Desjejum Funcional (após 45 min da Levotiroxina)',
        timing: '07h30 – 08h00',
        baseOptions: [
          'Omelete de 2 ovos caipiras com cúrcuma e sementes de abóbora tostadas + 1 fatia de pão de fermentação natural 100% integral ou mandioca cozida com azeite extravirgem.',
          'Bowl prebiótico: Iogurte de coco ou sem lactose natural com 1 colher de sementes de chia hidratadas, mirtilos frescos e canela do Ceilão.'
        ],
        smartSubstitutions: [
          { original: 'Pão branco com requeijão comum', functionalSwap: 'Pão de fermentação longa com pasta de sementes ou ovo caipira', reason: 'Evita pico glicêmico súbito e melhora saciedade matinal.' },
          { original: 'Café açucarado em jejum', functionalSwap: 'Água morna com gotinhas de limão e desjejum proteico', reason: 'Protege a mucosa gástrica e previne azia e rebote de cortisol.' }
        ],
        clinicalTips: 'Mastigue no mínimo 20 vezes cada garfada para estimular a secreção do ácido clorídrico gástrico e enzimas digestivas.'
      },
      {
        mealName: 'Almoço Eubiose & Saciedade',
        timing: '12h30 – 13h15',
        baseOptions: [
          'Metade do prato com vegetais crus e cozidos: rúcula, agrião, abobrinha salteada e cenoura ralada.',
          'Proteína limpa: Sobrecoxa sem pele grelhada ou salmão ou peixe branco (130g-150g).',
          'Carboidrato complexo: Batata-doce ou arroz negro/integral com lentilhas (3 a 4 colheres de sopa).',
          'Tempero: Azeite de oliva extravirgem acidez <0.2% (1 colher de sopa) + vinagre de maçã não pasteurizado.'
        ],
        smartSubstitutions: [
          { original: 'Suco de laranja de caixa', functionalSwap: 'Infusão gelada de hortelã com raspas de gengibre', reason: 'Zero frutose livre concentrada e melhora a digestão pós-prandial.' }
        ],
        clinicalTips: 'Inicie a refeição sempre pelas folhas amargas (rúcula/agrião) para despertar os receptores de paladar e a liberação de colecistoquinina (saciedade).'
      },
      {
        mealName: 'Lanche da Tarde — Estratégia Anti-Compulsão (16h30)',
        timing: '16h30',
        baseOptions: [
          'Chá de Camomila + Canela em pau com 1 punhado (30g) de castanhas de baru ou nozes e 1 quadradinho de cacau 85%.',
          'Smoothie anti-inflamatório: Leite de amêndoas, 1 colher de sopa de semente de linhaça dourada moída na hora e morangos congelados.'
        ],
        smartSubstitutions: [
          { original: 'Biscoitos recheados e chocolate ao leite', functionalSwap: 'Nuts + cacau 85% polifenólico', reason: 'Fornece magnésio biodisponível e triptofano sem disparar a insulina que causava a hipoglicemia reativa das 17h.' }
        ],
        clinicalTips: 'A fome ansiosa das 17h é reflexo direto da queda glicêmica provocada pelo açúcar do almoço.'
      },
      {
        mealName: 'Jantar Restaurador e Digestivo',
        timing: '19h45 – 20h30',
        baseOptions: [
          'Sopa cremosa de abóbora cabotiá com gengibre e cúrcuma, finalizada com sementes de girassol e frango desfiado.',
          'Peixe assado com crosta de ervas finas acompanhado de brócolis no vapor com alho e azeite morno.'
        ],
        smartSubstitutions: [
          { original: 'Pizza ou delivery de massa noturna', functionalSwap: 'Caldos quentes digestivos com proteína de fácil digestão', reason: 'Permite que o fígado atue na autofagia celular noturna e garante sono REM reparador.' }
        ],
        clinicalTips: 'Jantar encerrado pelo menos 2h30 antes de deitar para prevenir refluxo laringofaríngeo.'
      }
    ],
    shoppingListCategories: [
      {
        category: 'Hortifrúti Funcional',
        items: ['Rúcula selvagem', 'Agrião', 'Abobrinha', 'Abóbora cabotiá', 'Gengibre fresco', 'Cúrcuma fresca', 'Mirtilos e morangos', 'Brócolis ninja', 'Limão tahiti']
      },
      {
        category: 'Sementes, Oleaginosas e Prebióticos',
        items: ['Semente de chia', 'Semente de abóbora sem sal', 'Semente de linhaça dourada', 'Nozes chilenas', 'Castanha de baru', 'Psyllium husk puro em pó']
      },
      {
        category: 'Aromáticas & Especiarias',
        items: ['Canela do Ceilão verdadeira', 'Azeite extravirgem acidez <0.2%', 'Vinagre de maçã não pasteurizado com a madre', 'Orégano seco', 'Alecrim fresco']
      }
    ]
  },
  supplementation: [
    {
      id: 'sup_1',
      name: 'Vitamina D3 (Colecalciferol) + Vitamina K2 (MK-7)',
      dosage: '4.000 UI D3 + 75 mcg MK-7 em gotas lipossolúveis (óleo TCM)',
      timing: 'Junto com o almoço (presença de gordura alimentar)',
      purpose: 'Correção da insuficiência sérica (24 ng/mL atual -> meta 50-60 ng/mL), modulação imunológica e saúde óssea.',
      eixoRelacionado: 'imunologico',
      validated: true,
      takenToday: true
    },
    {
      id: 'sup_2',
      name: 'Bisglicinato de Magnésio + Mio-Inositol',
      dosage: 'Magnésio quelato 250mg + Mio-Inositol 1.000mg',
      timing: '40 minutos antes de dormir, diluído em 100mL de água',
      purpose: 'Relaxamento neuromuscular, ativação parassimpática, melhora da latência do sono e estabilização de neurotransmissores.',
      eixoRelacionado: 'eixo_intestino_cerebro',
      validated: true,
      takenToday: false
    },
    {
      id: 'sup_3',
      name: 'Simbiótico Intestinal Específico (Cepa-Alvo Eubiose)',
      dosage: 'Lactobacillus acidophilus NCFM (2 bi UFC) + Bifidobacterium lactis HN019 (3 bi UFC) + FOS prebiótico 500mg',
      timing: 'À noite, 1h após o jantar ou ao deitar',
      purpose: 'Modulação de motilidade colônica (Bristol 2 para 4), reforço da barreira epitelial e atenuação da inflamação sistêmica.',
      eixoRelacionado: 'eixo_intestino_cerebro',
      validated: true,
      takenToday: false
    },
    {
      id: 'sup_4',
      name: 'Bisglicinato Ferroso Microencapsulado com Vitamina C',
      dosage: 'Ferro quelato 20mg elementar + Vit C 100mg',
      timing: 'Almoço, longe de café e da Levotiroxina (intervalo obrigatório >4h)',
      purpose: 'Recuperação progressiva dos estoques de Ferritina (31 ng/mL atual -> meta >70 ng/mL para saúde mitocondrial e tireoidiana).',
      eixoRelacionado: 'mitocondrial_energia',
      validated: true,
      takenToday: true
    }
  ],
  phytotherapy: {
    teas: [
      {
        id: 'tea_1',
        name: 'Infusão Digestiva de Espinheira Santa & Alecrim',
        botanicalParts: 'Folhas de Maytenus ilicifolia + Rosmarinus officinalis',
        preparationMethod: 'Infusão: 1 colher de sobremesa da mistura para 200mL de água a 90°C. Abafar por 10 minutos.',
        schedule: '15 minutos antes do almoço e 15 minutos antes do jantar',
        therapeuticTarget: 'Proteção da mucosa gástrica, estímulo suave de secreções biliares sem agressão ao estômago.',
        validated: true
      },
      {
        id: 'tea_2',
        name: 'Chá Noturno Neurocalmante de Passiflora & Melissa',
        botanicalParts: 'Passiflora incarnata (folhas e flores) + Melissa officinalis',
        preparationMethod: 'Infusão por 12 minutos sob tampa em xícara de louça ou vidro.',
        schedule: '21h00 (ritual de desaceleração de tela)',
        therapeuticTarget: 'Modulação alostérica positiva de receptores GABA-A; indução suave de relaxamento sem interferir na Sertralina.',
        validated: true
      }
    ],
    metabolicFormulas: [
      {
        id: 'meta_1',
        title: 'Fórmula Fitoterápica de Saciedade & Modulação Glicêmica',
        category: 'saciedade_compulsao',
        botanicalIngredients: [
          { name: 'Gymnema sylvestre (extrato seco padronizado a 25% de ácidos gimnêmicos)', standardConcentration: '200 mg' },
          { name: 'Psyllium Husk puro (Plantago ovata em pó microfino)', standardConcentration: '2.500 mg' },
          { name: 'Picolinato de Cromo quelado', standardConcentration: '150 mcg' }
        ],
        posology: 'Tomar 1 sachê diluído em 250mL de água às 16h00 (30 minutos antes do pico habitual de compulsão por doces). Ingerir imediatamente outro copo de água.',
        clinicalRationale: 'A Gymnema bloqueia temporariamente as papilas gustativas para o sabor doce e otimiza a sensibilidade à insulina periférica, enquanto o psyllium expande no lúmen formando gel mucilaginoso.',
        warningsAndContraindications: 'Não ingerir próximo à Levotiroxina (manter janela de 4h). Manter hidratação abundante.',
        validated: true
      },
      {
        id: 'meta_2',
        title: 'Composto Hepato-Protetor & Drenagem Funcional',
        category: 'drenagem_hepatica_renal',
        botanicalIngredients: [
          { name: 'Silimarina (Silybum marianum extrato seco a 80% silibina)', standardConcentration: '150 mg' },
          { name: 'Extrato de Dente-de-Leão (Taraxacum officinale raiz)', standardConcentration: '120 mg' },
          { name: 'Alcachofra (Cynara scolymus)', standardConcentration: '100 mg' }
        ],
        posology: '1 cápsula vegetal 2 vezes ao dia (junto às principais refeições por 45 dias).',
        clinicalRationale: 'Otimização da Fase I e Fase II de conjugação hepática; estímulo colerético e colagogo suave para melhorar emulsificação de gorduras e motilidade biliar.',
        warningsAndContraindications: 'Contraindicado em caso de obstrução mecânica de vias biliares conhecida.',
        validated: true
      },
      {
        id: 'meta_3',
        title: 'Complexo Adaptógeno & Modulação do Eixo Intestino-Cérebro',
        category: 'eixo_intestino_cerebro',
        botanicalIngredients: [
          { name: 'Ashwagandha KSM-66 (Withania somnifera padronizada a 5% withanolídeos)', standardConcentration: '300 mg' },
          { name: 'L-Teanina pura extraída da Camellia sinensis', standardConcentration: '100 mg' }
        ],
        posology: '1 dose pela manhã após o desjejum.',
        clinicalRationale: 'Diminuição da hiper-reatividade do eixo HPA (hipotálamo-hipófise-adrenal), modulando picos de cortisol salivar e estresse visceral na mucosa colônica.',
        warningsAndContraindications: 'Seguro em uso conjunto com Sertralina nesta dosagem terapêutica.',
        validated: true
      }
    ],
    florals: [
      {
        id: 'flo_1',
        systemName: 'Florais de Bach Originais',
        formula: 'White Chestnut + Elm + Walnut + Gentian',
        posology: '4 gotas sublinguais 4 vezes ao dia (ao acordar, antes do almoço, às 17h e ao deitar).',
        emotionalTarget: 'Cessação do fluxo de pensamentos repetitivos em turbilhão, sensação de sobrecarga com prazos e facilitação da transição de novos hábitos alimentares.',
        validated: true
      }
    ]
  },
  lifestylePrescription: {
    sleepSanitation: [
      'Janela de escuridão biológica: Desligar telas de computador e celular às 21h30 ou usar filtro de luz azul (modo noturno quente).',
      'Ritual do quarto fresco e escuro: Manter temperatura ambiente amena e cortinas blackout completas.',
      'Evitar cafeína após as 14h00 para permitir metabolização completa da adenosina.'
    ],
    physicalMovement: [
      'Manter o Pilates 2x na semana com foco em fortalecimento de core e assoalho pélvico.',
      'Caminhada matinal regenerativa de 20 minutos à luz do sol natural (antes das 09h) para sincronizar o núcleo supraquiasmático (relógio biológico) e ativar produção de serotonina/melatonina.'
    ],
    stressMindfulness: [
      'Protocolo de Respiração 4-7-8 antes de almoçar e ao deitar (4 segundos inspira, 7 segura, 8 expira suavemente pela boca).',
      'Pausa de descompressão de 5 minutos a cada 2 horas de trabalho em frente à tela.'
    ],
    milestones: {
      day30: 'Intestino regulado para Bristol 3-4 diário ou a cada 24h; redução de 70% no inchaço abdominal e ausência de episódios de compulsão severa por doces.',
      day60: 'Níveis de energia constantes das 08h às 19h sem sonolência pós-almoço; Ferritina em curva ascendente; qualidade do sono nota 4 de 5.',
      day90: 'Reavaliação laboratorial completa (TSH, Ferritina, Vit D, PCR); consolidação da autonomia alimentar e alta para protocolo de manutenção preventiva.'
    }
  },
  safetyVerification: {
    medicationsAudited: [
      'Levotiroxina sódica 50mcg (Puran T4)',
      'Cloridrato de Sertralina 50mg'
    ],
    detectedInteractions: [
      {
        id: 'audit_01',
        drug: 'Levotiroxina sódica',
        herbOrNutrient: 'Psyllium e Minerais Quelatos (Ferro, Magnésio)',
        severity: 'critico',
        mechanism: 'Bloqueio de absorção intestinal por quelação física e aceleração do bolo.',
        clinicalEffect: 'Risco de descompensar o TSH se tomado junto.',
        actionRequired: 'RESOLVIDO NA PRESCRIÇÃO: Levotiroxina mantida às 06h30 em jejum exclusivo com água pura; sachê de saciedade (psyllium) alocado às 16h00 (9 horas de intervalo seguro). Ferro alocado no almoço.'
      },
      {
        id: 'audit_02',
        drug: 'Cloridrato de Sertralina',
        herbOrNutrient: 'Erva de São João (Hypericum) / 5-HTP',
        severity: 'critico',
        mechanism: 'Potencialização de serotonina.',
        clinicalEffect: 'Risco de toxicidade serotoninérgica.',
        actionRequired: 'RESOLVIDO NA PRESCRIÇÃO: Totalmente excluídos agentes serotoninérgicos diretos. Utilizada apenas modulação GABAérgica suave (Passiflora/Melissa) e L-teanina, com total segurança.'
      }
    ],
    professionalAuditNotes: 'Paciente apresentou anamnese completa e exames compatíveis. Protocolo terapêutico aprovado e chancelado com total compatibilidade medicamentosa. Assinado eletronicamente sob responsabilidade técnica.'
  }
};

export const INITIAL_FOOD_DIARY: FoodDiaryEntry[] = [
  {
    id: 'diary_1',
    timestamp: '2026-09-25 08:15',
    mealType: 'cafe',
    mealDescription: 'Omelete de 2 ovos com sementes de abóbora tostadas e cúrcuma, mamão com chia e café descafeinado.',
    energyLevel: 4,
    postMealDigestiveFeeling: 'confortavel',
    waterIntakeLoggedMl: 500,
    notes: 'Segui o plano! Não senti o estômago pesado como sentia com o misto quente.'
  },
  {
    id: 'diary_2',
    timestamp: '2026-09-25 12:45',
    mealType: 'almoco',
    mealDescription: 'Salada de rúcula com azeite extravirgem e vinagre de maçã, sobrecoxa de frango assada e purê de abóbora.',
    energyLevel: 4,
    postMealDigestiveFeeling: 'confortavel',
    waterIntakeLoggedMl: 600,
    bristolToday: 3,
    notes: 'Iniciei pelas folhas amargas como a Naturopata Marcia orientou. Não tive sonolência às 14h.'
  },
  {
    id: 'diary_3',
    timestamp: '2026-09-25 16:15',
    mealType: 'lanche',
    mealDescription: 'Sachê de Gymnema com Psyllium + 1 punhado de castanhas e 1 quadradinho de cacau 85%.',
    energyLevel: 5,
    postMealDigestiveFeeling: 'confortavel',
    waterIntakeLoggedMl: 500,
    notes: 'Incrível! Pela primeira vez na semana não fui até a máquina de doces do escritório.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_01',
    patientName: 'Paciente',
    professionalName: 'Naturopata Marcia R Pinheiro de Moura (CRTH-BR 1892 / CRN-3 48.910)',
    date: '2026-09-28',
    time: '14:30',
    modality: 'teleconsulta_video',
    status: 'confirmada',
    notes: 'Primeiro retorno de alinhamento em 30 dias para checagem de adaptação à fórmula de saciedade e hábitos intestinais.'
  },
  {
    id: 'apt_02',
    patientName: 'Paciente',
    professionalName: 'Naturopata Marcia R Pinheiro de Moura (CRTH-BR 1892 / CRN-3 48.910)',
    date: '2026-09-24',
    time: '11:00',
    modality: 'teleconsulta_video',
    status: 'realizada',
    notes: 'Primeira consulta de anamnese clínica integrativa realizada com sucesso. Prontuário preenchido e plano assinado.'
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'professional',
    text: 'Olá! Seja muito bem-vinda ao Wellness Longevidade. Analisei seu prontuário detalhado e já elaborei o seu plano terapêutico inicial.',
    timestamp: 'Ontem às 11:50'
  },
  {
    id: 'msg_2',
    sender: 'professional',
    text: 'Atenção especial à regra de ouro da sua Levotiroxina: mantenha sempre o jejum de 45 minutos pela manhã antes de qualquer alimento e nunca tome o sachê de Psyllium pela manhã.',
    timestamp: 'Ontem às 11:52',
    isClinicalNote: true
  },
  {
    id: 'msg_3',
    sender: 'patient',
    text: 'Perfeito, Naturopata Marcia! Já li todo o plano e achei muito claro. Consegui encomendar a fórmula de saciedade na farmácia de manipulação recomendada.',
    timestamp: 'Ontem às 14:10'
  },
  {
    id: 'msg_4',
    sender: 'patient',
    text: 'Uma dúvida rápida: o chá de espinheira santa pode ser tomado gelado se o dia estiver muito quente no escritório?',
    timestamp: 'Hoje às 10:20'
  },
  {
    id: 'msg_5',
    sender: 'professional',
    text: 'Pode sim! Você pode fazer a infusão quente pela manhã para extrair os bioativos e depois levar em uma garrafinha térmica com gelo. Apenas não guarde de um dia para o outro para não oxidar.',
    timestamp: 'Hoje às 10:45'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'avulsa',
    title: 'Consulta Avulsa',
    subtitle: 'Primeiro passo com diagnóstico e anamnese completa',
    price: 'R$ 150',
    period: 'por consulta',
    highlightText: 'Ideal para avaliação inicial',
    features: [
      'Anamnese funcional clínica completa (7 eixos)',
      'Consulta remota de 60 minutos por vídeo',
      'Plano terapêutico personalizado com prescrição',
      'Auditoria de interações medicamentosas',
      'Acesso ao diário alimentar por 15 dias',
      'Receituário e laudo clínico digital'
    ],
    suitableFor: 'Quem deseja um diagnóstico inicial antes de aderir a um acompanhamento contínuo.'
  },
  {
    id: 'essencial',
    title: 'Plano Essencial',
    subtitle: 'Acompanhamento mensal com suporte contínuo',
    price: 'R$ 280',
    period: '/mês',
    highlightText: 'Acompanhamento mensal estruturado',
    features: [
      '1 Consulta mensal individual por vídeo',
      'Prontuário dinâmico com atualização periódica',
      'Ajustes de plano alimentar e substituições',
      'Suporte direto por chat clínico para dúvidas',
      'Diário alimentar e de sintomas ilimitado',
      'Lembretes inteligentes de suplementação'
    ],
    suitableFor: 'Pacientes com foco em rotina, digestão e reeducação de estilo de vida sustentável.'
  },
  {
    id: 'equilibrio',
    title: 'Plano Equilíbrio',
    subtitle: 'Nosso plano mais procurado para transformação clínica',
    price: 'R$ 490',
    period: '/mês',
    isPopular: true,
    highlightText: 'Mais escolhido pelos pacientes',
    features: [
      '2 Consultas individuais ao mês por vídeo (quinzenais)',
      'Reavaliação contínua de suplementos e fitoterápicos',
      'Fórmulas personalizadas de saciedade e termogênicos',
      'Suporte por chat prioritário e ágil com o profissional',
      'Gráficos de evolução de peso, sintomas e energia',
      'Desconto exclusivo em laboratórios e farmácias parceiras'
    ],
    suitableFor: 'Pessoas com queixas multifatoriais: fadiga, desequilíbrio intestinal e compulsão alimentar.'
  },
  {
    id: 'longevidade_plus',
    title: 'Longevidade Plus',
    subtitle: 'Medicina do estilo de vida e alta performance celular',
    price: 'R$ 790',
    period: '/mês',
    highlightText: 'Cuidado integral de alto nível',
    features: [
      'Consultas quinzenais + sessões express de alinhamento',
      'Análise aprofundada de painéis de exames funcionais',
      'Protocolo completo de fitoterapia, adaptógenos e florais',
      'Monitoramento diário de biomarcadores de rotina',
      'Acesso a materiais educativos e receitas sazonais',
      'Canal de contato com a equipe multidisciplinar'
    ],
    suitableFor: 'Executivos, atletas e quem busca longevidade ativa, prevenção de declínio e otimização mitocondrial.'
  }
];

export const INITIAL_EVOLUTION_DATA: WeeklyEvolutionData[] = [
  {
    week: 'Semana 1',
    dateLabel: '04/Set',
    weightKg: 71.5,
    wellnessScore: 4.5,
    energyScore: 4.0,
    digestiveComfortScore: 3.5,
    notes: 'Início da reeducação. Relato de inchaço após almoço e fadiga às 16h.'
  },
  {
    week: 'Semana 2',
    dateLabel: '11/Set',
    weightKg: 70.8,
    wellnessScore: 6.0,
    energyScore: 5.5,
    digestiveComfortScore: 5.5,
    notes: 'Início dos chás de espinheira santa e alecrim. Refluxo aliviado.'
  },
  {
    week: 'Semana 3',
    dateLabel: '18/Set',
    weightKg: 70.1,
    wellnessScore: 7.5,
    energyScore: 7.2,
    digestiveComfortScore: 7.5,
    notes: 'Fórmula de Gymnema e Psyllium estabilizou a compulsão das 17h.'
  },
  {
    week: 'Semana 4',
    dateLabel: '25/Set',
    weightKg: 69.5,
    wellnessScore: 8.8,
    energyScore: 8.5,
    digestiveComfortScore: 8.5,
    notes: 'Intestino no padrão ouro (Bristol 4). Disposição renovada e -2.0 kg acumulados.'
  }
];

export const DEFAULT_REMINDER_SETTINGS: PatientReminderSettings = {
  browserNotificationsEnabled: true,
  soundEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  hydrationFrequencyMinutes: 90,
  hydrationGlassVolumeMl: 250,
  hydrationGoalMl: 2200,
  reminders: [
    {
      id: 'rem_1',
      title: 'Chá Digestivo de Espinheira Santa (Maytenus ilicifolia)',
      category: 'cha',
      time: '11:45',
      dosageOrVolume: '1 xícara (150ml morno)',
      instructions: 'Ingerir 15 minutos antes do almoço. Protege a mucosa e reduz refluxo.',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      enabled: true
    },
    {
      id: 'rem_2',
      title: 'Fórmula de Saciedade & Glicemia (Gymnema + Psyllium)',
      category: 'fitoterapico',
      time: '16:30',
      dosageOrVolume: '1 sachê em 300ml de água',
      instructions: 'Dissolver e tomar imediatamente 30 min antes do pico de fissura por doces.',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      enabled: true
    },
    {
      id: 'rem_3',
      title: 'Adaptógeno Matinal (Ashwagandha KSM-66 + L-Teanina)',
      category: 'fitoterapico',
      time: '08:30',
      dosageOrVolume: '1 dose com água',
      instructions: 'Tomar logo após o café da manhã para modular o cortisol e estresse.',
      daysOfWeek: [1, 2, 3, 4, 5],
      enabled: true
    },
    {
      id: 'rem_4',
      title: 'Cardo Mariano & Alcachofra (Suporte Hepático)',
      category: 'fitoterapico',
      time: '12:30',
      dosageOrVolume: '1 cápsula vegetal',
      instructions: 'Junto à principal refeição para estímulo de enzimas biliares.',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      enabled: true
    },
    {
      id: 'rem_5',
      title: 'Florais de Bach Originais (Fórmula White Chestnut)',
      category: 'floral',
      time: '21:30',
      dosageOrVolume: '4 gotas sublinguais',
      instructions: 'Antes do ritual de sono para desacelerar o fluxo de pensamentos.',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      enabled: true
    },
    {
      id: 'rem_6',
      title: 'Hidratação Periódica & Eletrólitos',
      category: 'hidratacao',
      time: '10:00',
      dosageOrVolume: 'Copão de 250ml de água',
      instructions: 'Beba com calma. Manter a volemia para otimizar excreção renal.',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      enabled: true
    }
  ]
};


