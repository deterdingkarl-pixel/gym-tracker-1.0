import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import LogWorkout from '@/pages/LogWorkout';
import Plans from '@/pages/Plans';
import Exercises from '@/pages/Exercises';
import Progress from '@/pages/Progress';
import Settings from '@/pages/Settings';
import LoginScreen from '@/components/auth/LoginScreen';
import CloudSync from '@/components/CloudSync';
import { useAuthStore } from '@/store/useAuthStore';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

const GUEST_MODE_KEY = 'iron-log:guest-mode';

function RoutedApp() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/training-eintragen" element={<LogWorkout />} />
        <Route path="/plaene" element={<Plans />} />
        <Route path="/uebungen" element={<Exercises />} />
        <Route path="/fortschritt" element={<Progress />} />
        <Route path="/einstellungen" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const init = useAuthStore((s) => s.init);
  const loading = useAuthStore((s) => s.loading);
  const user = useAuthStore((s) => s.user);
  const [guestMode, setGuestMode] = useState(() => localStorage.getItem(GUEST_MODE_KEY) === '1');

  useEffect(() => {
    if (isSupabaseConfigured) init();
  }, [init]);

  // Keine Cloud-Synchronisierung konfiguriert: App verhält sich wie zuvor, rein lokal.
  if (!isSupabaseConfigured) {
    return <RoutedApp />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-muted text-sm">
        Wird geladen…
      </div>
    );
  }

  if (!user && !guestMode) {
    return (
      <LoginScreen
        onGuest={() => {
          localStorage.setItem(GUEST_MODE_KEY, '1');
          setGuestMode(true);
        }}
      />
    );
  }

  return (
    <>
      {user && <CloudSync />}
      <RoutedApp />
    </>
  );
}
