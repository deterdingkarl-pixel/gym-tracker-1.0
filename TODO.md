# Gym App – TODO

Stand: 06.10.2026. Aufgaben erst abhaken, wenn sie tatsächlich funktionieren (nach Einspielen in GitHub/Vercel geprüft).

## Priorität 1 – Praxistests

* [ ] **Zielwerte folgen dem letzten Training** (`CategoryQuickLog.syncPlanTargets`): im Code vorhanden und deployt (06.10.2026), **Praxistest steht aus**. Prüfen: Werte eintragen → „Gespeichert." → „Trainingspläne" zeigt neue Werte → anderes Datum öffnen → Felder vorausgefüllt?
* [ ] Live-Training praktisch testen: Eintragen → App komplett schließen → öffnen → Werte und Timer korrekt?
* [ ] Cloud-Sync auf zwei Geräten (Computer + iPhone) testen, inkl. Verhalten bei Netzwerkausfall
* [ ] Manueller Test auf dem iPhone (Navigation, Formulare, Safe-Area, iOS-Zoom, Homescreen, Dark Mode, Überlauf-Fix)

## Priorität 1b – Bekannte Grenzen der Zielwerte-Funktion (Entscheidung nötig, nur falls gewünscht)

* [ ] Plan-Ziele zurücksetzen/neu berechnen, wenn ein Training gelöscht oder nachträglich bearbeitet wird
* [ ] Zielwerte auch bei per Dropdown getauschten/zusätzlichen Übungen in den Plan übernehmen
* [ ] Freies Training (`WorkoutFormModal`) bewusst ohne Autosave und ohne Plan-Sync — nur auf gesonderten Auftrag

## Priorität 2 – Verbesserungen

* [ ] Datum lokal statt UTC erzeugen (`toISOString().slice(0, 10)` an mehreren Stellen)
* [ ] Übungsauswahl mit Suche (zusätzlich zum Dropdown) in Training eintragen, Trainingspläne, Kategorie-Schnellerfassung; `WorkoutFormModal` alphabetisch sortieren
* [ ] Entscheidung: Erststart ohne Beispieldaten?
* [ ] JSON-Import strenger validieren
* [ ] Plan-Notiz (`PlanExercise.note`) anzeigen
* [ ] Verhalten bei Konto-/Gerätewechsel absichern
* [ ] Prüfen, ob Neuladen von Unterseiten auf Vercel funktioniert; sonst `vercel.json` ergänzen
* [ ] Körpergewichts-Einträge löschbar machen (Store-Aktion existiert, UI fehlt)
* [ ] Bereits angelegte Pläne bei Änderungen an `userPlan.ts` gezielt aktualisierbar machen
* [ ] Optional: Zwischenstände beim Tippen nicht in den Plan schreiben (z. B. erst bei Blur/Schließen)

## Cloud / Multi-Device

* [ ] Konflikt-/Merge-Strategie später verbessern (weiterhin ungelöst, bekannt)

## Repository / Deployment / Doku

* [ ] `.gitignore` ergänzen
* [ ] `.env.example` ergänzen
* [ ] Lose Update-Notizen (`README-UPDATE.txt`, `LIESMICH.txt`, `HINWEISE.txt`) bei Bedarf entfernen
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
