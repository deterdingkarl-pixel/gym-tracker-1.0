import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Ob Cloud-Synchronisierung konfiguriert ist. Solange keine Supabase-Umgebungsvariablen
 * gesetzt sind, läuft die App wie zuvor rein lokal (localStorage) weiter — es wird
 * kein Login erzwungen.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url ?? 'https://placeholder.supabase.co', anonKey ?? 'placeholder-anon-key');
