# Gym App – Current State

Stand: 21.09.2026 — geprüft gegen GitHub `main` (Commit `1a0b916`), das zugehörige Vercel-Production-Deployment und einen lokalen Build.

## 1. Verifizierter Stand

* **Repository:** `deterdingkarl-pixel/gym-tracker-1.0`, Branch `main`. Letzter Code-Commit: `947352c` (21.09.2026, „Add files via upload“). Alle Commits danach ändern nur die Doku-Dateien.
* **Deployment:** Das neueste Vercel-Production-Deployment gehört zu `1a0b916` (= aktueller `main`-Stand) und hat den Status **READY**. Der Live-Stand entspricht damit dem Code im Repository.
* **Build:** `npm install` und `npm run build` (`tsc -b && vite build`) laufen auf diesem Stand erfolgreich durch. Das JS-Bundle ist ca. 905 kB groß (ca. 253 kB gzip); Vite warnt wegen > 500 kB.
* **Tests:** Im Repository gibt es keine automatisierten Tests.
* **Nicht geprüft:** Aussehen und Verhalten auf dem iPhone, Login und Sync mit einem echten Konto, direktes Neuladen von Unterseiten (z. B. `/fortschritt`) auf Vercel.

Der Code ist die maßgebliche Quelle. Bei Abweichungen zur Doku gilt der Code.

### Änderungen seit dieser Analyse (gelten erst nach dem Hochladen auf GitHub)

* **Überlauf auf dem iPhone behoben:** Im Kategorie-Formular, im Trainings-Bearbeiten-Modal und im Plan-Modal ragten die Satz-Zeilen (Feld „RPE“, Löschen-Button) und Dropdowns über den Rand, und der Inhalt ließ sich seitlich verschieben. Ursache waren `1fr`-Grid-Spalten mit Eingabefeldern, die eine feste Mindestbreite haben. Jetzt `minmax(0,1fr)` plus `w-full min-w-0`; zusätzlich Zeilenumbruch bei der Button-Reihe der Plankarten (`Plans.tsx`) und `overflow-x-hidden` am Modal. Geprüft in einem Headless-Chromium mit iPhone-Emulation bei 320, 360, 390 und 430 px (alle Seiten und Modals, hell und dunkel): kein Überlauf mehr. Vorher: 241 px Überlauf im Kategorie-Formular.
* **Dark Mode (Schwarz und dunkles Grau)** eingebaut, in den Einstellungen umschaltbar; Details siehe `PROJECT_CONTEXT.md` (Abschnitt „Farben / Theme"). Neu: `src/lib/theme.ts`, `src/lib/chartTheme.ts`. Geändert: `tailwind.config.js`, `src/index.css`, `src/main.tsx`, `index.html`, `Settings.tsx`, `Dashboard.tsx`, `Progress.tsx`, `HeatmapCalendar.tsx`.
* Build (`npm run build`) nach den Änderungen erfolgreich. **Noch nicht bestätigt:** Verhalten auf dem echten iPhone (Safari).

---

## 2. Im Code vorhandene Funktionen

**Routing** (`App.tsx`, `BrowserRouter`): `/` Dashboard, `/training-eintragen`, `/plaene`, `/uebungen`, `/fortschritt`, `/einstellungen`. Keine 404-Route.

* **Dashboard:** Kennzahlen (Woche, Monat, gesamt, Serie), Wochenvolumen-Diagramm, Trainingskalender, Top-4-Rekorde (geschätztes 1RM), letzte Einheit.
* **Training eintragen:** drei Kategorie-Karten (Beine, Arme & Schulter, Brust & Rücken), darunter das direkt bearbeitbare Formular `CategoryQuickLog`; „Freies Training“ über `WorkoutFormModal`; Historie mit Bearbeiten, Kopieren, Löschen.
* **Trainingspläne:** erstellen, bearbeiten, duplizieren, löschen, favorisieren, Übungen sortieren (Auf/Ab), Ziel-Wdh./-Gewicht **pro Satz**.
* **Übungen:** Bibliothek mit Suche und Filtern (Muskelgruppe, Kategorie, Equipment), erstellen, bearbeiten, löschen.
* **Fortschritt:** Zeitraumfilter, Übungsverlauf (1RM, Top-Satz, Volumen), persönlicher Rekord, Kalender, Wochentagsauswertung, Körpergewicht erfassen und anzeigen.
* **Einstellungen:** kg/lb, Hell/Dunkel-Umschalter, RepDB-Import (manuell), JSON-Export/-Import, Zurücksetzen (Beispieldaten / alles löschen), Konto-Bereich bei konfiguriertem Supabase.
* **Login/Cloud:** E-Mail/Passwort, Registrierung, Gastmodus, Abmelden; Supabase-Tabelle `user_data` (eine JSON-Zeile pro Nutzer, RLS); Cloud-Stand wird nach Login geladen, lokale Änderungen werden mit 1,2 s Verzögerung hochgeladen. Ohne Supabase-Variablen läuft die App rein lokal.
* **Design/Mobile:** helles neutrales Grau und Dark Mode (Tailwind-Tokens über CSS-Variablen), Name „Gym App“, Icon-only-Bottom-Navigation auf Mobile, Safe-Area-Unterstützung, mind. 16 px Schrift in Eingabefeldern auf kleinen Displays (`index.css`), kompaktere Modals.

---

## 3. Wichtige Dateien

* `src/types/index.ts` – Datenmodell
* `src/store/useAppStore.ts` – App-Zustand, alle CRUD-Aktionen, speichert bei jeder Änderung in localStorage (`iron-log:data`)
* `src/store/useAuthStore.ts`, `src/lib/supabaseClient.ts`, `src/lib/cloudSync.ts`, `src/components/CloudSync.tsx` – Login und Sync
* `src/data/userPlan.ts` – persönlicher Standardplan; `src/lib/defaultPlanSeed.ts` – legt fehlende Standardpläne an und startet den RepDB-Auto-Import
* `src/data/seedData.ts` – Beispieldaten für den Erststart
* `src/lib/repdbImport.ts` – RepDB-Import (Quelle `https://exercise-dataset.com/exercises.json`, erreichbar, 601 Übungen)
* `src/lib/calculations.ts` – 1RM (Epley), Volumen, Serien, Statistik
* `src/lib/theme.ts`, `src/lib/chartTheme.ts` – Theme anwenden bzw. Diagrammfarben (nach Upload der Änderungen vorhanden)
* `src/components/CategoryQuickLog.tsx`, `WorkoutFormModal.tsx`, `PlanFormModal.tsx`, `ExerciseFormModal.tsx`
* `src/pages/*` – Dashboard, LogWorkout, Plans, Exercises, Progress, Settings

Nicht im Repository: `.gitignore`, `.env.example` (README verweist darauf), `vercel.json`, `public/`.

---

## 4. Persönlicher Trainingsplan (Ist-Stand in `src/data/userPlan.ts`)

Format: Wiederholungen × Gewicht (kg), je Satz.

### Beine

* Beinbeuger liegend: 4×90 / 5×86
* Beinpresse: 10×240 / 6×240
* Adduktoren: 3×99 / 3×95
* Abduktoren: 5×81 / 6×77
* Waden: 6×100 / 7×95
* Beinstrecker einbeinig: 8×59 / 8×59

### Arme & Schulter

* Preacher Curl: 7×47,5 / 7×45
* Trizeps Pushdown: 6×23 / 5×23
* Trizeps über Kopf: 5×36 / 8×32
* Hammer Curl sitzend: 6×17,5 / 9×16
* Seitheben: 7×30 / 4×30
* Schulterdrücken Multipresse: 4×55 / 6×20 / 3×55 (drei Zielsätze, siehe unten)
* Hintere Schulter: 6×55 / 6×50

### Brust & Rücken

* Butterfly: 7×70 / 4×70
* Schrägbankdrücken Multipresse: 7×27,5 / 8×25
* T-Bar Rudern: 6×70 / 4×70
* Latzug: 6×86 / 6×79
* Enges Rudern / Latziehen: 8×86 / 5×100
* Cable Crunches: 7×77 / 8×73

### Abweichungen und offene Punkte (Rücksprache nötig, nicht selbst umdeuten)

* **Schulterdrücken Multipresse:** Nutzerangabe war „Satz 1: 4×55 + 6×20, Satz 2: 3×55“. Im Code steht das als drei Zielsätze. Ob Satz 1 ein Dropsatz war, ist nicht bestätigt. Die Notiz „Satz 1 als Dropsatz ausgeführt“ liegt an der Planübung, wird aber nirgends in der UI angezeigt.
* **Enges Rudern / Latziehen:** Nutzerangabe war „8×86 oder 6×66“ bzw. „5×100 oder 4×66“. Im Code stehen 8×86 und 5×100; die Alternativen sind nicht gespeichert. Ein Hinweis auf die Unklarheit steht nur in den Ausführungshinweisen der Übung.
* **Hinweise aus den Nutzerangaben, die nicht im Code stehen:** Seitheben ab diesem Stand beidarmig; Hintere Schulter und T-Bar mit vorherigem Gewichtsreset; Schrägbankdrücken-Gewichte wie angegeben übernommen (nicht verdoppelt); Cable Crunches am neuen Kabelturm.
* **Namen im Code weichen von früheren Doku-Texten ab:** „Trizeps über Kopf“ (statt „Überkopf-Trizeps“), „Schrägbankdrücken Multipresse“, „T-Bar Rudern“.
* **Beinpresse** ist nicht in `USER_PLAN_EXERCISES` enthalten. Sie stammt aus den Beispiel-Übungen (`seedData.ts`). Fehlt dort eine Übung mit diesem Namen, wird sie beim Anlegen des Plans stillschweigend weggelassen.

Die Standardpläne werden über den **Plan-Namen** erkannt. Umbenennen oder Löschen führt beim nächsten Start zu einer Neuanlage; umbenannte Pläne verlieren ihre Kategorie-Karte. Bereits vorhandene Pläne werden nicht aktualisiert.

---

## 5. Datenmodell

`PlanExercise.targetSets` ist ein Array aus einzelnen Satz-Zielen (`{ reps, weight }`). Diese Struktur darf nicht auf einen gemeinsamen Zielwert reduziert werden. Beim Öffnen einer Kategorie werden die Zielwerte als Startwerte in die Sätze übernommen; gespeichert wird, was im Formular steht (ein bereits gespeichertes Training für Plan und Datum wird stattdessen geladen und überschrieben).

---

## 6. Bekannte Probleme und Risiken (am Code verifiziert)

Priorität steht in `TODO.md`.

1. **Cloud-Sync kann Cloud-Daten überschreiben:** `fetchCloudData` gibt bei einem Ladefehler `null` zurück. `CloudSync.tsx` deutet das als „keine Cloud-Daten“ und lädt den lokalen Stand hoch.
2. **Fortschrittsdiagramm falsch sortiert:** Sortierung nach dem Text „dd.MM“ (`Progress.tsx`), nicht nach Datum.
3. **Datum in UTC:** `toISOString().slice(0, 10)` an mehreren Stellen (u. a. Standarddatum, „Heute“-Grenze, Serienberechnung). Zwischen 0 und 1/2 Uhr deutscher Zeit ist „heute“ noch der Vortag.
4. **Beispieldaten beim Erststart:** 8 Übungen, 4 Pläne und 7 Trainings der letzten zwei Wochen verfälschen Dashboard und Rekorde, bis sie gelöscht werden. Bei erster Anmeldung ohne Cloud-Daten werden sie mit hochgeladen.
5. **Import/Reset im Sync-Modus:** Werden anschließend in die Cloud übertragen; die Texte sprechen von „lokalen Daten“. Der JSON-Import prüft nur, ob `exercises` ein Array ist.
6. **Geräte-/Konto-Wechsel:** Nach dem Abmelden bleiben die Daten im localStorage. Ein anderes Konto im selben Browser kann sie in seine Cloud übernehmen, wenn dort noch nichts existiert. Ein Cloud-Stand ersetzt lokale Gast-Daten ohne Rückfrage.
7. **Übungsauswahl:** Reine Dropdowns ohne Suche (nach RepDB-Import ca. 600 Einträge). `WorkoutFormModal` sortiert nicht alphabetisch. „Übungsfortschritt“ listet alle Übungen, nicht nur die aus Plänen.
8. **Deep Links:** Ohne `vercel.json` ist unbestätigt, ob ein Neuladen auf `/fortschritt` o. Ä. funktioniert.
9. **RepDB:** Deduplizierung nur nach Name. Ein fehlgeschlagener Auto-Import wird nur in der Konsole gemeldet und bei jedem Start erneut versucht. Zugriff aus dem Browser (CORS) ist nicht geprüft.
10. **Sync-Konflikte:** Kein Merge bei gleichzeitigen Änderungen auf zwei Geräten (bekannt).
11. **Serie:** „Aktuelle Serie“ zählt aufeinanderfolgende Kalendertage; bei einem Plan mit drei Trainingstagen pro Woche ist der Wert fast immer 0 oder 1.

---

## 7. Cloud-Sync und Speicherung

* Lokal: `localStorage`, Schlüssel `iron-log:data` (bleibt bewusst so).
* Cloud: Tabelle `user_data`, eine Zeile pro Nutzer.
* Supabase-URL muss die reine Projekt-URL sein (ohne `/rest/v1/`).
* Vercel-Umgebungsvariablen: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

---

## 8. Nächste Priorität

Siehe `TODO.md`, Abschnitt „Priorität 1“: zuerst die Fehler mit Datenverlust-Risiko (Cloud-Sync-Fehlerfall, Sortierung im Diagramm) beheben, dann den iPhone-Test, erst danach neue Funktionen.
