# Gym App – Project Context

## 1. Projektbeschreibung

Die **Gym App** ist eine React-/TypeScript-Web-App zum Erfassen, Verwalten und Auswerten von Krafttraining.

Der ursprüngliche Name war **Iron Log**. Der sichtbare Name wurde später zu **Gym App** geändert. Interne Storage-Keys mit `iron-log:` bleiben bewusst bestehen, damit bestehende lokale Daten nicht verloren gehen.

Die App ist primär auf das schnelle Erfassen und Auswerten von Krafttraining ausgelegt.

**Update 21.09.2026:** Die App hat inzwischen einen einfachen Live-Trainingsmodus (siehe Abschnitt 5a) — auf ausdrücklichen Wunsch, als bewusste Abkehr von der ursprünglichen Entscheidung „kein Live-Modus". Weiterhin **nicht vorgesehen**: Pausentimer, Satz-für-Satz-Ablaufsteuerung, Push-Benachrichtigungen o. Ä. — bewusst einfach gehalten.

---

## 2. Ziel

Die App soll langfristig:

* Training schnell erfassen — inzwischen auch live während des Trainings, mit automatischem Speichern
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

Hosting und Deployment erfolgen über Vercel (Vercel-Projekt `gym-tracker-1.0`). Jeder Push auf `main` löst ein Production-Deployment aus.

Repository: `deterdingkarl-pixel/gym-tracker-1.0`, Branch `main`.

Der Nutzer arbeitet hauptsächlich über die GitHub-Weboberfläche und lädt Änderungen manuell hoch. Kein regulärer Git-/CLI-Workflow.

---

## 4. Projektstruktur

Wie zuvor dokumentiert (siehe `src/`-Struktur: `types/`, `data/`, `lib/`, `store/`, `components/`, `pages/`). Keine strukturellen Änderungen durch das Update vom 21.09.2026 — nur Inhalte einzelner Dateien geändert (siehe Abschnitt 5a und `CURRENT_STATE.md`).

---

## 5. Bereits implementierte Funktionen

Siehe `CURRENT_STATE.md` für den vollständigen, laufend aktualisierten Funktionsstand.

### 5a. Live-Training / Autosave (neu, 21.09.2026)

Auf ausdrücklichen Wunsch umgesetzt — bewusste Abkehr von der ursprünglichen Entscheidung „kein Live-Trainingsmodus":

* `CategoryQuickLog.tsx` speichert Änderungen jetzt **automatisch** (debounced, ~700ms nach der letzten Eingabe), ohne dass ein Speichern-Button gedrückt werden muss. Beim Schließen wird eine ausstehende Änderung sofort geschrieben.
* Beim ersten gespeicherten Wert wird `Workout.startedAt` (neues optionales Feld in `types/index.ts`) gesetzt und danach nicht mehr verändert.
* Eine Trainingsdauer-Anzeige berechnet die verstrichene Zeit **immer aus der echten Ist-Zeit** (`Date.now() - startedAt`), nicht aus einem laufenden Zähler. Dadurch zeigt sie auch nach Schließen und Wiederöffnen der App die korrekte Dauer.
* **Bewusste technische Grenze:** Es handelt sich um eine reine Client-Web-App ohne Service Worker/Hintergrundprozess. Es gibt daher **keine** live tickende Anzeige, während die App/der Tab vollständig geschlossen ist — nur eine korrekte Neuberechnung beim nächsten Öffnen. Kein Pausentimer, keine Benachrichtigungen.
* `WorkoutFormModal.tsx` (freies Training) wurde bewusst **nicht** auf Autosave umgestellt, um die Änderung klein und gezielt zu halten — bleibt beim bisherigen expliziten Speichern-Button.

---

## 6. UI / Design

Unverändert seit letzter Analyse: neutrales helles Grau als Standard, Dark Mode über CSS-Variablen/Tailwind-Tokens, App-Name „Gym App", mobile-first mit Icon-only-Bottom-Navigation, Safe-Area-Unterstützung, `minmax(0,1fr)`+`min-w-0`-Regel gegen Overflow, 16px-Mindestschriftgröße in Formularfeldern auf kleinen Screens.

---

## 7. Datenmodell

Zentrale Struktur ist `AppData`. Unverändert bis auf eine Ergänzung:

### Workout (Ergänzung 21.09.2026)

Neues optionales Feld:

* `startedAt?: string` — ISO-Zeitpunkt des Trainingsstarts, gesetzt beim ersten Autosave in `CategoryQuickLog`. Optional, damit bestehende Workouts ohne dieses Feld weiterhin gültig bleiben (keine Migration nötig).

Alle übrigen Felder (`Exercise`, `WorkoutPlan`, `PlanExercise`, `PlanSetTarget`, `WorkoutSet`, `BodyMetricEntry`) unverändert — insbesondere bleibt die Pro-Satz-Struktur (`PlanSetTarget[]` pro Übung) bestehen.

---

## 8. Wichtige technische Entscheidungen

### Bestehende Funktionen schützen

1. bestehenden Code zuerst analysieren
2. nur notwendige Dateien ändern
3. funktionierende Funktionen erhalten
4. keine unnötigen Dependencies hinzufügen
5. keine komplette Neuimplementierung ohne Grund

### Vite-Alias

`vite.config.ts` verwendet bewusst den `new URL(..., import.meta.url)`-Ansatz für den `@`-Alias. Nicht ohne Grund auf Node-`path`/`url`-Imports zurückwechseln (frühere Vercel-Buildfehler).

### App-Name

Sichtbar: `Gym App`. Interne Storage-Keys mit `iron-log:` bleiben bestehen.

### Satzwerte

Trainingspläne speichern Werte **pro Satz** (`PlanSetTarget[]`). Kein Zurückwechseln zu einem einzigen Gewicht/Wiederholungswert für alle Sätze.

### Persönlicher Standardplan

Fest in `src/data/userPlan.ts` integriert. `defaultPlanSeed.ts` fügt fehlende Pläne automatisch hinzu, Prüfung anhand des Plan-Namens (kein Duplizieren).

**Update 21.09.2026 (mit Karl abgeglichen):**
* „Schulterdrücken Multipresse" besteht aus **zwei** normalen Zielsätzen (4×55, 3×55) — **kein** Dropsatz.
* „Enges Rudern" (höheres Gewicht, 5×100) und „Enges Latziehen" (niedrigeres Gewicht, 8×86) sind **zwei eigenständige Übungen**, kein gemeinsamer, unklarer Eintrag mehr.
* „Beinpresse" ist jetzt fest in `USER_PLAN_EXERCISES` enthalten, unabhängig von den Seed-Beispieldaten.

Folge weiterhin: Bereits angelegte Pläne werden bei Änderungen an `userPlan.ts` **nicht** automatisch aktualisiert — nur neu erzeugt, wenn der Plan-Name noch nicht existiert.

### Live-Training / Autosave

Siehe Abschnitt 5a. Diese Entscheidung ersetzt die vorherige Aussage „kein Live-Trainingsmodus vorgesehen" — bewusst auf ausdrücklichen Wunsch geändert, nicht eigenmächtig.

### Farben / Theme

Unverändert — Tailwind-Tokens über CSS-Variablen (`src/index.css`), `settings.theme` wird mit der Cloud synchronisiert, `src/lib/theme.ts` wendet es an.

### Cloud Sync

**Update 21.09.2026:** `fetchCloudData` (`src/lib/cloudSync.ts`) wirft jetzt bei einem echten Ladefehler, statt `null` zurückzugeben — vorher nicht unterscheidbar von „keine Cloud-Daten vorhanden". `CloudSync.tsx` lädt bei einem Fehler nichts mehr lokal hoch und bleibt „nicht hydriert", bis ein erneuter Ladeversuch erfolgreich war. Weiterhin **kein echter Merge** bei gleichzeitigen Änderungen auf zwei Geräten (bekannt, akzeptiert).

### RepDB

Unverändert — automatischer Hintergrundimport plus manueller Button, Dedupe nach Übungsname.

---

## 9. Bekannte Probleme / Unsicherheiten

### Deployment

Frühere Probleme (fehlende Node-Typen, falsche Supabase-URL, alter Commit deployed) sind laut letztem Stand behoben. Bei Änderungen weiterhin prüfen, dass Vercel den aktuellen `main`-Commit nutzt.

### Cloud-Konflikte

Weiterhin kein echter Merge zwischen gleichzeitig geänderten Daten auf zwei Geräten.

### Übungs-Duplikate

Dedupe nur nach Übungsname — unterschiedliche Schreibweisen können zu ähnlichen/doppelten Übungen führen.

### Trainingsplan — jetzt geklärt (vorher: Unklarheiten)

Die zuvor offenen Punkte „Schulterdrücken Multipresse" (Dropsatz?) und „Enges Rudern / Latziehen" (welche Variante?) sind am 21.09.2026 mit Karl geklärt und in `src/data/userPlan.ts` umgesetzt (siehe Abschnitt 8). Kein offener Punkt mehr — **außer** dem manuellen Nachziehen bereits angelegter Pläne in der laufenden App (siehe TODO.md).

### Live-Training — bekannte technische Grenze

Kein echter Hintergrundprozess bei vollständig geschlossener App/Tab (reine Web-App). Timer wird beim Wiederöffnen korrekt aus der Ist-Zeit neu berechnet, tickt aber nicht "unsichtbar weiter". Noch nicht praktisch mit echtem App-Schließen auf dem iPhone getestet.

---

## 10. Noch offene Funktionen

Siehe `TODO.md`, Abschnitte „Priorität 2" und „Später".

---

## 11. Entwicklungsregeln

Claude soll:

* zuerst den tatsächlichen Repository-Code prüfen
* die Dokumentation nicht als Ersatz für den Code verwenden
* bei Widersprüchen den tatsächlichen Code als Quelle der Wahrheit behandeln
* keine Funktionen erfinden, keine Dateien erfinden
* keine unnötigen Abhängigkeiten hinzufügen
* funktionierende Bereiche möglichst nicht beschädigen
* Änderungen möglichst gezielt durchführen
* mobile Nutzung berücksichtigen
* bestehende Datenmigrationen beachten
* `iron-log:`-Storage-Keys nicht unnötig ändern
* Pro-Satz-Zielwerte beibehalten
* nach größeren Änderungen `CURRENT_STATE.md` und `TODO.md` aktualisieren
* unklare Anforderungen nicht heimlich interpretieren — bei fachlichen Unklarheiten (wie den Trainingsplan-Werten) Rücksprache halten statt raten
* technische Unsicherheiten ausdrücklich dokumentieren

---

## 12. Aktueller Stand

Siehe `CURRENT_STATE.md`.

---

## 13. Nächster sinnvoller Schritt

1. Geänderte Dateien in GitHub einspielen (siehe `HINWEISE.txt` im Update-Paket).
2. Bereits angelegte Pläne „Arme & Schulter"/„Brust & Rücken" ggf. manuell nachziehen.
3. Live-Training-Funktion praktisch testen (inkl. komplettem Schließen der App).
4. Manuellen Test auf dem iPhone durchführen.
5. Priorität-2-Punkte aus `TODO.md` angehen.
