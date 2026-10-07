import { Workout } from '@/types';
import { addWeeks, format, parseISO, startOfWeek, subWeeks } from 'date-fns';
import { trainingDays } from '@/lib/calculations';

/** Mindestanzahl Trainingstage pro Kalenderwoche (Mo–So), damit die Woche für die Serie zählt. */
export const WEEKLY_GOAL = 4;

const fmt = (d: Date) => format(d, 'yyyy-MM-dd');
const weekStart = (d: Date) => startOfWeek(d, { weekStartsOn: 1 });

/** Wochen (Montag als YYYY-MM-DD), in denen mindestens `goal` verschiedene Tage trainiert wurde. */
function qualifyingWeekKeys(workouts: Workout[], goal: number): Set<string> {
  const perWeek = new Map<string, number>();
  for (const day of trainingDays(workouts)) {
    const key = fmt(weekStart(parseISO(day)));
    perWeek.set(key, (perWeek.get(key) ?? 0) + 1);
  }
  const result = new Set<string>();
  perWeek.forEach((count, key) => {
    if (count >= goal) result.add(key);
  });
  return result;
}

/**
 * Aktuelle Wochenserie: Anzahl aufeinanderfolgender Wochen mit mindestens `goal`
 * Trainingstagen. Die laufende Woche zählt mit, sobald sie das Ziel erreicht hat; solange
 * sie es noch nicht erreicht hat, bricht sie die Serie nicht ab (es zählt ab der Vorwoche).
 */
export function currentWeeklyStreak(workouts: Workout[], goal = WEEKLY_GOAL, today = new Date()): number {
  const weeks = qualifyingWeekKeys(workouts, goal);
  let cursor = weekStart(today);
  if (!weeks.has(fmt(cursor))) cursor = subWeeks(cursor, 1);
  let streak = 0;
  while (weeks.has(fmt(cursor))) {
    streak += 1;
    cursor = subWeeks(cursor, 1);
  }
  return streak;
}

/** Längste jemals erreichte Wochenserie. */
export function longestWeeklyStreak(workouts: Workout[], goal = WEEKLY_GOAL): number {
  const keys = Array.from(qualifyingWeekKeys(workouts, goal)).sort();
  if (keys.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < keys.length; i++) {
    if (keys[i] === fmt(addWeeks(parseISO(keys[i - 1]), 1))) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function weeksLabel(n: number): string {
  return `${n} ${n === 1 ? 'Woche' : 'Wochen'}`;
}
