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
 * 1. Gleicht den Cloud-Stand mit dem lokalen Stand ab:
 *    - Cloud NEUER als lokal (z.B. anderes Gerät) -> lokal wird durch Cloud ersetzt.
 *    - Lokal genauso aktuell oder neuer -> lokale Daten bleiben erhalten und werden hochgeladen.
 *    Echter Ladefehler (Netzwerk/Server): es wird NICHTS hochgeladen — vorhandene
 *    Cloud-Daten werden nie durch einen Ladefehler überschrieben.
 *    Dieser Abgleich läuft beim Anmelden UND jedes Mal, wenn die App wieder in den
 *    Vordergrund kommt (z.B. Handy entsperrt, Tab wieder geöffnet). Ohne das zeigt eine
 *    im Hintergrund gebliebene App weiter den alten Stand und würde bei der nächsten
 *    Eingabe die neueren Daten vom anderen Gerät überschreiben.
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
  const syncingRef = useRef(false);
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

  /** Cloud-Stand laden und mit dem lokalen Stand abgleichen (Anmeldung + Rückkehr in die App). */
  async function syncFromCloud(uid: string, initial: boolean) {
    if (syncingRef.current) return;
    syncingRef.current = true;
    report('syncing');
    try {
      const cloud = await fetchCloudData(uid);
      if (userIdRef.current !== uid) return;

      const localModified = getLastModified();
      const localTime = localModified ? new Date(localModified).getTime() : 0;
      const cloudTime = cloud ? new Date(cloud.updatedAt).getTime() : -1;

      if (cloud && cloudTime > localTime) {
        lastSyncedRef.current = JSON.stringify(cloud.data);
        replaceAllData(cloud.data);
      } else {
        const toPush = appDataRef.current;
        const ok = await pushCloudData(uid, toPush);
        lastSyncedRef.current = ok ? JSON.stringify(toPush) : null;
      }

      if (initial) {
        ensureDefaultTrainingPlanSeeded();
        void ensureRepDbAutoImported();
        hydratedRef.current = true;
      }
      report('synced');
    } catch {
      report('error');
    } finally {
      syncingRef.current = false;
    }
  }

  // Ausstehende Änderungen sofort übertragen, wenn die App in den Hintergrund geht oder
  // geschlossen wird; beim Zurückkehren in den Vordergrund erneut mit der Cloud abgleichen.
  useEffect(() => {
    function resync() {
      const uid = userIdRef.current;
      if (uid && hydratedRef.current) void syncFromCloud(uid, false);
    }
    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') flushPendingPush();
      else resync();
    }
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) resync();
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', flushPendingPush);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', flushPendingPush);
      window.removeEventListener('pageshow', onPageShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Einmalig beim Login: Cloud-Stand laden und mit dem lokalen Stand abgleichen.
  useEffect(() => {
    hydratedRef.current = false;
    if (!user) return;
    void syncFromCloud(user.id, true);
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
