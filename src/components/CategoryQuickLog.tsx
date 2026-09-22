import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppStore } from '@/store/useAppStore';
import { WorkoutPlan, WorkoutSet } from '@/types';
import { Plus, Trash2, X, Timer } from 'lucide-react';

interface DraftExercise {
  key: string;
  exerciseId: string;
  sets: WorkoutSet[];
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function emptySet(): WorkoutSet {
  return { id: uuid(), weight: 0, reps: 0 };
}

function hasAnyValue(list: DraftExercise[]) {
  return list.some((e) => e.sets.some((s) => s.reps > 0 || s.weight > 0));
}

function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/**
 * Immer bearbeitbares Formular für eine Trainings-Kategorie (z.B. "Beine"). Lädt
 * automatisch den bereits für das gewählte Datum erfassten Eintrag dieser Kategorie
 * (falls vorhanden) oder die Zielwerte aus dem zugehörigen Plan.
 *
 * Speichert automatisch (debounced, kein Speichern-Button nötig) — dadurch gehen
 * Eingaben nicht verloren, auch wenn die App zwischendurch geschlossen wird.
 * Ab dem ersten gespeicherten Wert wird eine Trainingsdauer angezeigt. Diese basiert
 * auf einem gespeicherten Startzeitpunkt (`Workout.startedAt`) und wird bei jedem
 * Öffnen aus der echten Ist-Zeit neu berechnet — es gibt keinen echten
 * Hintergrundprozess (reine Web-App), die Anzeige "läuft" also nur, solange die
 * App/der Tab offen ist, zeigt beim Wiederöffnen aber wieder die korrekte
 * verstrichene Zeit.
 */
export default function CategoryQuickLog({ plan, onClose }: { plan: WorkoutPlan; onClose: () => void }) {
  const workouts = useAppStore((s) => s.workouts);
  const exercises = useAppStore((s) => s.exercises);
  const unit = useAppStore((s) => s.settings.weightUnit);
  const addWorkout = useAppStore((s) => s.addWorkout);
  const updateWorkout = useAppStore((s) => s.updateWorkout);

  const [date, setDate] = useState(todayStr());
  const [existingWorkoutId, setExistingWorkoutId] = useState<string | null>(null);
  const [draftExercises, setDraftExercises] = useState<DraftExercise[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  const skipNextAutosave = useRef(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const workoutIdRef = useRef<string | null>(null);
  const startedAtRef = useRef<string | null>(null);

  // Tickt die Anzeige jede Sekunde — Grundlage ist immer die echte Uhrzeit, nicht ein
  // Zähler, der beim Schließen der App verloren gehen könnte.
  useEffect(() => {
    if (!startedAt) return;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  useEffect(() => {
    skipNextAutosave.current = true;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const existing = workouts.find((w) => w.planId === plan.id && w.date === date);
    if (existing) {
      workoutIdRef.current = existing.id;
      startedAtRef.current = existing.startedAt ?? existing.createdAt;
      setExistingWorkoutId(existing.id);
      setStartedAt(startedAtRef.current);
      setDraftExercises(
        existing.exercises
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((ex) => ({ key: ex.id, exerciseId: ex.exerciseId, sets: ex.sets }))
      );
    } else {
      workoutIdRef.current = null;
      startedAtRef.current = null;
      setExistingWorkoutId(null);
      setStartedAt(null);
      setDraftExercises(
        plan.exercises
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((pe) => ({
            key: uuid(),
            exerciseId: pe.exerciseId,
            sets: pe.targetSets.map((ts) => ({ id: uuid(), weight: ts.weight ?? 0, reps: ts.reps })),
          }))
      );
    }
    setSavedFlash(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.id, date]);

  function exerciseName(id: string) {
    return exercises.find((e) => e.id === id)?.name ?? 'Unbekannte Übung';
  }

  function persistNow(list: DraftExercise[]) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!workoutIdRef.current && !hasAnyValue(list)) return; // nichts eingetragen -> noch nichts anlegen

    const exerciseLogs = list.map((de, idx) => ({
      id: uuid(),
      exerciseId: de.exerciseId,
      order: idx,
      sets: de.sets.filter((s) => s.reps > 0 || s.weight > 0),
    }));

    if (workoutIdRef.current) {
      updateWorkout(workoutIdRef.current, {
        date,
        planId: plan.id,
        workoutType: plan.type,
        exercises: exerciseLogs,
      });
    } else {
      const now = new Date().toISOString();
      const id = addWorkout({
        date,
        planId: plan.id,
        workoutType: plan.type,
        exercises: exerciseLogs,
        startedAt: now,
      });
      workoutIdRef.current = id;
      startedAtRef.current = now;
      setExistingWorkoutId(id);
      setStartedAt(now);
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  function scheduleAutosave(list: DraftExercise[]) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persistNow(list), 700);
  }

  useEffect(() => {
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false;
      return;
    }
    scheduleAutosave(draftExercises);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftExercises]);

  function updateSet(key: string, setId: string, patch: Partial<WorkoutSet>) {
    setDraftExercises((prev) =>
      prev.map((e) =>
        e.key === key ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) } : e
      )
    );
  }

  function addSet(key: string) {
    setDraftExercises((prev) => prev.map((e) => (e.key === key ? { ...e, sets: [...e.sets, emptySet()] } : e)));
  }

  function removeSet(key: string, setId: string) {
    setDraftExercises((prev) =>
      prev.map((e) => (e.key === key ? { ...e, sets: e.sets.filter((s) => s.id !== setId) } : e))
    );
  }

  function removeExercise(key: string) {
    setDraftExercises((prev) => prev.filter((e) => e.key !== key));
  }

  function addExerciseRow() {
    if (exercises.length === 0) return;
    const unused = exercises.find((ex) => !draftExercises.some((d) => d.exerciseId === ex.id)) ?? exercises[0];
    setDraftExercises((prev) => [...prev, { key: uuid(), exerciseId: unused.id, sets: [emptySet()] }]);
  }

  function updateExerciseId(key: string, exerciseId: string) {
    setDraftExercises((prev) => prev.map((e) => (e.key === key ? { ...e, exerciseId } : e)));
  }

  function handleClose() {
    // Ausstehende Änderungen sofort schreiben, bevor geschlossen wird.
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      persistNow(draftExercises);
    }
    onClose();
  }

  const elapsedLabel = startedAt ? formatDuration(nowTick - new Date(startedAt).getTime()) : null;

  return (
    <div className="border border-surface-border rounded-lg bg-surface-raised p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-ink">{plan.name}</h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Alle Felder sind direkt bearbeitbar — wird automatisch gespeichert.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {elapsedLabel && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent tabular-nums">
              <Timer size={15} /> {elapsedLabel}
            </span>
          )}
          <input
            type="date"
            value={date}
            max={todayStr()}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Datum"
            className="bg-surface-overlay border border-surface-border rounded-md px-2.5 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          />
          <button
            onClick={handleClose}
            aria-label="Schließen"
            className="p-2 text-ink-faint hover:text-ink rounded-md hover:bg-surface-overlay"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {draftExercises.map((de) => (
          <div key={de.key} className="border border-surface-border rounded-md p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <select
                value={de.exerciseId}
                onChange={(e) => updateExerciseId(de.key, e.target.value)}
                className="flex-1 min-w-0 bg-surface-overlay border border-surface-border rounded-md px-3 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                aria-label="Übung auswählen"
              >
                {exercises
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
              </select>
              <button
                onClick={() => removeExercise(de.key)}
                aria-label={`${exerciseName(de.exerciseId)} aus dieser Einheit entfernen`}
                className="p-2 text-ink-faint hover:text-warn rounded-md hover:bg-surface-overlay"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2rem] gap-1.5 text-[11px] text-ink-faint px-1">
              <span>Satz</span>
              <span>Gewicht ({unit})</span>
              <span>Wdh.</span>
              <span>RPE</span>
              <span />
            </div>
            {de.sets.map((set, si) => (
              <div key={set.id} className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2rem] gap-1.5 items-center">
                <span className="text-sm text-ink-muted text-center">{si + 1}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min={0}
                  value={set.weight || ''}
                  onChange={(e) => updateSet(de.key, set.id, { weight: Number(e.target.value) })}
                  className="w-full min-w-0 bg-surface-overlay border border-surface-border rounded-md px-2 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  aria-label={`Gewicht Satz ${si + 1}`}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={set.reps || ''}
                  onChange={(e) => updateSet(de.key, set.id, { reps: Number(e.target.value) })}
                  className="w-full min-w-0 bg-surface-overlay border border-surface-border rounded-md px-2 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  aria-label={`Wiederholungen Satz ${si + 1}`}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10}
                  value={set.rpe ?? ''}
                  onChange={(e) =>
                    updateSet(de.key, set.id, { rpe: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="–"
                  className="w-full min-w-0 bg-surface-overlay border border-surface-border rounded-md px-2 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  aria-label={`RPE Satz ${si + 1}`}
                />
                <button
                  onClick={() => removeSet(de.key, set.id)}
                  disabled={de.sets.length <= 1}
                  aria-label={`Satz ${si + 1} entfernen`}
                  className="p-1.5 text-ink-faint hover:text-warn rounded-md hover:bg-surface-overlay justify-self-center disabled:opacity-30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addSet(de.key)}
              className="self-start text-sm text-ink-muted hover:text-ink flex items-center gap-1 px-2 py-1"
            >
              <Plus size={14} /> Satz hinzufügen
            </button>
          </div>
        ))}

        <button
          onClick={addExerciseRow}
          className="self-start text-sm bg-surface-overlay border border-surface-border rounded-md px-3 py-1.5 text-ink hover:bg-surface-border flex items-center gap-1.5"
        >
          <Plus size={16} /> Übung hinzufügen
        </button>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
        <span className="text-xs text-ink-faint">
          {existingWorkoutId ? 'Wird laufend gespeichert.' : 'Noch nichts eingetragen.'}
        </span>
        {savedFlash && <span className="text-sm text-good">Gespeichert.</span>}
      </div>
    </div>
  );
}
