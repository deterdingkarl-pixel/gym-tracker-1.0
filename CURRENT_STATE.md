# Gym App – Current State

## 1. Aktueller Entwicklungsstand

Die App ist ein funktionierendes React-/TypeScript-MVP für Krafttraining.

Aktuell vorhanden bzw. entwickelt:

* Dashboard
* Trainingshistorie
* Trainingspläne
* Übungsbibliothek
* Fortschrittsauswertung
* Einstellungen
* Cloud-Synchronisierung mit Supabase
* persönlicher Standard-Trainingsplan
* automatische Übungsdatenbank
* direkt bearbeitbare Trainingskategorien
* mobiles Layout
* neutrales helles Design
* Anzeigename „Gym App“

Der genaue Live-Stand muss vor weiteren Änderungen anhand des aktuellen GitHub-Repositories geprüft werden.

---

## 2. Aktuelles Repository

GitHub:

`deterdingkarl-pixel/gym-tracker-1.0`

Branch:

`main`

Deployment:

GitHub → Vercel

Änderungen an `main` sollen automatisch einen neuen Vercel-Build auslösen.

---

## 3. Aktueller Trainingsplan

Der persönliche Trainingsplan ist fest in den Code integriert.

### Beine

* Beinbeuger liegend

  * Satz 1: 4 Wdh. × 90 kg
  * Satz 2: 5 Wdh. × 86 kg

* Beinpresse

  * Satz 1: 10 Wdh. × 240 kg
  * Satz 2: 6 Wdh. × 240 kg

* Adduktoren

  * Satz 1: 3 Wdh. × 99 kg
  * Satz 2: 3 Wdh. × 95 kg

* Abduktoren

  * Satz 1: 5 Wdh. × 81 kg
  * Satz 2: 6 Wdh. × 77 kg

* Waden

  * Satz 1: 6 Wdh. × 100 kg
  * Satz 2: 7 Wdh. × 95 kg

* Beinstrecker einbeinig

  * Satz 1: 8 Wdh. × 59 kg
  * Satz 2: 8 Wdh. × 59 kg

### Arme & Schulter

* Preacher Curl

  * Satz 1: 7 Wdh. × 47,5 kg
  * Satz 2: 7 Wdh. × 45 kg

* Trizeps Pushdown

  * Satz 1: 6 Wdh. × 23 kg
  * Satz 2: 5 Wdh. × 23 kg

* Überkopf-Trizeps

  * Satz 1: 5 Wdh. × 36 kg
  * Satz 2: 8 Wdh. × 32 kg

* Hammer Curl sitzend

  * Satz 1: 6 Wdh. × 17,5 kg
  * Satz 2: 9 Wdh. × 16 kg

* Seitheben

  * Satz 1: 7 Wdh. × 30 kg
  * Satz 2: 4 Wdh. × 30 kg
  * ab diesem Stand beidarmig

* Schulterdrücken Multipresse

  * Satz 1: 4 Wdh. × 55 kg + 6 Wdh. × 20 kg
  * Satz 2: 3 Wdh. × 55 kg
  * Interpretation des ersten Satzes als Dropsatz ist nicht abschließend bestätigt.

* Hintere Schulter

  * Satz 1: 6 Wdh. × 55 kg
  * Satz 2: 6 Wdh. × 50 kg
  * mit vorherigem Gewichtsreset

### Brust & Rücken

* Butterfly

  * Satz 1: 7 Wdh. × 70 kg
  * Satz 2: 4 Wdh. × 70 kg

* Multi Presse / Schrägbankdrücken

  * Satz 1: 7 Wdh. × 27,5 kg
  * Satz 2: 8 Wdh. × 25 kg
  * Gewichte wurden als angegebene Werte übernommen und nicht verdoppelt.

* T-Bar

  * Satz 1: 6 Wdh. × 70 kg
  * Satz 2: 4 Wdh. × 70 kg
  * Gewichtsreset berücksichtigt

* Latzug

  * Satz 1: 6 Wdh. × 86 kg
  * Satz 2: 6 Wdh. × 79 kg

* Enges Rudern / enges Latziehen

  * Satz 1: 8 Wdh. × 86 kg oder 6 Wdh. × 66 kg
  * Satz 2: 5 Wdh. × 100 kg oder 4 Wdh. × 66 kg
  * tatsächlich verwendete Variante ist nicht eindeutig dokumentiert.

* Cable Crunches

  * Satz 1: 7 Wdh. × 77 kg
  * Satz 2: 8 Wdh. × 73 kg
  * neuer Kabelturm

Die aufgelisteten Trainingsdaten sind als aktueller Nutzerstand zu behandeln.

---

## 4. Standardplan

Die drei festen Kategorien sind:

* Beine
* Arme & Schulter
* Brust & Rücken

Der persönliche Plan wird beim Start automatisch angelegt, sofern er noch nicht vorhanden ist.

Die Anlage soll keine Duplikate erzeugen.

---

## 5. Übungen

Die App besitzt eine lokale Übungsbibliothek.

Eine externe RepDB-Übungsdatenbank kann automatisch importiert werden.

Der Import:

* läuft im Hintergrund
* fügt neue Übungen hinzu
* überschreibt bestehende Übungen nicht
* verwendet Namensvergleich zur Deduplizierung
* besitzt weiterhin einen manuellen Fallback in den Einstellungen

Vor einer zukünftigen Änderung am Import die aktuelle Implementierung in `repdbImport.ts` prüfen.

---

## 6. Trainingserfassung

Für die drei Hauptkategorien existiert ein direkt bearbeitbares Formular.

Das Ziel ist:

* Kategorie öffnen
* Übungen direkt sehen
* Satz 1 und Satz 2 direkt bearbeiten
* Gewicht direkt ändern
* Wiederholungen direkt ändern
* speichern

Es soll kein unnötiger Umweg über mehrere Bearbeiten-Dialoge nötig sein.

Ein separates freies Training ist weiterhin vorhanden.

---

## 7. Cloud-Sync

Supabase ist integriert.

Vorhanden:

* Registrierung
* Login
* Logout
* Gastmodus
* Abruf der Cloud-Daten
* automatischer Push von Änderungen

Cloud-Tabelle:

`user_data`

Die App kann weiterhin ohne Supabase-Konfiguration lokal betrieben werden.

---

## 8. Datenmodell

Wichtige aktuelle Änderung:

`PlanExercise.targetSets` ist ein Array aus einzelnen Satz-Zielen.

Damit kann z. B. gespeichert werden:

* Satz 1 = 90 kg × 4
* Satz 2 = 86 kg × 5

Diese Struktur darf nicht wieder auf einen gemeinsamen Zielwert reduziert werden.

---

## 9. UI / Mobile

Der zuletzt entwickelte UI-Stand beinhaltet:

* helles neutrales Grau
* Icon-only Bottom-Navigation auf Mobile
* Safe-Area-Unterstützung
* kompaktere Modals
* mindestens 16 px Eingabefeldschrift auf Mobile gegen iOS-Zoom
* besseres Wrapping von Buttons
* „Gym App“ als sichtbarer Name

**Status dieser Änderungen: nicht bestätigt live getestet.**

Vor weiteren UI-Änderungen zuerst den echten aktuellen Repository-/Vercel-Stand prüfen.

---

## 10. Bekannte technische Probleme

* Deployment wurde in der Vergangenheit durch falsche Uploads und alte Vercel-Deployments erschwert.
* Supabase-URL muss die reine Projekt-URL sein und darf nicht mit `/rest/v1/` enden.
* Cloud-Sync besitzt keinen echten Merge bei gleichzeitigen Änderungen.
* RepDB-Deduplizierung basiert auf Namen.
* Zwei Trainingsplanangaben sind nicht vollständig eindeutig.

---

## 11. Nächste Priorität

### Höchste Priorität

Aktuellen Code und tatsächlichen Live-Stand überprüfen.

Danach:

* offene UI-/Mobile-Probleme beheben
* direkte Kategorie-Bearbeitung vollständig verifizieren
* Standardplan und Übungsbibliothek prüfen
* erst anschließend neue Features hinzufügen

