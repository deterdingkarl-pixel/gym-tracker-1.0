import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Exercise } from '@/types';

/** Ab dieser Anzahl Übungen wird zusätzlich ein Suchfeld angezeigt. */
const SEARCH_THRESHOLD = 15;

/**
 * Übungsauswahl: alphabetisch sortiertes Dropdown, bei vielen Übungen (z.B. nach dem
 * RepDB-Import) mit Suchfeld darüber. Die aktuell gewählte Übung bleibt immer in der
 * Liste, auch wenn sie nicht zum Suchbegriff passt.
 */
export default function ExerciseSelect({
  exercises,
  value,
  onChange,
}: {
  exercises: Exercise[];
  value: string;
  onChange: (exerciseId: string) => void;
}) {
  const [query, setQuery] = useState('');

  const sorted = useMemo(
    () => exercises.slice().sort((a, b) => a.name.localeCompare(b.name, 'de')),
    [exercises]
  );

  const q = query.trim().toLowerCase();
  const options = useMemo(() => {
    if (!q) return sorted;
    const matches = sorted.filter((e) => e.name.toLowerCase().includes(q));
    const selected = sorted.find((e) => e.id === value);
    if (selected && !matches.some((e) => e.id === selected.id)) return [selected, ...matches];
    return matches;
  }, [sorted, q, value]);

  const showSearch = sorted.length > SEARCH_THRESHOLD;
  const noMatches = q !== '' && options.filter((e) => e.name.toLowerCase().includes(q)).length === 0;

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
      {showSearch && (
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // Enter im Suchfeld darf ein umgebendes Formular nicht abschicken.
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            placeholder="Übung suchen…"
            aria-label="Übung suchen"
            className="w-full min-w-0 bg-surface-overlay border border-surface-border rounded-md pl-8 pr-2.5 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:ring-1 focus:ring-accent outline-none"
          />
        </div>
      )}
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setQuery('');
        }}
        className="w-full min-w-0 bg-surface-overlay border border-surface-border rounded-md px-3 py-2 text-sm text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none"
        aria-label="Übung auswählen"
      >
        {options.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>
      {noMatches && <span className="text-xs text-ink-faint">Keine Übung zu „{query.trim()}" gefunden.</span>}
    </div>
  );
}
