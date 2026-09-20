import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchCloudData, pushCloudData } from '@/lib/cloudSync';
import { AppData } from '@/types';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

/**
 * Rendert nichts sichtbares. Sobald ein Nutzer angemeldet ist:
 * 1. Lädt einmalig den in der Cloud gespeicherten Stand (falls vorhanden) und ersetzt
 *    damit die lokalen Daten — oder legt, falls noch keine Cloud-Daten existieren,
 *    die aktuellen lokalen Daten dort als Ausgangspunkt an.
 * 2. Überträgt danach jede lokale Änderung (mit kurzer Verzögerung) automatisch in die Cloud.
 */
export default function CloudSync({ onStatusChange }: { onStatusChange?: (s: SyncStatus) => void }) {
  const user = useAuthStore((s) => s.user);
  const replaceAllData = useAppStore((s) => s.replaceAllData);
  const appData = useAppStore((s): AppData => ({
    version: s.version,
    exercises: s.exercises,
    plans: s.plans,
    workouts: s.workouts,
    bodyMetrics: s.bodyMetrics,
    settings: s.settings,
  }));

  const hydratedRef = useRef(false);
  const lastSyncedRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, setStatus] = useState<SyncStatus>('idle');

  function report(s: SyncStatus) {
    setStatus(s);
    onStatusChange?.(s);
  }

  // Einmalig beim Login: Cloud-Stand laden oder anlegen.
  useEffect(() => {
    hydratedRef.current = false;
    if (!user) return;
    let cancelled = false;
    report('syncing');
    (async () => {
      const cloud = await fetchCloudData(user.id);
      if (cancelled) return;
      if (cloud) {
        lastSyncedRef.current = JSON.stringify(cloud);
        replaceAllData(cloud);
      } else {
        const ok = await pushCloudData(user.id, appData);
        if (!cancelled) lastSyncedRef.current = ok ? JSON.stringify(appData) : null;
      }
      if (!cancelled) {
        hydratedRef.current = true;
        report('synced');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Bei jeder lokalen Änderung (verzögert) in die Cloud schreiben.
  useEffect(() => {
    if (!user || !hydratedRef.current) return;
    const serialized = JSON.stringify(appData);
    if (serialized === lastSyncedRef.current) return;

    report('syncing');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const ok = await pushCloudData(user.id, appData);
      lastSyncedRef.current = ok ? serialized : lastSyncedRef.current;
      report(ok ? 'synced' : 'error');
    }, 1200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appData, user?.id]);

  return null;
}
