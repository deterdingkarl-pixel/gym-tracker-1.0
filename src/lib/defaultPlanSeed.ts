import { v4 as uuid } from 'uuid';
import { useAppStore } from '@/store/useAppStore';
import { USER_PLAN_EXERCISES, USER_PLAN_DEFINITIONS } from '@/data/userPlan';
import { fetchRepDbExercises } from '@/lib/repdbImport';

const REPDB_AUTO_IMPORT_FLAG = 'iron-log:repdb-auto-imported';

/**
 * Fügt den fest hinterlegten Standard-Trainingsplan hinzu, falls er noch nicht
 * vorhanden ist. Prüft anhand der Plan-Namen (nicht anhand eines Flags), ist
 * also sicher mehrfach aufrufbar — auch auf einem zweiten Gerät, auf dem der
 * Plan über die Cloud-Synchronisierung bereits angekommen ist.
 */
export function ensureDefaultTrainingPlanSeeded(): void {
  const { plans, bulkAddExercises, addPlan } = useAppStore.getState();

  const missingPlans = USER_PLAN_DEFINITIONS.filter(
    (def) => !plans.some((p) => p.name.trim().toLowerCase() === def.name.trim().toLowerCase())
  );
  if (missingPlans.length === 0) return;

  bulkAddExercises(USER_PLAN_EXERCISES);

  // Nach dem Hinzufügen frischen Zustand lesen, um Übungs-IDs (neu ODER bereits vorhanden) aufzulösen.
  const { exercises: currentExercises } = useAppStore.getState();
  const findExerciseId = (name: string) =>
    currentExercises.find((e) => e.name.trim().toLowerCase() === name.trim().toLowerCase())?.id;

  for (const def of missingPlans) {
    const items = def.items
      .map((item, idx) => {
        const exerciseId = findExerciseId(item.exerciseName);
        if (!exerciseId) return null;
        return {
          id: uuid(),
          exerciseId,
          order: idx,
          targetSets: item.targetSets,
          note: item.note,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (items.length === 0) continue;

    addPlan({
      name: def.name,
      type: def.type,
      exercises: items,
      isFavorite: true,
    });
  }
}

/**
 * Importiert die externe Übungsdatenbank (RepDB) einmalig automatisch im
 * Hintergrund, damit beim Eintragen von Trainings möglichst immer eine
 * passende Übung zur Auswahl steht, ohne dass man selbst danach suchen oder
 * den Button in den Einstellungen klicken muss. Läuft pro Browser nur einmal
 * (Flag in localStorage) und schlägt bei fehlendem Netzwerk lautlos fehl —
 * der manuelle Button in den Einstellungen bleibt als Fallback bestehen.
 */
export async function ensureRepDbAutoImported(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(REPDB_AUTO_IMPORT_FLAG) === '1') return;
  try {
    const list = await fetchRepDbExercises();
    useAppStore.getState().bulkAddExercises(list);
    localStorage.setItem(REPDB_AUTO_IMPORT_FLAG, '1');
  } catch (err) {
    // Kein Netzwerk oder Datensatz nicht erreichbar — beim nächsten Start erneut versuchen.
    console.warn('Automatischer Übungsdatenbank-Import fehlgeschlagen:', err);
  }
}
