/**
 * Datumshilfen in LOKALER Zeit. `toISOString().slice(0, 10)` liefert dagegen das UTC-Datum —
 * in Deutschland ist dadurch kurz nach Mitternacht (00:00–01:59/02:00 Uhr) noch der Vortag "heute".
 */

/** Lokales Datum als YYYY-MM-DD. */
export function localDateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Verschiebt ein Datum um ganze Kalendertage (sommerzeit-sicher, anders als "± 86400000 ms"). */
export function addDaysLocal(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}
