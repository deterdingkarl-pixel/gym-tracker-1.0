# Gym App – TODO

Stand: 21.09.2026 (nach Priorität-1-Fixes + Live-Training-Update).
Aufgaben erst abhaken, wenn sie tatsächlich funktionieren (d.h. nach dem Einspielen in GitHub/Vercel geprüft).

## Priorität 1 – Datensicherheit und Korrektheit

* [x] **Cloud-Sync-Fehlerfall:** `fetchCloudData` wirft jetzt bei einem echten Ladefehler, statt `null` zurückzugeben. `CloudSync.tsx` lädt in diesem Fall nichts hoch und markiert sich nicht als „hydriert" (`src/lib/cloudSync.ts`, `src/components/CloudSync.tsx`). **Noch zu bestätigen:** Verhalten bei echtem Netzwerkausfall live testen.
* [x] **Fortschrittsdiagramm:** Punkte werden jetzt nach dem echten ISO-Datum sortiert, nicht mehr nach dem Text „dd.MM" (`src/pages/Progress.tsx`).
* [x] **Beinpresse** ist jetzt fest in `USER_PLAN_EXERCISES` enthalten (`src/data/userPlan.ts`) und fällt nicht mehr stillschweigend weg, falls die Seed-Übung fehlt.
* [x] **Warnhinweise im Sync-Modus:** JSON-Import und „Alle Daten löschen" weisen jetzt in den Einstellungen darauf hin, dass bei aktivem Cloud-Sync auch die Cloud-Daten betroffen sind (`src/pages/Settings.tsx`).
* [x] **Rücksprache mit Karl geklärt (21.09.2026):**
  - Schulterdrücken Multipresse: **kein** Dropsatz, zwei normale Zielsätze (4×55, 3×55).
  - Enges Rudern (höheres Gewicht, 5×100) und Enges Latziehen (niedrigeres Gewicht, 8×86) sind zwei getrennte Übungen, nicht eine gemeinsame.
  Umgesetzt in `src/data/userPlan.ts`. **Wichtig:** Bereits in der App angelegte Pläne „Arme & Schulter"/„Brust & Rücken" werden dadurch NICHT automatisch aktualisiert — müssen manuell angepasst oder gelöscht+neu angelegt werden.
* [ ] Manueller Test auf dem iPhone (Navigation, Formulare, Safe-Area, iOS-Zoom, Homescreen, neuer Live-Timer)
* [ ] **Bestätigung auf dem iPhone:** Überlauf-Fix und Dark Mode — weiterhin nur im Headless-Browser geprüft, echter Test steht aus

## Priorität 1b – Live-Training (neu, 21.09.2026, auf Wunsch von Karl)

Bewusste Abkehr von der vorherigen Design-Entscheidung „kein Live-Trainingsmodus" (siehe `PROJECT_CONTEXT.md`).

* [x] `CategoryQuickLog.tsx`: Änderungen werden automatisch (debounced, ohne Speichern-Button) gespeichert.
* [x] `Workout.startedAt` (neues optionales Feld in `types/index.ts`) hält den Startzeitpunkt fest.
* [x] Trainingsdauer-Anzeige, berechnet aus echter Ist-Zeit — bleibt nach Schließen/Wiederöffnen der App korrekt.
* [ ] **Bekannte Einschränkung, bewusst akzeptiert:** kein echter Hintergrundprozess/keine laufende Anzeige bei komplett geschlossener App (reine Web-App ohne Service Worker/Push) — die Anzeige berechnet die Dauer beim Wiederöffnen neu.
* [ ] Praktisch testen: Eintragen → App komplett schließen (nicht nur Tab wechseln) → wieder öffnen → Werte und Timer korrekt?
* [ ] Freies Training (`WorkoutFormModal.tsx`) bewusst NICHT auf Autosave umgestellt (bleibt wie bisher mit explizitem Speichern) — falls gewünscht, gesonderter Auftrag nötig.

## Priorität 2 – Verbesserungen

* [ ] Entscheidung: Erststart ohne Beispieldaten?
* [ ] Datum lokal statt UTC erzeugen (`toISOString().slice(0, 10)` an mehreren Stellen)
* [ ] Übungsauswahl mit Suche statt langem Dropdown; `WorkoutFormModal` alphabetisch sortieren
* [ ] „Übungsfortschritt" nur mit Übungen aus den Trainingsplänen anbieten
* [ ] JSON-Import strenger validieren
* [ ] Plan-Notiz (`PlanExercise.note`) in Plänen/Kategorie-Formular anzeigen
* [ ] Verhalten bei Konto-/Gerätewechsel absichern
* [ ] Prüfen, ob Neuladen von Unterseiten auf Vercel funktioniert; sonst `vercel.json` ergänzen
* [ ] Körpergewichts-Einträge löschbar machen (Store-Aktion existiert, UI fehlt)

## Cloud / Multi-Device

* [ ] Synchronisierung zwischen Computer und iPhone testen
* [ ] Verhalten bei zwei Geräten gleichzeitig testen
* [ ] Konflikt-/Merge-Strategie später verbessern (weiterhin ungelöst, bekannt)

## Repository / Deployment / Doku

* [ ] `.gitignore` ergänzen
* [ ] `.env.example` ergänzen
* [ ] Bundle-Größe bei Bedarf per Code-Splitting verringern
* [ ] Optional: Web-Manifest und App-Icon für den Homescreen

## Später

* [ ] Drag-and-Drop für Planübungen
* [ ] Körpermaße/Umfänge vollständig integrieren
* [ ] Passwort-zurücksetzen, weitere Login-Methoden
* [ ] Undo/Papierkorb
* [ ] Mehrsprachigkeit

## Nicht implementiert

* [ ] automatische wöchentliche Suche nach Energy-Drink-Angeboten (nicht Teil der App)

## Erledigt (neu seit 21.09.2026)

* [x] Cloud-Sync-Fehlerfall behoben
* [x] Fortschrittsdiagramm-Sortierung behoben
* [x] Beinpresse in Standardplan aufgenommen
* [x] Sync-Warnhinweise ergänzt
* [x] Rücksprache zu Schulterdrücken/Enges Rudern-Latziehen geklärt und umgesetzt
* [x] Live-Training: Autosave ohne Speichern-Button, Trainingsdauer-Timer

## Regeln

Aufgaben erst abhaken, wenn sie tatsächlich funktionieren.

Nach größeren Änderungen:
1. Code prüfen/testen
2. TODO aktualisieren
3. CURRENT_STATE aktualisieren
4. dauerhaft relevante technische Entscheidungen in PROJECT_CONTEXT aktualisieren
