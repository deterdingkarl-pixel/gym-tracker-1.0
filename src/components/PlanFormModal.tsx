import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppStore } from '@/store/useAppStore';
import { Modal, Button, Input } from '@/components/ui/Primitives';
import { PlanExercise, PlanSetTarget, WorkoutPlan } from '@/types';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export default function PlanFormModal({
  open,
  onClose,
  editingPlan,
}: {
  open: boolean;
  onClose: () => void;
  editingPlan?: WorkoutPlan | null;
}) {
  const exercises = useAppStore((s) => s.exercises);
  const addPlan = useAppStore((s) => s.addPlan);
  const updatePlan = useAppStore((s) => s.updatePlan);
  const unit = useAppStore((s) => s.settings.weightUnit);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [items, setItems] = useState<PlanExercise[]>([]);

  useEffect(() => {
    if (!open) return;
    if (editingPlan) {
      setName(editingPlan.name);
      setType(editingPlan.type);
      setItems(editingPlan.exercises.slice().sort((a, b) => a.order - b.order));
    } else {
      setName('');
      setType('');
      setItems([]);
    }
  }, [open, editingPlan]);

  function addItem() {
    if (exercises.length === 0) return;
    setItems((prev) => [
      ...prev,
      {
        id: uuid(),
        exerciseId: exercises[0].id,
        order: prev.length,
        targetSets: [{ reps: 10, weight: undefined }],
      },
    ]);
  }

  function updateItem(id: string, patch: Partial<PlanExercise>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id).map((it, idx) => ({ ...it, order: idx })));
  }

  function move(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((it, i) => ({ ...it, order: i }));
    });
  }

  function addSet(itemId: string) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const last = it.targetSets[it.targetSets.length - 1];
        return { ...it, targetSets: [...it.targetSets, { ...last }] };
      })
    );
  }

  function updateSet(itemId: string, setIdx: number, patch: Partial<PlanSetTarget>) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? { ...it, targetSets: it.targetSets.map((s, i) => (i === setIdx ? { ...s, ...patch } : s)) }
          : it
      )
    );
  }

  function removeSet(itemId: string, setIdx: number) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? { ...it, targetSets: it.targetSets.filter((_, i) => i !== setIdx) } : it
      )
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || items.length === 0) return;
    const payload = {
      name: name.trim(),
      type: type.trim() || 'Individuell',
      exercises: items,
      isFavorite: editingPlan?.isFavorite ?? false,
    };
    if (editingPlan) {
      updatePlan(editingPlan.id, payload);
    } else {
      addPlan(payload);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={editingPlan ? 'Plan bearbeiten' : 'Neuer Trainingsplan'} width="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Name des Plans" value={name} onChange={(e) => setName(e.target.value)} required placeholder="z.B. Push Day" />
          <Input label="Art / Kategorie" value={type} onChange={(e) => setType(e.target.value)} placeholder="z.B. Push, Pull, Beine, Ganzkörper" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Übungen im Plan</h3>
            <Button type="button" size="sm" variant="secondary" onClick={addItem}>
              <Plus size={16} /> Übung hinzufügen
            </Button>
          </div>
          {items.length === 0 && <p className="text-sm text-ink-muted">Noch keine Übungen im Plan.</p>}
          {items.map((it, idx) => (
            <div key={it.id} className="border border-surface-border rounded-md p-3 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <button type="button" onClick={() => move(it.id, -1)} disabled={idx === 0} aria-label="Nach oben verschieben" className="text-ink-faint hover:text-ink disabled:opacity-30">
                    <ChevronUp size={14} />
                  </button>
                  <button type="button" onClick={() => move(it.id, 1)} disabled={idx === items.length - 1} aria-label="Nach unten verschieben" className="text-ink-faint hover:text-ink disabled:opacity-30">
                    <ChevronDown size={14} />
                  </button>
                </div>
                <select
                  value={it.exerciseId}
                  onChange={(e) => updateItem(it.id, { exerciseId: e.target.value })}
                  className="flex-1 bg-surface-overlay border border-surface-border rounded-md px-3 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
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
                <button type="button" onClick={() => removeItem(it.id)} aria-label="Übung entfernen" className="p-2 text-ink-faint hover:text-warn rounded-md hover:bg-surface-overlay">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1.5rem_1fr_1fr_2rem] gap-1.5 text-[11px] text-ink-faint px-1">
                  <span>Satz</span>
                  <span>Ziel-Wdh.</span>
                  <span>Zielgewicht ({unit})</span>
                  <span />
                </div>
                {it.targetSets.map((set, si) => (
                  <div key={si} className="grid grid-cols-[1.5rem_1fr_1fr_2rem] gap-1.5 items-center">
                    <span className="text-sm text-ink-muted text-center">{si + 1}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={set.reps || ''}
                      onChange={(e) => updateSet(it.id, si, { reps: Number(e.target.value) })}
                      className="bg-surface-overlay border border-surface-border rounded-md px-2.5 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                      aria-label={`Ziel-Wiederholungen Satz ${si + 1}`}
                    />
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      min={0}
                      value={set.weight ?? ''}
                      onChange={(e) =>
                        updateSet(it.id, si, { weight: e.target.value ? Number(e.target.value) : undefined })
                      }
                      placeholder="–"
                      className="bg-surface-overlay border border-surface-border rounded-md px-2.5 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                      aria-label={`Zielgewicht Satz ${si + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeSet(it.id, si)}
                      disabled={it.targetSets.length <= 1}
                      aria-label={`Satz ${si + 1} entfernen`}
                      className="p-2 text-ink-faint hover:text-warn rounded-md hover:bg-surface-overlay justify-self-center disabled:opacity-30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="ghost" onClick={() => addSet(it.id)} className="self-start">
                  <Plus size={14} /> Satz hinzufügen
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
          <Button type="button" variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button type="submit" disabled={!name.trim() || items.length === 0}>
            {editingPlan ? 'Änderungen speichern' : 'Plan speichern'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
