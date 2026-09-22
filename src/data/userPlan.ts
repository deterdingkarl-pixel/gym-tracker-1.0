import { Exercise, PlanSetTarget } from '@/types';

/**
 * Der persönliche Standard-Trainingsplan des Nutzers, fest im Code hinterlegt.
 * Wird beim App-Start automatisch (und wiederholungssicher — kein Duplizieren
 * bei erneutem Start oder auf einem zweiten Gerät) ergänzt, siehe
 * lib/defaultPlanSeed.ts.
 *
 * Herkunft der Werte: tatsächlich trainierte Sätze, vom Nutzer übermittelt.
 * "Schulterdrücken Multipresse" und "Enges Rudern" / "Enges Latziehen" wurden
 * mit dem Nutzer abgeglichen (21.09.2026): Schulterdrücken Multipresse sind
 * zwei normale Zielsätze (kein Dropsatz). Enges Rudern und Enges Latziehen
 * sind zwei eigenständige Übungen mit unterschiedlichem Gewicht (Rudern mit
 * dem höheren, Latziehen mit dem niedrigeren Gewicht).
 */

export const USER_PLAN_EXERCISES: Array<
  Pick<Exercise, 'name' | 'muscleGroup' | 'category' | 'equipment' | 'description' | 'executionNotes'>
> = [
  { name: 'Beinbeuger liegend', muscleGroup: 'Beine', category: 'Isolationsübung', equipment: 'Maschine' },
  { name: 'Adduktoren', muscleGroup: 'Beine', category: 'Isolationsübung', equipment: 'Maschine' },
  { name: 'Abduktoren', muscleGroup: 'Beine', category: 'Isolationsübung', equipment: 'Maschine' },
  { name: 'Waden', muscleGroup: 'Beine', category: 'Isolationsübung', equipment: 'Maschine' },
  { name: 'Beinstrecker einbeinig', muscleGroup: 'Beine', category: 'Isolationsübung', equipment: 'Maschine' },
  { name: 'Beinpresse', muscleGroup: 'Beine', category: 'Verbundübung', equipment: 'Maschine' },
  { name: 'Preacher Curl', muscleGroup: 'Bizeps', category: 'Isolationsübung', equipment: 'Maschine' },
  { name: 'Trizeps Pushdown', muscleGroup: 'Trizeps', category: 'Isolationsübung', equipment: 'Kabelzug' },
  { name: 'Trizeps über Kopf', muscleGroup: 'Trizeps', category: 'Isolationsübung', equipment: 'Kabelzug' },
  { name: 'Hammer Curl sitzend', muscleGroup: 'Bizeps', category: 'Isolationsübung', equipment: 'Kurzhanteln' },
  { name: 'Seitheben', muscleGroup: 'Schultern', category: 'Isolationsübung', equipment: 'Kurzhanteln' },
  { name: 'Schulterdrücken Multipresse', muscleGroup: 'Schultern', category: 'Verbundübung', equipment: 'Multipresse' },
  { name: 'Hintere Schulter', muscleGroup: 'Schultern', category: 'Isolationsübung', equipment: 'Maschine' },
  { name: 'Butterfly', muscleGroup: 'Brust', category: 'Isolationsübung', equipment: 'Maschine' },
  { name: 'Schrägbankdrücken Multipresse', muscleGroup: 'Brust', category: 'Verbundübung', equipment: 'Multipresse' },
  { name: 'T-Bar Rudern', muscleGroup: 'Rücken', category: 'Verbundübung', equipment: 'T-Bar' },
  { name: 'Latzug', muscleGroup: 'Rücken', category: 'Verbundübung', equipment: 'Kabelzug' },
  { name: 'Enges Rudern', muscleGroup: 'Rücken', category: 'Verbundübung', equipment: 'Kabelzug' },
  { name: 'Enges Latziehen', muscleGroup: 'Rücken', category: 'Verbundübung', equipment: 'Kabelzug' },
  { name: 'Cable Crunches', muscleGroup: 'Bauch', category: 'Isolationsübung', equipment: 'Kabelzug' },
];

interface PlanItemDef {
  exerciseName: string;
  targetSets: PlanSetTarget[];
  note?: string;
}

interface PlanDef {
  name: string;
  type: string;
  items: PlanItemDef[];
}

export const USER_PLAN_DEFINITIONS: PlanDef[] = [
  {
    name: 'Beine',
    type: 'Beine',
    items: [
      { exerciseName: 'Beinbeuger liegend', targetSets: [{ reps: 4, weight: 90 }, { reps: 5, weight: 86 }] },
      { exerciseName: 'Beinpresse', targetSets: [{ reps: 10, weight: 240 }, { reps: 6, weight: 240 }] },
      { exerciseName: 'Adduktoren', targetSets: [{ reps: 3, weight: 99 }, { reps: 3, weight: 95 }] },
      { exerciseName: 'Abduktoren', targetSets: [{ reps: 5, weight: 81 }, { reps: 6, weight: 77 }] },
      { exerciseName: 'Waden', targetSets: [{ reps: 6, weight: 100 }, { reps: 7, weight: 95 }] },
      { exerciseName: 'Beinstrecker einbeinig', targetSets: [{ reps: 8, weight: 59 }, { reps: 8, weight: 59 }] },
    ],
  },
  {
    name: 'Arme & Schulter',
    type: 'Arme & Schulter',
    items: [
      { exerciseName: 'Preacher Curl', targetSets: [{ reps: 7, weight: 47.5 }, { reps: 7, weight: 45 }] },
      { exerciseName: 'Trizeps Pushdown', targetSets: [{ reps: 6, weight: 23 }, { reps: 5, weight: 23 }] },
      { exerciseName: 'Trizeps über Kopf', targetSets: [{ reps: 5, weight: 36 }, { reps: 8, weight: 32 }] },
      { exerciseName: 'Hammer Curl sitzend', targetSets: [{ reps: 6, weight: 17.5 }, { reps: 9, weight: 16 }] },
      { exerciseName: 'Seitheben', targetSets: [{ reps: 7, weight: 30 }, { reps: 4, weight: 30 }] },
      {
        exerciseName: 'Schulterdrücken Multipresse',
        targetSets: [
          { reps: 4, weight: 55 },
          { reps: 3, weight: 55 },
        ],
      },
      { exerciseName: 'Hintere Schulter', targetSets: [{ reps: 6, weight: 55 }, { reps: 6, weight: 50 }] },
    ],
  },
  {
    name: 'Brust & Rücken',
    type: 'Brust & Rücken',
    items: [
      { exerciseName: 'Butterfly', targetSets: [{ reps: 7, weight: 70 }, { reps: 4, weight: 70 }] },
      { exerciseName: 'Schrägbankdrücken Multipresse', targetSets: [{ reps: 7, weight: 27.5 }, { reps: 8, weight: 25 }] },
      { exerciseName: 'T-Bar Rudern', targetSets: [{ reps: 6, weight: 70 }, { reps: 4, weight: 70 }] },
      { exerciseName: 'Latzug', targetSets: [{ reps: 6, weight: 86 }, { reps: 6, weight: 79 }] },
      { exerciseName: 'Enges Rudern', targetSets: [{ reps: 5, weight: 100 }] },
      { exerciseName: 'Enges Latziehen', targetSets: [{ reps: 8, weight: 86 }] },
      { exerciseName: 'Cable Crunches', targetSets: [{ reps: 7, weight: 77 }, { reps: 8, weight: 73 }] },
    ],
  },
];
