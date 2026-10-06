# Gym App – TODO

Stand: 06.10.2026. Aufgaben erst abhaken, wenn sie tatsächlich funktionieren (nach Einspielen in GitHub/Vercel geprüft).

## Priorität 1 – Praxistests

* [ ] **Zielwerte folgen dem letzten Training** (`CategoryQuickLog.syncPlanTargets`): im Code vorhanden und deployt (06.10.2026), **Praxistest steht aus**. Prüfen: Werte eintragen → „Gespeichert." → „Trainingspläne" zeigt neue Werte → anderes Datum öffnen → Felder vorausgefüllt?
* [ ] Live-Training praktisch testen: Eintragen → App komplett schließen → öffnen → Werte und Timer korrekt?
* [ ] Cloud-Sync auf zwei Geräten (Computer + iPhone) testen, inkl. Verhalten bei Netzwerkausfall
* [ ] Manueller Test auf dem iPhone (Navigation, Formulare, Safe-Area, iOS-Zoom, Homescreen, Dark Mode, Überlauf-Fix)

## Priorität 1a – Update vom 06.10.2026: im Code umgesetzt, Test nach Einspielen steht aus

Erst nach erfolgreichem Test nach „Erledigt" verschieben. Der Build (`npm run build`) wurde für dieses Update nicht ausgeführt — bei Vercel-Buildfehler zuerst die Build-Logs prüfen.

* [ ] **Datum lokal statt UTC:** neue Datei `src/lib/dateUtils.ts` (`localDateStr`, `addDaysLocal`). Umgestellt in `CategoryQuickLog`, `WorkoutFormModal`, `Progress`, `calculations.currentStreak`, `useAppStore.duplicateWorkout`, `storage.exportAsJson`. Test: kurz nach Mitternacht Training eintragen → richtiges Datum? Serie korrekt?
  * Offen: `src/data/seedData.ts` (`dateDaysAgo`) nutzt noch UTC — betrifft nur die Beispieldaten.
* [ ] **Übungsauswahl mit Suche:** neue Komponente `src/components/ExerciseSelect.tsx` (alphabetisch, Suchfeld ab 15 Übungen). Eingebaut in `CategoryQuickLog`, `PlanFormModal`, `WorkoutFormModal`. Test: Suchbegriff eingeben → Liste gefiltert → Übung wählen → Wert gespeichert; Enter im Suchfeld schickt kein Formular ab.
* [ ] **Plan-Notiz anzeigen:** `PlanExercise.note` wird in „Trainingspläne" und unter der Übung in `CategoryQuickLog` angezeigt (nur Anzeige, kein Eingabefeld im Plan-Formular).
* [ ] **Körpergewichts-Einträge löschbar:** `Progress.tsx` zeigt die letzten 8 Einträge mit Löschen-Button.
* [ ] **JSON-Import strenger:** `storage.parseImportedJson` prüft Listen und Pflichtfelder (id, name, Datum `YYYY-MM-DD`), ergänzt fehlende `bodyMetrics`/`settings` mit Standardwerten. Test: gültigen Export importieren; kaputte Datei → Fehlermeldung.
* [ ] **Deep Links auf Vercel:** `vercel.json` mit Rewrite auf `/index.html` ergänzt. Test: Unterseite (z. B. `/fortschritt`) im Browser neu laden.
* [ ] **Repo-Hygiene:** `.gitignore` und `.env.example` ergänzt.

## Priorität 1b – Bekannte Grenzen der Zielwerte-Funktion (Entscheidung nötig, nur falls gewünscht)

* [ ] Plan-Ziele zurücksetzen/neu berechnen, wenn ein Training gelöscht oder nachträglich bearbeitet wird
* [ ] Zielwerte auch bei per Dropdown getauschten/zusätzlichen Übungen in den Plan übernehmen
* [ ] Freies Training (`WorkoutFormModal`) bewusst ohne Autosave und ohne Plan-Sync — nur auf gesonderten Auftrag

## Priorität 2 – Verbesserungen (offen)

* [ ] Entscheidung: Erststart ohne Beispieldaten? (fachliche Entscheidung nötig)
* [ ] Verhalten bei Konto-/Gerätewechsel absichern (noch nicht konkret definiert)
* [ ] Bereits angelegte Pläne bei Änderungen an `userPlan.ts` gezielt aktualisierbar machen
* [ ] Optional: Zwischenstände beim Tippen nicht in den Plan schreiben (z. B. erst bei Blur/Schließen)
* [ ] `seedData.ts`: Datum lokal statt UTC (siehe oben)

## Cloud / Multi-Device

* [ ] Konflikt-/Merge-Strategie später verbessern (weiterhin ungelöst, bekannt)

## Repository / Deployment / Doku

* [ ] Lose Update-Notizen (`README-UPDATE.txt`, `LIESMICH.txt`, `HINWEISE.txt`, `PROJECT_CONTEXT-ERGAENZUNG.txt`) in GitHub löschen (Inhalt ist im Code bzw. in den Doku-Dateien umgesetzt)
* [ ] Bundle-Größe bei Bedarf per Code-Splitting verringern
* [ ] Optional: Web-Manifest und App-Icon für den Homescreen

## Später

* [ ] Drag-and-Drop für Planübungen
* [ ] Körpermaße/Umfänge vollständig integrieren
* [ ] Passwort-zurücksetzen, weitere Login-Methoden
* [ ] Undo/Papierkorb
* [ ] Mehrsprachigkeit

## Erledigt (im Code vorhanden)

* [x] Cloud-Sync-Fehlerfall: bei Ladefehler wird nichts hochgeladen
* [x] Cloud-Sync: Zeitstempel-Abgleich lokal vs. Cloud, sofortiger Push bei Hintergrund/Schließen
* [x] Fortschrittsdiagramm nach echtem Datum sortiert
* [x] Fortschritt: Übungsauswahl nur mit erfassten Sätzen, gruppiert nach Trainingsart
* [x] Beinpresse im Standardplan; Plan-Werte (Schulterdrücken, Enges Rudern/Latziehen) geklärt
* [x] Sync-Warnhinweise bei Import/Reset
* [x] Live-Training: Autosave, Trainingsdauer (Praxistest siehe oben)

## Regeln

Aufgaben erst abhaken, wenn sie tatsächlich funktionieren.

Nach größeren Änderungen:
1. Code prüfen/testen
2. TODO aktualisieren
3. CURRENT_STATE aktualisieren
4. dauerhaft relevante technische Entscheidungen in PROJECT_CONTEXT aktualisieren
