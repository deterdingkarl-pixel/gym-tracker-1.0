import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchCloudData, pushCloudData } from '@/lib/cloudSync';
import { getLastModified } from '@/lib/storage';
import { ensureDefaultTrainingPlanSeeded, ensureRepDbAutoImported } from '@/lib/defaultPlanSeed';
import { AppData } from '@/types';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

/**
 * Rendert nichts sichtbares. Sobald ein Nutzer angemeldet ist:
 * 1. Lädt einmalig den Cloud-Stand und vergleicht ihn mit dem lokalen Stand:
 *    - Cloud NEUER als lokal (z.B. anderes Gerät) -> lokal wird durch Cloud ersetzt.
 *    - Lokal genauso aktuell oder neuer (z.B. weil kurz vor dem Schließen noch etwas
 *      eingetragen wurde und der Cloud-Push das nicht mehr geschafft hat) -> lokale
 *      Daten bleiben erhalten und werden in die Cloud hochgeladen. Verhindert, dass
 *      frisch eingetragene, aber noch nicht hochgeladene Trainings beim nächsten
 *      Öffnen durch einen älteren Cloud-Stand überschrieben werden.
 *    Echter Ladefehler (Netzwerk/Server): es wird NICHTS hochgeladen, bis ein erneuter
 *    Ladeversuch erfolgreich war — vorhandene Cloud-Daten werden nie durch einen
 *    Ladefehler überschrieben.
 * 2. Überträgt jede lokale Änderung (kurz verzögert) automatisch in die Cloud. Geht die
 *    App/der Tab in der Zwischenzeit in den Hintergrund oder wird geschlossen, wird eine
 *    noch ausstehende Änderung sofort (ohne die Verzögerung abzuwarten) übertragen.
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
  const appDataRef = useRef(appData);
  appDataRef.current = appData;
  const userIdRef = useRef<string | null>(null);
  userIdRef.current = user?.id ?? null;
  const [, setStatus] = useState<SyncStatus>('idle');

  function report(s: SyncStatus) {
    setStatus(s);
    onStatusChange?.(s);
  }

  function flushPendingPush() {
    if (!debounceRef.current) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = null;
    const uid = userIdRef.current;
    if (!uid || !hydratedRef.current) return;
    const serialized = JSON.stringify(appDataRef.current);
    if (serialized === lastSyncedRef.current) return;
    pushCloudData(uid, appDataRef.current).then((ok) => {
      if (ok) lastSyncedRef.current = serialized;
    });
  }

  // Ausstehende Änderungen sofort übertragen, wenn die App in den Hintergrund geht oder
  // geschlossen wird — sonst geht ein kurz vorher eingetragenes Training verloren, falls
  // das Handy/der Tab vor Ablauf der Debounce-Verzögerung pausiert wird.
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') flushPendingPush();
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', flushPendingPush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', flushPendingPush);
    };
  }, []);

  // Einmalig beim Login: Cloud-Stand laden und mit dem lokalen Stand abgleichen.
  useEffect(() => {
    hydratedRef.current = false;
    if (!user) return;
    let cancelled = false;
    report('syncing');
    (async () => {
      try {
        const cloud = await fetchCloudData(user.id);
        if (cancelled) return;

        const localModified = getLastModified();
        const localTime = localModified ? new Date(localModified).getTime() : 0;
        const cloudTime = cloud ? new Date(cloud.updatedAt).getTime() : -1;

        if (cloud && cloudTime > localTime) {
          lastSyncedRef.current = JSON.stringify(cloud.data);
          replaceAllData(cloud.data);
        } else {
          const ok = await pushCloudData(user.id, appDataRef.current);
          if (!cancelled) lastSyncedRef.current = ok ? JSON.stringify(appDataRef.current) : null;
        }

        if (!cancelled) {
          ensureDefaultTrainingPlanSeeded();
          void ensureRepDbAutoImported();
          hydratedRef.current = true;
          report('synced');
        }
      } catch {
        if (!cancelled) report('error');
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
      debounceRef.current = null;
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
