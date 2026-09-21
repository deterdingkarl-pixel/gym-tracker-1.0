import { useAppStore } from '@/store/useAppStore';

const LIGHT = {
  grid: '#D4D4D8', axis: '#71717A', primary: '#3F3F46', secondary: '#A1A1AA', bar2: '#52525B',
  tipBg: '#FFFFFF', tipBorder: '#D4D4D8', tipText: '#18181B', cursor: 'rgba(24,24,27,0.06)',
};
const DARK = {
  grid: '#333333', axis: '#9A9AA2', primary: '#E4E4E7', secondary: '#71717A', bar2: '#A1A1AA',
  tipBg: '#171717', tipBorder: '#3A3A3A', tipText: '#F4F4F5', cursor: 'rgba(255,255,255,0.08)',
};

/** Farben für Recharts (die Bibliothek kennt unsere CSS-Variablen nicht), passend zum aktuellen Theme. */
export function useChartTheme() {
  const dark = useAppStore((s) => s.settings?.theme === 'dark');
  const c = dark ? DARK : LIGHT;
  return {
    ...c,
    tooltip: {
      contentStyle: { background: c.tipBg, border: `1px solid ${c.tipBorder}`, borderRadius: 8 },
      labelStyle: { color: c.tipText },
      cursor: { fill: c.cursor, stroke: c.axis },
    },
  };
}
