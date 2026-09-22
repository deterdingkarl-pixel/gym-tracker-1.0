# Gym App – Current State

Stand: 21.09.2026 — nach Umsetzung der Priorität-1-Fixes und des Live-Training-Updates
(Cloud-Sync-Fehlerfall, Fortschrittsdiagramm-Sortierung, Beinpresse im Standardplan,
Sync-Warnhinweise, geklärte Plan-Werte, Autosave + Trainingsdauer-Timer in
`CategoryQuickLog`). **Noch nicht bestätigt:** Deployment dieser Version auf Vercel
und Test auf dem iPhone — der Nutzer spielt die Dateien manuell über GitHub ein.

## 1. Was sich mit diesem Update ändert

* **`src/lib/cloudSync.ts` / `src/components/CloudSync.tsx`:** Ein echter Ladefehler beim
  Abrufen der Cloud-Daten wird jetzt nicht mehr fälschlich als „keine Cloud-Daten
  vorhanden" behandelt — es wird in diesem Fall nichts hochgeladen.
* **`src/pages/Progress.tsx`:** Das Übungsfortschritts-Diagramm sortiert jetzt nach dem
  echten Datum, nicht mehr nach dem Anzeigetext „dd.MM".
* **`src/data/userPlan.ts`:** „Beinpresse" ist jetzt Teil des persönlichen
  Übungs-Sets. „Schulterdrücken Multipresse" besteht aus zwei normalen Sätzen
  (kein Dropsatz). „Enges Rudern" (5×100) und „Enges Latziehen" (8×86) sind zwei
  getrennte Übungen.
* **`src/pages/Settings.tsx`:** Reset- und Import-Bereich weisen jetzt darauf hin,
  wenn bei aktivem Cloud-Sync auch die Cloud-Daten betroffen sind.
* **`src/types/index.ts`:** Neues optionales Feld `Workout.startedAt`.
* **`src/components/CategoryQuickLog.tsx`:** Speichert jetzt automatisch (debounced,
  kein Speichern-Button mehr nötig) und zeigt eine Trainingsdauer an, sobald der
  erste Wert gespeichert wurde. Die Dauer wird beim Öffnen immer aus der echten
  Ist-Zeit neu berechnet — kein echter Hintergrundprozess bei komplett geschlossener
  App (reine Web-App), aber korrekte Anzeige nach dem Wiederöffnen.

## 2. Im Code vorhandene Funktionen (unverändert gegenüber letzter Analyse, außer oben)

**Routing:** `/`, `/training-eintragen`, `/plaene`, `/uebungen`, `/fortschritt`, `/einstellungen`.

* **Dashboard:** Kennzahlen, Wochenvolumen-Diagramm, Trainingskalender, Top-4-PRs, letzte Einheit.
* **Training eintragen:** drei Kategorie-Karten, darunter `CategoryQuickLog` (jetzt mit Autosave + Timer); „Freies Training" über `WorkoutFormModal` (weiterhin mit explizitem Speichern-Button, unverändert); Historie mit Bearbeiten, Kopieren, Löschen.
* **Trainingspläne:** erstellen, bearbeiten, duplizieren, löschen, favorisieren, Übungen sortieren, Ziel-Wdh./-Gewicht **pro Satz**.
* **Übungen:** Bibliothek mit Suche und Filtern, CRUD.
* **Fortschritt:** Zeitraumfilter, Übungsverlauf (jetzt korrekt datumssortiert), PR, Kalender, Wochentagsauswertung, Körpergewicht.
* **Einstellungen:** kg/lb, Hell/Dunkel, RepDB-Import, JSON-Export/-Import (mit Cloud-Hinweis), Zurücksetzen (mit Cloud-Hinweis), Konto-Bereich.
* **Login/Cloud:** E-Mail/Passwort, Registrierung, Gastmodus, Abmelden; robusterer Fehlerfall beim Laden.
* **Design/Mobile:** unverändert (helles neutrales Grau, Dark Mode, „Gym App", Bottom-Nav, Safe-Area, Overflow-Fix, 16px-Schrift).

## 3. Wichtige Dateien

Wie in `PROJECT_CONTEXT.md` § 4 — unverändert, nur Dateiinhalte der oben genannten Dateien geändert.

## 4. Persönlicher Trainingsplan (Ist-Stand nach Update)

### Beine

Unverändert: Beinbeuger liegend, Beinpresse, Adduktoren, Abduktoren, Waden, Beinstrecker einbeinig.

### Arme & Schulter

Unverändert bis auf:
* **Schulterdrücken Multipresse: 4×55 / 3×55** (zwei Sätze, kein Dropsatz mehr)

### Brust & Rücken

Unverändert bis auf:
* **Enges Rudern: 5×100** (eigene Übung)
* **Enges Latziehen: 8×86** (eigene Übung)

### Keine offenen fachlichen Unklarheiten mehr

Beide zuvor offenen Punkte sind am 21.09.2026 mit Karl geklärt (siehe `PROJECT_CONTEXT.md` §8/§9).

**Wichtiger Hinweis:** Falls die Pläne „Arme & Schulter" oder „Brust & Rücken" bereits
vor diesem Update in der laufenden App (lokal oder Cloud) existierten, wurden sie
NICHT automatisch aktualisiert — die neuen Werte gelten nur für neu angelegte Pläne.
Manuelles Nachziehen (Bearbeiten oder Löschen+Neuanlage) nötig.

## 5. Datenmodell

`PlanExercise.targetSets` weiterhin ein Array pro Satz. Neu: `Workout.startedAt?: string`
(optional, keine Migration nötig, ältere Workouts bleiben gültig).

## 6. Bekannte Probleme und Risiken (Stand nach Update)

1. ~~Cloud-Sync kann Cloud-Daten überschreiben~~ — behoben.
2. ~~Fortschrittsdiagramm falsch sortiert~~ — behoben.
3. **Datum in UTC:** weiterhin offen (`toISOString().slice(0, 10)` an mehreren Stellen).
4. **Beispieldaten beim Erststart:** weiterhin offen.
5. ~~Import/Reset im Sync-Modus ohne Hinweis~~ — Warnhinweise ergänzt, technisches Verhalten (Überschreiben) bleibt wie zuvor bestehen.
6. **Geräte-/Konto-Wechsel:** weiterhin offen.
7. **Übungsauswahl ohne Suche:** weiterhin offen.
8. **Deep Links:** weiterhin unbestätigt.
9. **RepDB-Dedupe nur nach Name:** weiterhin offen.
10. **Sync-Konflikte bei zwei Geräten:** weiterhin offen (bekannt, akzeptiert).
11. **Serien-Kennzahl** (Kalendertage-Streak): weiterhin wie zuvor, unverändert.
12. **Neu — Live-Timer bei komplett geschlossener App:** kein echter Hintergrundprozess, nur korrekte Neuberechnung beim Wiederöffnen. Bewusst akzeptierte technische Grenze einer reinen Web-App.

## 7. Cloud-Sync und Speicherung

Unverändert (Storage-Key `iron-log:data`, Tabelle `user_data`), außer dem robusteren Fehlerverhalten beim Laden (siehe oben).

## 8. Nächste Priorität

Siehe `TODO.md`: Live-Training praktisch testen (inkl. komplettem App-Schließen), dann iPhone-Realtest, danach Priorität-2-Punkte.
