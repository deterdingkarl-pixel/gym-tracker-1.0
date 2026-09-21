import { useAppStore } from '@/store/useAppStore';
import type { AppSettings } from '@/types';

const META_COLOR = { light: '#F4F4F5', dark: '#0A0A0A' } as const;

/** Setzt/entfernt die Klasse `dark` am <html>-Element und passt die Browser-Leistenfarbe an. */
export function applyTheme(theme: AppSettings['theme'] | undefined): void {
  const t = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[t]);
}

/** Wendet das gespeicherte Theme sofort an und folgt späteren Änderungen (Einstellungen, Cloud-Sync, Import). */
export function initTheme(): void {
  applyTheme(useAppStore.getState().settings?.theme);
  useAppStore.subscribe((state, prev) => {
    if (state.settings?.theme !== prev.settings?.theme) applyTheme(state.settings?.theme);
  });
}
