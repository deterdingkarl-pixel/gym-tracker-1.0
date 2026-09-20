import { supabase } from './supabaseClient';
import { AppData } from '@/types';

const TABLE = 'user_data';

/** Lädt den gespeicherten App-Zustand eines Nutzers aus Supabase, falls vorhanden. */
export async function fetchCloudData(userId: string): Promise<AppData | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Cloud-Daten konnten nicht geladen werden:', error);
    return null;
  }
  return (data?.data as AppData) ?? null;
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
