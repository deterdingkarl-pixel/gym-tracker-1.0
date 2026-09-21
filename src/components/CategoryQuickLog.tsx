import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Primitives';
import { WorkoutPlan, WorkoutSet } from '@/types';
import { Plus, Trash2, Check, X } from 'lucide-react';

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

/**
 * Immer bearbeitbares Formular für eine Trainings-Kategorie (z.B. "Beine").
 * Lädt automatisch den bereits für das gewählte Datum erfassten Eintrag dieser
 * Kategorie (falls vorhanden) oder die Zielwerte aus dem zugehörigen Plan —
 * alle Felder sind direkt editierbar, ohne vorher einen "Bearbeiten"-Button
 * zu drücken.
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

  useEffect(() => {
    const existing = workouts.find((w) => w.planId === plan.id && w.date === date);
    if (existing) {
      setExistingWorkoutId(existing.id);
      setDraftExercises(
        existing.exercises
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((ex) => ({ key: ex.id, exerciseId: ex.exerciseId, sets: ex.sets }))
      );
    } else {
      setExistingWorkoutId(null);
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

  function handleSave() {
    const exerciseLogs = draftExercises.map((de, idx) => ({
      id: uuid(),
      exerciseId: de.exerciseId,
      order: idx,
      sets: de.sets.filter((s) => s.reps > 0 || s.weight > 0),
    }));
    const payload = {
      date,
      planId: plan.id,
      workoutType: plan.type,
      exercises: exerciseLogs,
    };
    if (existingWorkoutId) {
      updateWorkout(existingWorkoutId, payload);
    } else {
      const id = addWorkout(payload);
      setExistingWorkoutId(id);
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  return (
    <div className="border border-surface-border rounded-lg bg-surface-raised p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-ink">{plan.name}</h2>
          <p className="text-xs text-ink-muted mt-0.5">Alle Felder sind direkt bearbeitbar.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            max={todayStr()}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Datum"
            className="bg-surface-overlay border border-surface-border rounded-md px-2.5 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          />
          <button
            onClick={onClose}
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
            <Button size="sm" variant="ghost" onClick={() => addSet(de.key)} className="self-start">
              <Plus size={14} /> Satz hinzufügen
            </Button>
          </div>
        ))}

        <Button variant="secondary" size="sm" onClick={addExerciseRow} className="self-start">
          <Plus size={16} /> Übung hinzufügen
        </Button>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
        <Button onClick={handleSave}>
          <Check size={16} /> {existingWorkoutId ? 'Änderungen speichern' : 'Speichern'}
        </Button>
        {savedFlash && <span className="text-sm text-good">Gespeichert.</span>}
      </div>
    </div>
  );
}
