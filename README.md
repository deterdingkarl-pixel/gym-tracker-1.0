# Gym App — Krafttraining-Tracker (MVP)

Eine lokale Web-App zum Eintragen von Krafttraining, Verwalten von
Übungen und Trainingsplänen, sowie zum Auswerten deines Fortschritts.

Die drei festen Trainingskategorien (Beine, Arme & Schulter, Brust & Rücken)
können live während des Trainings bearbeitet werden: Eingaben werden
automatisch gespeichert (kein Speichern-Button nötig), und ab dem ersten
gespeicherten Wert läuft eine einfache Trainingsdauer-Anzeige mit — ohne
Pausentimer oder separate „Training starten"/„Training beenden"-Ablaufsteuerung,
bewusst einfach gehalten. Die Dauer wird immer aus der echten Uhrzeit berechnet,
bleibt also auch nach Schließen und Wiederöffnen der App korrekt (es gibt aber
keine live tickende Anzeige, während die App komplett geschlossen ist — reine
Web-App ohne Hintergrundprozess).

## 1. Installation & Start

Voraussetzung: [Node.js](https://nodejs.org) ab Version 18.

```bash
# 1. In den Projektordner wechseln
cd fitness-app

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten
npm run dev
```

Die App läuft danach unter `http://localhost:5173`. Sie ist eine reine
Client-App — es wird kein Backend benötigt, alle Daten liegen im
`localStorage` deines Browsers.

Für einen Produktions-Build:

```bash
npm run build     # erzeugt einen statischen Build in dist/
npm run preview   # zeigt den Build lokal an
```

## 1a. Cloud-Synchronisierung einrichten (optional)

Die App läuft standardmäßig rein lokal (localStorage). Wenn du Supabase-
Umgebungsvariablen setzt (siehe `.env.example`), erscheint automatisch ein
Login-Bildschirm und Daten werden geräteübergreifend synchronisiert.
Details siehe Abschnitt „Cloud-Synchronisierung" weiter unten.

## 2. Projektstruktur

```
fitness-app/
├── src/
│   ├── types/index.ts        # Zentrales Datenmodell (Exercise, Workout, Plan, ...)
│   ├── data/seedData.ts      # Beispiel-Übungen, -Pläne und -Trainings
│   ├── lib/
│   │   ├── storage.ts        # localStorage laden/speichern, JSON Export/Import
│   │   └── calculations.ts   # 1RM-Schätzung, Volumen, Trainingsserien, Statistik
│   ├── store/useAppStore.ts  # zentraler Zustand (Zustand-Store) inkl. aller CRUD-Aktionen
│   ├── components/
│   │   ├── ui/Primitives.tsx     # Card, Button, Input, Select, Modal, Badge, EmptyState
│   │   ├── layout/Layout.tsx     # Sidebar (Desktop) + Bottom-Nav (Mobile)
│   │   ├── HeatmapCalendar.tsx   # Kalender mit markierten Trainingstagen
│   │   ├── StatCard.tsx
│   │   ├── WorkoutFormModal.tsx  # Training manuell eintragen/bearbeiten (mit Speichern-Button)
│   │   ├── PlanFormModal.tsx     # Trainingsplan erstellen/bearbeiten
│   │   ├── CategoryQuickLog.tsx  # Live-Training: automatisches Speichern + Trainingsdauer
│   │   └── ExerciseFormModal.tsx # Übung erstellen/bearbeiten
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── LogWorkout.tsx    # Trainingshistorie + Eintragen/Bearbeiten/Kopieren/Löschen
│   │   ├── Plans.tsx
│   │   ├── Exercises.tsx
│   │   ├── Progress.tsx
│   │   └── Settings.tsx
│   ├── App.tsx                # Routing
│   └── main.tsx                # Einstiegspunkt
├── tailwind.config.js          # Design-Tokens (Farben, Radius, Schatten)
└── package.json
```

## 3. Datenstruktur

Alle Daten liegen unter dem `localStorage`-Schlüssel `iron-log:data` als ein
einziges JSON-Objekt vom Typ `AppData` (siehe `src/types/index.ts`):

- **`exercises: Exercise[]`** — Übungsbibliothek.
- **`plans: WorkoutPlan[]`** — Trainingspläne mit Zielwerten **pro Satz**.
- **`workouts: Workout[]`** — protokollierte Trainingseinheiten, inkl. optionalem
  `startedAt` (Zeitpunkt des Trainingsstarts, Grundlage der Trainingsdauer-Anzeige).
- **`bodyMetrics: BodyMetricEntry[]`** — optionale Körpergewichts-/Maße-Einträge.
- **`settings: AppSettings`** — Einheit (kg/lb) und Theme.

## 4. Enthaltene Beispieldaten

Beim ersten Start wird die App automatisch mit Beispieldaten befüllt
(`src/data/seedData.ts`). Unter **Einstellungen** lassen sich alle Daten
jederzeit auf die Beispieldaten zurücksetzen oder vollständig löschen (bei
aktivem Cloud-Sync betrifft das auch die Cloud-Daten).

## 5. Persönlicher Standard-Trainingsplan (fest im Code)

In `src/data/userPlan.ts` ist ein persönlicher Trainingsplan mit drei Tagen
(„Beine", „Arme & Schulter", „Brust & Rücken") fest hinterlegt, inklusive
individueller Ziel-Werte **je Satz**. `src/lib/defaultPlanSeed.ts` fügt diesen
Plan automatisch beim App-Start hinzu (anhand des Plan-Namens, nicht doppelt).
Um den Plan zu ändern: `src/data/userPlan.ts` bearbeiten und neu deployen —
bereits vorhandene gleichnamige Pläne werden dabei nicht automatisch
aktualisiert, nur neu hinzugefügte.

## 6. Cloud-Synchronisierung (Supabase)

Details wie zuvor. Der komplette App-Zustand wird als JSON pro Nutzer in der
Tabelle `user_data` gespeichert. Ein echter Ladefehler wird von „keine
Cloud-Daten vorhanden" unterschieden — bei einem Fehler wird nichts
hochgeladen, um vorhandene Cloud-Daten zu schützen.

## 7. MVP-Funktionsumfang & mögliche Erweiterungen

Umgesetzt: Dashboard, manuelles Eintragen/Bearbeiten/Kopieren/Löschen von
Trainings, Live-Training mit Autosave und Trainingsdauer für die drei festen
Kategorien, Trainingspläne, Übungsbibliothek, Fortschrittsseite,
Einstellungen, optionale Cloud-Synchronisierung.

Bewusst als **spätere Erweiterung** markiert (nicht Teil des MVP):

- Konflikt-Auflösung bei gleichzeitigen Änderungen auf zwei Geräten
- Hellmodus/Dunkelmodus-Feinschliff auf allen Geräten
- Drag-and-drop beim Sortieren von Plan-Übungen
- Vollständige Körpermaß-Erfassung
- Passwort vergessen / Social Login
- Undo für Löschvorgänge
- Mehrsprachigkeit
- Live tickende Trainingsdauer-Anzeige bei vollständig geschlossener App
  (würde eine native App oder Push-Mechanismen erfordern)
