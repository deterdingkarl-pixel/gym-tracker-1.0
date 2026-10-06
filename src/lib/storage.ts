import { AppData } from '@/types';
import { localDateStr } from '@/lib/dateUtils';

export const STORAGE_KEY = 'iron-log:data';
export const LAST_MODIFIED_KEY = 'iron-log:last-modified';

export function loadFromStorage(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppData;
  } catch (err) {
    console.error('Konnte Daten nicht aus localStorage laden:', err);
    return null;
  }
}

export function saveToStorage(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(LAST_MODIFIED_KEY, new Date().toISOString());
  } catch (err) {
    console.error('Konnte Daten nicht in localStorage speichern:', err);
  }
}

/**
 * Zeitpunkt (ISO) der letzten lokalen Änderung — wird bei jedem `saveToStorage`-Aufruf
 * aktualisiert. Dient CloudSync als Vergleichswert, um beim Öffnen der App zu entscheiden,
 * ob der lokale oder der Cloud-Stand aktueller ist (siehe src/components/CloudSync.tsx).
 */
export function getLastModified(): string | null {
  try {
    return localStorage.getItem(LAST_MODIFIED_KEY);
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
  try {
    localStorage.removeItem(LAST_MODIFIED_KEY);
  } catch {
    // ignore
  }
}

export function exportAsJson(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = localDateStr();
  a.href = url;
  a.download = `iron-log-export-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

const isObj = (v: unknown): v is Record<string, any> => typeof v === 'object' && v !== null;

/**
 * Prüft eine importierte JSON-Datei strenger als nur "hat exercises-Array":
 * Pflichtlisten (exercises, plans, workouts) und je Eintrag die wichtigsten Felder.
 * Fehlende optionale Teile (bodyMetrics, settings) werden mit Standardwerten ergänzt.
 * Wirft bei ungültigem Inhalt einen Error (Settings.tsx zeigt dann die Fehlermeldung).
 */
export function parseImportedJson(text: string): AppData {
  const parsed = JSON.parse(text);
  if (!isObj(parsed)) throw new Error('Ungültiges Dateiformat.');

  if (!Array.isArray(parsed.exercises) || !Array.isArray(parsed.plans) || !Array.isArray(parsed.workouts)) {
    throw new Error('Ungültiges Dateiformat: exercises, plans und workouts müssen Listen sein.');
  }
  const exercisesOk = parsed.exercises.every(
    (e: unknown) => isObj(e) && typeof e.id === 'string' && typeof e.name === 'string'
  );
  const plansOk = parsed.plans.every(
    (p: unknown) => isObj(p) && typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.exercises)
  );
  const workoutsOk = parsed.workouts.every(
    (w: unknown) =>
      isObj(w) &&
      typeof w.id === 'string' &&
      typeof w.date === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(w.date) &&
      Array.isArray(w.exercises)
  );
  if (!exercisesOk || !plansOk || !workoutsOk) {
    throw new Error('Ungültiges Dateiformat: Einträge in exercises, plans oder workouts sind unvollständig.');
  }

  const settings = isObj(parsed.settings) ? parsed.settings : {};
  return {
    version: 1,
    exercises: parsed.exercises,
    plans: parsed.plans,
    workouts: parsed.workouts,
    bodyMetrics: Array.isArray(parsed.bodyMetrics) ? parsed.bodyMetrics : [],
    settings: {
      weightUnit: settings.weightUnit === 'lb' ? 'lb' : 'kg',
      theme: settings.theme === 'dark' ? 'dark' : 'light',
    },
  } as AppData;
}
