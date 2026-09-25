import { supabase } from './supabaseClient';
import { AppData } from '@/types';

const TABLE = 'user_data';

export interface CloudFetchResult {
  data: AppData;
  updatedAt: string;
}

/**
 * Lädt den gespeicherten App-Zustand eines Nutzers aus Supabase, inklusive des
 * Zeitstempels der letzten Cloud-Änderung (`updated_at`). CloudSync.tsx nutzt diesen
 * Zeitstempel, um zu entscheiden, ob der Cloud- oder der lokale Stand aktueller ist,
 * statt den lokalen Stand blind zu überschreiben.
 *
 * Gibt `null` zurück, wenn es tatsächlich noch keine Cloud-Daten für diesen Nutzer
 * gibt. Wirft dagegen bei einem echten Ladefehler (Netzwerk/Server).
 */
export async function fetchCloudData(userId: string): Promise<CloudFetchResult | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('data, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Cloud-Daten konnten nicht geladen werden:', error);
    throw new Error('cloud-fetch-failed');
  }
  if (!data) return null;
  return { data: data.data as AppData, updatedAt: data.updated_at as string };
}

/** Schreibt den kompletten App-Zustand eines Nutzers nach Supabase (upsert). */
export async function pushCloudData(userId: string, data: AppData): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

  if (error) {
    console.error('Cloud-Daten konnten nicht gespeichert werden:', error);
    return false;
  }
  return true;
}
