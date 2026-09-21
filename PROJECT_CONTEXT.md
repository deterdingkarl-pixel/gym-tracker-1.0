# Gym App – Project Context

## 1. Projektbeschreibung

Die **Gym App** ist eine React-/TypeScript-Web-App zum Erfassen, Verwalten und Auswerten von Krafttraining.

Der ursprüngliche Name war **Iron Log**. Der sichtbare Name wurde später zu **Gym App** geändert. Interne Storage-Keys mit `iron-log:` bleiben bewusst bestehen, damit bestehende lokale Daten nicht verloren gehen.

Die App ist primär auf das schnelle Erfassen und Auswerten von Krafttraining ausgelegt.

Ein Live-Trainingsmodus mit „Training starten“, Pausentimer o. Ä. ist aktuell **nicht vorgesehen**.

---

## 2. Ziel

Die App soll langfristig:

* Training schnell erfassen
* Übungen aus einer großen Übungsdatenbank auswählen
* Trainingspläne verwalten
* persönliche Trainingshistorie speichern
* Gewicht und Wiederholungen pro Satz speichern
* Fortschritt und persönliche Bestleistungen darstellen
* Trainingsvolumen und Trainingshäufigkeit auswerten
* Körpergewicht speichern
* auf Handy und Computer synchronisiert werden

Der aktuelle Fokus liegt auf dem schnellen Erfassen der drei festen Trainingskategorien:

* Beine
* Arme & Schulter
* Brust & Rücken

---

## 3. Aktueller Tech-Stack

* React 18
* TypeScript
* Vite 5
* Tailwind CSS 3
* Zustand 4
* React Router 6
* Recharts
* Lucide React
* date-fns
* uuid
* Supabase / `@supabase/supabase-js`
* localStorage
* GitHub
* Vercel

Hosting und Deployment erfolgen über Vercel.

Das Repository ist aktuell:

`deterdingkarl-pixel/gym-tracker-1.0`

Branch:

`main`

Der Nutzer arbeitet hauptsächlich über die GitHub-Weboberfläche und lädt Änderungen manuell hoch. Kein regulärer Git-/CLI-Workflow.

---

## 4. Projektstruktur

Wichtige Dateien und Bereiche:

### Root

* `package.json` – Dependencies und Build-Skripte
* `vite.config.ts` – Vite-Konfiguration und `@`-Alias
* `tsconfig.json` – TypeScript-Konfiguration
* `tsconfig.node.json` – TypeScript-Konfiguration für Vite
* `tailwind.config.js` – Design-Tokens
* `postcss.config.js`
* `index.html` – HTML-Einstiegspunkt und Meta-/Font-Konfiguration
* `.gitignore`
* `README.md`
* `supabase/schema.sql` – Supabase-Tabelle und RLS-Policies

### `src/`

* `App.tsx` – Routing, Auth-/Gastlogik
* `main.tsx` – React-Einstiegspunkt
* `index.css` – globale Styles und Tailwind
* `types/index.ts` – zentrales Datenmodell

### `src/data/`

* `seedData.ts` – generische Demo-/Seed-Daten
* `userPlan.ts` – fest integrierter persönlicher Trainingsplan

### `src/lib/`

* `storage.ts` – localStorage, JSON Export/Import
* `calculations.ts` – 1RM, Volumen, Streaks und Statistiken
* `supabaseClient.ts` – Supabase-Konfiguration
* `cloudSync.ts` – Lesen/Schreiben der Cloud-Daten
* `defaultPlanSeed.ts` – Einfügen des persönlichen Standardplans und automatischer RepDB-Import
* `repdbImport.ts` – Import und Mapping der externen Übungsdatenbank

### `src/store/`

* `useAppStore.ts` – zentraler App-Zustand und CRUD
* `useAuthStore.ts` – Authentifizierung und Session

### `src/components/`

* `ui/Primitives.tsx` – Card, Button, Input, Select, Modal, Badge usw.
* `layout/Layout.tsx` – Desktop-Sidebar und mobile Navigation
* `CloudSync.tsx` – automatische Cloud-Synchronisierung
* `CategoryQuickLog.tsx` – direkt bearbeitbares Formular für Trainingskategorien
* `WorkoutFormModal.tsx` – manuelles Training
* `PlanFormModal.tsx` – Trainingsplan bearbeiten
* `ExerciseFormModal.tsx` – Übungsverwaltung
* `HeatmapCalendar.tsx` – Trainingskalender
* `StatCard.tsx`
* `auth/LoginScreen.tsx` – Login/Registrierung/Gastmodus

### `src/pages/`

* `Dashboard.tsx`
* `LogWorkout.tsx`
* `Plans.tsx`
* `Exercises.tsx`
* `Progress.tsx`
* `Settings.tsx`

---

## 5. Bereits implementierte Funktionen

### Dashboard

* Kennzahlen
* Trainingskalender/Heatmap
* Trainingsserien/Streaks
* Volumen-/Fortschrittsdiagramme
* PR-Anzeige
* Informationen zur letzten Einheit

### Training

* Trainingshistorie
* Training manuell eintragen
* Training bearbeiten
* Training kopieren
* Training löschen
* freies Training außerhalb der festen Kategorien

### Feste Trainingskategorien

Direkt bearbeitbare Kategorien:

* Beine
* Arme & Schulter
* Brust & Rücken

Die Kategorieansicht soll direkt das Training bearbeiten lassen, ohne zuerst einen separaten Bearbeiten-Modus öffnen zu müssen.

Die Werte werden aus dem persönlichen Standardplan vorausgefüllt bzw. aus einem vorhandenen heutigen Eintrag übernommen.

### Trainingspläne

* erstellen
* bearbeiten
* duplizieren
* löschen
* favorisieren
* Übungen verwalten
* Reihenfolge ändern
* individuelle Zielwerte pro Satz

Wichtig: Jeder Satz kann eigene Wiederholungen und eigenes Gewicht besitzen.

### Übungen

* Übungsbibliothek
* Suche
* Filter
* erstellen
* bearbeiten
* löschen
* Auswahl aus der Bibliothek statt Freitext im normalen Trainings-/Planablauf
* automatischer Import einer externen Übungsdatenbank

### RepDB-Übungsdatenbank

Die externe GitHub-Datenquelle `RepDB/exercise-dataset` wurde als automatische Importquelle integriert.

Ziel:

* viele Übungen verfügbar
* automatischer Import im Hintergrund
* bestehende Übungen nicht überschreiben
* Duplikate anhand des Übungsnamens vermeiden
* manueller Import in den Einstellungen bleibt als Fallback vorhanden

Die genaue aktuelle Anzahl der Datensätze kann sich extern ändern und darf nicht fest angenommen werden.

### Fortschritt

* 1RM-Auswertung
* Volumen
* PRs
* Trainingskalender
* Wochentagsauswertung
* Zeitraumfilter
* Körpergewicht-Historie bzw. Körpergewichtserfassung

### Einstellungen

* Gewichtseinheit kg/lb
* Theme-Einstellung
* JSON-Export
* JSON-Import
* Daten zurücksetzen
* Übungsdatenbank importieren
* Account-/Sync-Bereich

### Cloud-Synchronisierung

Supabase wurde integriert.

Vorhanden:

* E-Mail-/Passwort-Login
* Registrierung
* Abmelden
* Gastmodus ohne Login
* Cloud-Daten laden
* Änderungen automatisch in die Cloud schreiben
* Daten über mehrere Geräte synchronisieren

Die App funktioniert weiterhin lokal, wenn Supabase nicht konfiguriert ist.

---

## 6. UI / Design

Der sichtbare App-Name ist:

**Gym App**

Das alte dunkle Grün-/Türkis-Design wurde auf ein **neutrales, helleres Grau** umgestellt.

Aktuelles Designziel:

* neutral
* hell
* übersichtlich
* modern
* wenig dekorativ
* funktional
* gute Lesbarkeit

Mobile Nutzung hat hohe Priorität.

### Mobile Design

* mobile Navigation als Icon-only Bottom-Navigation
* Safe-Area-Unterstützung für iPhone
* zusätzlicher Abstand zur unteren Navigation
* Formulare auf kleinen Bildschirmen kompakter
* Buttons dürfen umbrechen
* iOS-Zoom bei Eingabefeldern soll verhindert werden
* mobile Web-App-/Homescreen-Nutzung wird berücksichtigt

Der letzte beschriebene Mobile-/Design-Stand wurde im bisherigen Chat erstellt, aber ein erfolgreicher finaler Deployment-Test dieses letzten Updates wurde **nicht bestätigt**.

---

## 7. Datenmodell

Zentrale Struktur ist `AppData`.

Gespeichert werden unter anderem:

* `exercises`
* `plans`
* `workouts`
* `bodyMetrics`
* `settings`

### Exercise

Enthält u. a.:

* `id`
* `name`
* `muscleGroup`
* `category`
* `equipment`
* `description`
* `executionNotes`
* `isCustom`
* `createdAt`
* `updatedAt`

### WorkoutPlan

Enthält u. a.:

* `id`
* `name`
* `type`
* `exercises`
* `isFavorite`
* `createdAt`
* `updatedAt`

### PlanExercise

Enthält u. a.:

* `id`
* `exerciseId`
* `order`
* `targetSets`
* `note`

### PlanSetTarget

Pro Satz:

* `reps`
* `weight`

Das ist eine wichtige Architekturentscheidung.

Satz 1 und Satz 2 dürfen unterschiedliche Werte haben.

### Workout

Enthält:

* Datum
* optionalen Plan
* Trainingstyp
* optionale Dauer
* Notiz
* ExerciseLogs
* `createdAt`
* `updatedAt`

### WorkoutSet

Pro Satz:

* Gewicht
* Wiederholungen
* optional RPE
* optionale Notiz

### BodyMetricEntry

Kann enthalten:

* Datum
* Gewicht
* Körperfett
* weitere Messwerte

Aktuell wird in der UI hauptsächlich das Körpergewicht verwendet.

### Speicherung

Lokal:

`localStorage`

Cloud:

eine `user_data`-Zeile pro Benutzer mit einem JSONB-Datenobjekt.

---

## 8. Wichtige technische Entscheidungen

### Bestehende Funktionen schützen

Bei Änderungen:

1. bestehenden Code zuerst analysieren
2. nur notwendige Dateien ändern
3. funktionierende Funktionen erhalten
4. keine unnötigen Dependencies hinzufügen
5. keine komplette Neuimplementierung ohne Grund

### Vite-Alias

`vite.config.ts` verwendet bewusst den `new URL(..., import.meta.url)`-Ansatz für den `@`-Alias.

Nicht ohne Grund auf Node-`path`/`url`-Imports zurückwechseln, da diese zuvor zu Vercel-Buildfehlern geführt haben.

### App-Name

Die sichtbare App heißt `Gym App`.

Interne Storage-Keys mit `iron-log:` werden nicht ohne zwingenden Grund umbenannt.

### Satzwerte

Trainingspläne speichern Werte **pro Satz**.

Kein Zurückwechseln zu einem einzigen Gewicht/Wiederholungswert für alle Sätze.

### Persönlicher Standardplan

Der persönliche Plan ist fest in `src/data/userPlan.ts` integriert.

`defaultPlanSeed.ts` fügt fehlende Pläne automatisch hinzu.

Die Prüfung erfolgt anhand des Plan-Namens, damit die Pläne nicht bei jedem Start dupliziert werden.

### Cloud Sync

Aktuell wird ein kompletter JSON-Datensatz pro Benutzer gespeichert.

Bei gleichzeitigen Änderungen auf zwei Geräten gibt es keinen echten Konflikt-Merge.

### RepDB

Der externe Übungsimport läuft automatisch und wird zusätzlich manuell angeboten.

---

## 9. Bekannte Probleme / Unsicherheiten

### Deployment

In der Vergangenheit gab es mehrfach Probleme mit manuellen GitHub-Uploads und falschen Vercel-Deployments.

Bereits behoben:

* fehlende Node-Typen bzw. `path`/`url`-Buildfehler
* falsche Supabase-URL mit `/rest/v1/`
* Redeploy eines alten Commits statt des aktuellen Commits

Der Nutzer sollte bei Änderungen weiterhin prüfen, dass Vercel wirklich den aktuellen `main`-Commit verwendet.

### Letzter UI-Stand

Unbekannt bzw. nicht bestätigt:

Ob die zuletzt erstellten Änderungen

* Mobile-Optimierung
* Kategorie-Direktbearbeitung
* hellgraues Design
* Umbenennung zu „Gym App“

bereits erfolgreich in GitHub und anschließend live auf Vercel sind.

### Cloud-Konflikte

Kein echter Merge zwischen gleichzeitig geänderten Daten auf zwei Geräten.

### Übungs-Duplikate

Der automatische Import dedupliziert nach Übungsnamen. Unterschiedliche Schreibweisen können deshalb trotzdem zu ähnlichen/doppelten Übungen führen.

### Trainingsplan-Unklarheiten

Zwei Angaben aus dem persönlichen Training sind fachlich nicht vollständig eindeutig:

* `Schulterdrücken Multipresse`: Satz 1 wurde als zwei Gewichtsstufen bzw. Dropsatz interpretiert.
* `Enges Rudern / enges Latziehen`: die tatsächliche Variante war nicht eindeutig.

Diese Punkte sollen nicht ohne Rücksprache umgedeutet werden.

### Energy-Drink-Angebote

Ein System für automatisch jede Woche recherchierte lokale Energy-Drink-Angebote wurde **nicht als App-Funktion implementiert**.

---

## 10. Noch offene Funktionen

Nach aktuellem Stand u. a.:

* echte automatische Konfliktauflösung zwischen mehreren Geräten
* echter Dark Mode
* Drag-and-Drop bei Planübungen
* vollständige Körpermaß-Erfassung
* Passwort-zurücksetzen
* weitere Login-Optionen
* Undo/Papierkorb für Löschvorgänge
* Mehrsprachigkeit
* weitere sinnvolle Gym-Tracking-Funktionen

Zusätzlich muss der aktuelle UI-/Deployment-Stand geprüft werden, bevor weitere Änderungen darauf aufbauen.

---

## 11. Entwicklungsregeln

Claude soll:

* zuerst den tatsächlichen Repository-Code prüfen
* die Dokumentation nicht als Ersatz für den Code verwenden
* bei Widersprüchen den tatsächlichen Code als Quelle der Wahrheit behandeln
* keine Funktionen erfinden
* keine Dateien erfinden
* keine unnötigen Abhängigkeiten hinzufügen
* funktionierende Bereiche möglichst nicht beschädigen
* Änderungen möglichst gezielt durchführen
* mobile Nutzung berücksichtigen
* bestehende Datenmigrationen beachten
* `iron-log:`-Storage-Keys nicht unnötig ändern
* Pro-Satz-Zielwerte beibehalten
* nach größeren Änderungen `CURRENT_STATE.md` und `TODO.md` aktualisieren
* unklare Anforderungen nicht heimlich interpretieren
* technische Unsicherheiten ausdrücklich dokumentieren

---

## 12. Aktueller Stand

Die App verfügt inzwischen über:

* Dashboard
* Trainingshistorie
* Trainingspläne
* Übungsbibliothek
* Fortschrittsauswertung
* Einstellungen
* Supabase-Login und Cloud-Sync
* automatische externe Übungsdatenbank
* persönlichen fest integrierten Trainingsplan
* individuelle Werte pro Satz
* direkt bearbeitbare Trainingskategorien
* mobiles Layout
* neutrales helles Design
* Anzeigenamen „Gym App“

Die App ist grundsätzlich als funktionsfähiges MVP aufgebaut.

Der wichtigste offene Punkt vor weiteren größeren Änderungen ist die Überprüfung, ob der **zuletzt entwickelte Code tatsächlich dem aktuellen GitHub-/Vercel-Stand entspricht**.

---

## 13. Nächster sinnvoller Schritt

1. Aktuellen GitHub-Code analysieren.
2. Prüfen, welche der zuletzt entwickelten UI-Änderungen tatsächlich vorhanden und live sind.
3. `CURRENT_STATE.md` anhand des echten Codes aktualisieren.
4. Erst danach die nächste gewünschte Funktion implementieren.

