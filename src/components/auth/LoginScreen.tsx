import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, Button, Input } from '@/components/ui/Primitives';
import { Dumbbell, Cloud } from 'lucide-react';

export default function LoginScreen({ onGuest }: { onGuest: () => void }) {
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const authError = useAuthStore((s) => s.authError);
  const clearError = useAuthStore((s) => s.clearError);
  const loading = useAuthStore((s) => s.loading);

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    if (mode === 'signin') {
      await signIn(email, password);
    } else {
      const ok = await signUp(email, password);
      if (ok) setSignupSuccess(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <Card className="w-full max-w-sm p-6 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-md bg-accent-soft flex items-center justify-center">
            <Dumbbell size={20} className="text-accent" />
          </div>
          <h1 className="text-lg font-semibold">Gym App</h1>
          <p className="text-sm text-ink-muted flex items-center gap-1.5">
            <Cloud size={14} /> Melde dich an, um deine Trainings geräteübergreifend zu synchronisieren.
          </p>
        </div>

        <div className="flex rounded-md bg-surface-overlay p-1 border border-surface-border">
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setSignupSuccess(false);
                clearError();
              }}
              className={`flex-1 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                mode === m ? 'bg-accent-soft text-accent' : 'text-ink-muted'
              }`}
            >
              {m === 'signin' ? 'Anmelden' : 'Registrieren'}
            </button>
          ))}
        </div>

        {signupSuccess ? (
          <div className="text-sm text-good bg-good/10 border border-good/30 rounded-md p-3">
            Konto erstellt. Falls eine Bestätigungsmail erforderlich ist, prüfe dein Postfach — danach kannst du dich
            anmelden.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="E-Mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
            {authError && <p className="text-sm text-warn">{authError}</p>}
            <Button type="submit" disabled={loading} className="mt-1">
              {loading ? 'Bitte warten…' : mode === 'signin' ? 'Anmelden' : 'Konto erstellen'}
            </Button>
          </form>
        )}

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-surface-border" />
          <span className="text-xs text-ink-faint">oder</span>
          <div className="h-px flex-1 bg-surface-border" />
        </div>

        <Button variant="secondary" onClick={onGuest}>
          Ohne Anmeldung nutzen (nur lokal, kein Sync)
        </Button>
      </Card>
    </div>
  );
}
