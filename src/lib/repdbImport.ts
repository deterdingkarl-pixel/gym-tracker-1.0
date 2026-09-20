import { Exercise, ExerciseCategory, MuscleGroup } from '@/types';

const DATASET_URL = 'https://exercise-dataset.com/exercises.json';

interface RepDbRecord {
  id: string;
  name_de?: string;
  name_en: string;
  description_de?: string;
  description_en?: string;
  category: string; // strength | stretching | cardio ...
  mechanic?: string; // compound | isolation
  equipment?: string;
  body_part?: string;
  primary_muscles?: string[];
  secondary_muscles?: string[];
  is_bodyweight?: boolean;
  instructions_de?: string[];
  instructions_en?: string[];
  tips_de?: string[];
  tips_en?: string[];
}

interface RepDbDataset {
  count: number;
  exercises: RepDbRecord[];
}

const MUSCLE_KEYWORDS: [string, MuscleGroup][] = [
  ['bicep', 'Bizeps'],
  ['tricep', 'Trizeps'],
  ['pector', 'Brust'],
  ['chest', 'Brust'],
  ['latissimus', 'Rücken'],
  ['rhomboid', 'Rücken'],
  ['trapez', 'Rücken'],
  ['erector_spinae', 'Rücken'],
  ['deltoid', 'Schultern'],
  ['quadricep', 'Beine'],
  ['hamstring', 'Beine'],
  ['glute', 'Beine'],
  ['calv', 'Beine'],
  ['gastrocnemius', 'Beine'],
  ['soleus', 'Beine'],
  ['adductor', 'Beine'],
  ['abductor', 'Beine'],
  ['rectus_abdominis', 'Bauch'],
  ['oblique', 'Bauch'],
  ['transverse_abdominis', 'Bauch'],
];

const BODY_PART_FALLBACK: Record<string, MuscleGroup> = {
  chest: 'Brust',
  back: 'Rücken',
  shoulders: 'Schultern',
  upper_arms: 'Sonstiges',
  lower_arms: 'Sonstiges',
  forearms: 'Sonstiges',
  upper_legs: 'Beine',
  lower_legs: 'Beine',
  core: 'Bauch',
  waist: 'Bauch',
  full_body: 'Ganzkörper',
  neck: 'Sonstiges',
};

function mapMuscleGroup(bodyPart: string | undefined, primaryMuscles: string[] | undefined): MuscleGroup {
  const haystack = (primaryMuscles ?? []).join(',').toLowerCase();
  for (const [keyword, group] of MUSCLE_KEYWORDS) {
    if (haystack.includes(keyword)) return group;
  }
  if (bodyPart && BODY_PART_FALLBACK[bodyPart]) return BODY_PART_FALLBACK[bodyPart];
  return 'Sonstiges';
}

function mapCategory(record: RepDbRecord): ExerciseCategory {
  if (record.category === 'cardio') return 'Cardio';
  if (record.category === 'stretching') return 'Mobilität';
  if (record.is_bodyweight && !record.equipment) return 'Körpergewicht';
  return record.mechanic === 'isolation' ? 'Isolationsübung' : 'Verbundübung';
}

function toAppExercise(record: RepDbRecord): Omit<Exercise, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'> {
  const instructions = record.instructions_de?.length ? record.instructions_de : record.instructions_en ?? [];
  const tips = record.tips_de?.length ? record.tips_de : record.tips_en ?? [];
  const executionNotes = [
    instructions.length ? instructions.map((s, i) => `${i + 1}. ${s}`).join('\n') : '',
    tips.length ? `Tipps:\n${tips.map((t) => `• ${t}`).join('\n')}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return {
    name: record.name_de || record.name_en,
    muscleGroup: mapMuscleGroup(record.body_part, record.primary_muscles),
    category: mapCategory(record),
    equipment: record.equipment ? record.equipment.replace(/_/g, ' ') : 'Körpergewicht',
    description: record.description_de || record.description_en || undefined,
    executionNotes: executionNotes || undefined,
  };
}

export async function fetchRepDbExercises(): Promise<Omit<Exercise, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>[]> {
  const res = await fetch(DATASET_URL);
  if (!res.ok) throw new Error(`RepDB-Datensatz konnte nicht geladen werden (Status ${res.status}).`);
  const data: RepDbDataset = await res.json();
  return data.exercises.map(toAppExercise);
}
