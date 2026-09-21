# Gym Tracker – Project Context

## 1. Projekt

Der Gym Tracker ist eine eigene Web-App zum Erfassen und Auswerten von Krafttraining.

Die App soll langfristig ermöglichen, Workouts strukturiert zu planen, durchzuführen und anschließend den Trainingsfortschritt nachvollziehbar zu machen.

Der Fokus liegt auf einer übersichtlichen, schnellen und praktischen Nutzung während des Trainings.

---

## 2. Ziel

Die App soll eine einfache Alternative zu bestehenden Gym-Tracking-Apps darstellen.

Wichtige Ziele:

* Übungen auswählen können, ohne sie jedes Mal manuell anzulegen
* Workouts erstellen und durchführen
* Sätze, Wiederholungen und verwendete Gewichte erfassen
* vergangene Trainingseinheiten speichern
* Fortschritte nachvollziehen
* persönliche Bestleistungen erkennen
* später umfangreiche Statistiken und Auswertungen ermöglichen

Die App soll dabei möglichst einfach und schnell bedienbar bleiben.

---

## 3. Aktueller Entwicklungsworkflow

Der aktuelle Workflow ist:

Claude
→ Code erstellen bzw. ändern
→ Änderungen in GitHub übernehmen
→ GitHub ist mit Vercel verbunden
→ Vercel deployt die aktuelle Version automatisch.

GitHub ist die maßgebliche Quelle für den aktuellen Code.

Vercel dient hauptsächlich als Hosting- und Deployment-Plattform.

---

## 4. Technologie

Aktuell wird eine moderne Web-App mit React/TypeScript aufgebaut.

Bekannte Projektdateien sind unter anderem:

* `App.tsx`
* `index.css`
* `main.tsx`
* `index.html`
* `package.json`

Die genaue Projektstruktur soll immer anhand des tatsächlich aktuellen Codes geprüft werden.

Keine Dateien, Komponenten oder Libraries erfinden, die nicht im aktuellen Repository vorhanden sind.

---

## 5. Grundprinzipien der Entwicklung

### Bestehende Funktionen schützen

Bereits funktionierende Funktionen sollen nicht unnötig verändert oder entfernt werden.

Bei Änderungen:

1. Bestehenden Code zuerst verstehen.
2. Nur notwendige Dateien verändern.
3. Bestehende Funktionen erhalten.
4. Keine unnötigen Dependencies hinzufügen.
5. Keine komplette Neuimplementierung durchführen, wenn eine kleinere Änderung ausreicht.

### Einfachheit

Wenn mehrere technische Lösungen möglich sind, soll grundsätzlich die einfachere und zuverlässigere Lösung bevorzugt werden.

### Erweiterbarkeit

Neue Funktionen sollen möglichst so umgesetzt werden, dass der Code später erweitert werden kann.

---

## 6. Übungsdatenbank

Ein wichtiges geplantes Feature ist eine umfangreiche Übungsdatenbank.

Der Nutzer soll aus vielen vorhandenen Gym-Übungen auswählen können, anstatt jede Übung manuell erstellen zu müssen.

Dabei soll möglichst eine kostenlose bzw. frei nutzbare Datenquelle verwendet werden.

Die Integration soll so erfolgen, dass später weitere Übungen bzw. Datenquellen problemlos ergänzt werden können.

---

## 7. Geplante Kernfunktionen

Langfristig soll der Gym Tracker unter anderem folgende Funktionen besitzen:

* Übungsdatenbank
* Übungssuche
* Übungsauswahl
* Workout-Erstellung
* Workout-Durchführung
* Gewicht und Wiederholungen erfassen
* mehrere Sätze pro Übung
* Trainingshistorie
* Fortschrittsanzeige
* persönliche Bestleistungen
* Statistiken
* Körpergewicht erfassen
* langfristige Trainingsauswertung

Nicht alle Funktionen sind bereits implementiert.

Der aktuelle Implementierungsstand steht in `CURRENT_STATE.md`.

---

## 8. Daten

Der genaue aktuelle Speichermechanismus muss anhand des tatsächlichen Codes geprüft werden.

Keine Annahmen über Datenbank, API oder Persistenz treffen, wenn diese nicht im aktuellen Repository vorhanden sind.

Bei der späteren Entwicklung soll darauf geachtet werden, dass Trainingsdaten zuverlässig gespeichert und wieder abgerufen werden können.

---

## 9. UI / UX

Die App soll:

* übersichtlich
* modern
* schnell
* während des Trainings einfach bedienbar
* möglichst intuitiv

sein.

Funktionalität und Bedienbarkeit sind wichtiger als unnötige dekorative Elemente.

Mobile Nutzung soll berücksichtigt werden, da ein Gym Tracker hauptsächlich während des Trainings verwendet wird.

---

## 10. Claude-Kontext

Der Verlauf eines einzelnen Claude-Chats ist KEIN dauerhafter Projektkontext.

Bei einem neuen Chat muss Claude ausschließlich anhand von:

* diesem Dokument
* `CURRENT_STATE.md`
* `TODO.md`
* dem aktuellen GitHub-Code
* den Anweisungen des aktuellen Chats

arbeiten.

Niemals Informationen aus einem früheren Chat erfinden.

Wenn aktuelle Dokumentation und tatsächlicher Code widersprechen, hat der tatsächliche Code Vorrang.

---

## 11. Entwicklungsprinzip

Der Gym Tracker wird schrittweise entwickelt.

Neue Funktionen sollen möglichst einzeln und kontrolliert implementiert werden.

Nach größeren Änderungen sollen `CURRENT_STATE.md` und `TODO.md` aktualisiert werden.

Wenn sich eine dauerhafte technische Entscheidung ändert, soll auch dieses Dokument aktualisiert werden.
