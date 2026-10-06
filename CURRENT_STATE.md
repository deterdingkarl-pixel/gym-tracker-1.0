# Gym App – Current State

Stand: 06.10.2026 — abgeglichen mit dem Code im GitHub-Stand (Dateien einzeln geprüft).
**Noch nicht bestätigt:** Praxistest auf dem iPhone/Handy (Navigation, Live-Training, Zielwerte-Nachziehen, Cloud-Sync mit zwei Geräten).

## 1. Zuletzt hinzugekommen (im Code vorhanden)

* **Zielwerte folgen dem letzten Training** (`src/components/CategoryQuickLog.tsx`, Funktion `syncPlanTargets`): Nach jedem Autosave werden die eingetragenen Sätze (Wdh. + Gewicht pro Satz) in `plan.exercises[].targetSets` zurückgeschrieben. Beim nächsten Training sind sie vorausgefüllt, in „Trainingspläne" stehen dieselben Werte, Cloud-Sync überträgt die Plan-Änderung mit.
  * Nur die **jüngste** Einheit eines Plans aktualisiert die Ziele (ältere Tage nachtragen überschreibt nichts).
  * Nur Übungen, die **bereits im Plan** stehen und mindestens einen Satz haben. Per Dropdown getauschte/zusätzliche Übungen werden nicht in den Plan übernommen.
  * Weniger eingetragene Sätze = weniger Zielsätze im Plan. RPE wird nicht übernommen.
  * Gilt nur für `CategoryQuickLog`, nicht für Freies Training (`WorkoutFormModal`).
  * Löschen oder nachträgliches Bearbeiten eines Trainings (Historie) setzt die Plan-Ziele **nicht** zurück.
* **Cloud-Sync Zeitstempel-Abgleich** (`storage.ts`: `iron-log:last-modified`, `CloudSync.tsx`): Beim Öffnen wird der Cloud-Stand nur übernommen, wenn er neuer ist als der lokale; sonst bleibt lokal erhalten und wird hochgeladen. Ausstehende Pushes werden bei `visibilitychange`/`pagehide` sofort gesendet. Echter Ladefehler → nichts wird hochgeladen.
* **Fortschritt – Übungsauswahl** (`Progress.tsx`): nur Übungen mit mindestens einem erfassten Satz, gruppiert (`optgroup`) nach Trainingsart, „Ohne Kategorie" zuletzt. Diagramm nach ISO-Datum sortiert.
* **Live-Training** (seit 21.09.2026): Autosave (~700 ms Debounce), `Workout.startedAt`, Dauer wird aus Ist-Zeit berechnet (kein Hintergrundprozess bei geschlossener App).

## 2. Funktionen im Code

**Routing:** `/`, `/training-eintragen`, `/plaene`, `/uebungen`, `/fortschritt`, `/einstellungen`.

* **Dashboard:** Kennzahlen, Wochenvolumen, Trainingskalender, Top-4-PRs, letzte Einheit.
* **Training eintragen:** drei Kategorie-Karten (Beine, Arme & Schulter, Brust & Rücken) mit `CategoryQuickLog`; „Freies Training" über `WorkoutFormModal` (expliziter Speichern-Button); Historie mit Bearbeiten, Kopieren, Löschen.
* **Trainingspläne:** CRUD, Favoriten, Sortierung, Ziele pro Satz.
* **Übungen:** Bibliothek mit Suche + Filtern, CRUD. Übungsauswahl in Formularen ist weiterhin ein reines Dropdown (keine Suche).
* **Fortschritt:** Zeitraumfilter, Übungsverlauf, PR, Kalender, Wochentage, Körpergewicht.
* **Einstellungen:** kg/lb, Hell/Dunkel, RepDB-Import, JSON-Export/-Import und Reset (mit Cloud-Hinweis), Konto.
* **Login/Cloud:** Supabase E-Mail/Passwort, Gastmodus, Abmelden.
* **Standardplan:** `userPlan.ts` + `defaultPlanSeed.ts` (nur neue Pläne per Namen, bestehende werden nicht aktualisiert).

## 3. Bekannte Probleme und Risiken

1. **Datum in UTC:** `toISOString().slice(0, 10)` an mehreren Stellen (u. a. `CategoryQuickLog.todayStr`) — kurz nach Mitternacht lokaler Zeit kann der „heutige" Tag noch der Vortag sein; betrifft auch die „jüngste Einheit"-Prüfung der Zielwerte.
2. **Beispieldaten beim Erststart:** weiterhin offen.
3. **Geräte-/Konto-Wechsel:** weiterhin offen.
4. **Übungsauswahl ohne Suche:** weiterhin offen.
5. **Deep Links auf Vercel:** unbestätigt.
6. **RepDB-Dedupe nur nach Name.**
7. **Sync-Konflikte bei zwei Geräten:** kein echter Merge (bekannt, akzeptiert).
8. **Live-Timer bei geschlossener App:** nur Neuberechnung beim Öffnen (akzeptierte Grenze).
9. **Zielwerte-Autosave schreibt auch Zwischenstände:** während des Tippens kann der Plan kurz unvollständige Werte enthalten (z. B. Wdh. 0), nach dem nächsten Autosave stimmt er wieder.
10. **Doppelte Übung im selben Training:** nur der erste Eintrag mit dieser Übung aktualisiert den Plan.
11. Bereits angelegte Pläne werden bei Änderungen an `userPlan.ts` nicht automatisch aktualisiert.

## 4. Cloud-Sync und Speicherung

Storage-Keys `iron-log:data`, `iron-log:last-modified`, `iron-log:guest-mode`, `iron-log:repdb-auto-imported`. Tabelle `user_data` (RLS pro Nutzer). Details siehe `CloudSync.tsx` und `cloudSync.ts`.

## 5. Hinweis zu losen Update-Dateien im Repo

`README-UPDATE.txt`, `LIESMICH.txt`, `HINWEISE.txt` sind einmalige Einspiel-Notizen früherer Updates; deren Inhalt ist im Code umgesetzt und hier dokumentiert. Sie können bei Bedarf gelöscht werden.

## 6. Nächste Priorität

Siehe `TODO.md`: Praxistest der Zielwerte-Funktion und des Live-Trainings, iPhone-Realtest, dann Priorität 2.
