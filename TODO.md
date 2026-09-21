# Gym App – TODO

Stand: 21.09.2026 (Analyse von GitHub `main` @ `1a0b916` + Vercel-Deployment + lokalem Build).
Aufgaben erst abhaken, wenn sie tatsächlich funktionieren.

## Priorität 1 – Datensicherheit und Korrektheit

* [ ] **Cloud-Sync-Fehlerfall:** Ladefehler von „keine Cloud-Daten vorhanden“ unterscheiden; bei einem Fehler nichts hochladen (`src/lib/cloudSync.ts`, `src/components/CloudSync.tsx`)
* [ ] **Fortschrittsdiagramm:** Punkte nach echtem Datum statt nach dem Text „dd.MM“ sortieren (`src/pages/Progress.tsx`)
* [ ] **Beinpresse** in `USER_PLAN_EXERCISES` aufnehmen, damit sie nie stillschweigend aus dem Plan „Beine“ fällt (`src/data/userPlan.ts`)
* [ ] **Warnhinweise im Sync-Modus:** JSON-Import, Zurücksetzen und „Alle Daten löschen“ überschreiben auch die Cloud — Texte und Bestätigung in den Einstellungen anpassen
* [ ] **Rücksprache mit Karl:** Schulterdrücken Multipresse (Dropsatz ja/nein → 2 oder 3 Sätze) und Enges Rudern/Latziehen (welche Variante) klären
* [ ] Manueller Test auf dem iPhone (Navigation, Formulare, Safe-Area, iOS-Zoom, Homescreen)
* [ ] **Bestätigung auf dem iPhone:** Überlauf-Fix (kein seitliches Scrollen mehr im Kategorie-Formular und in den Bearbeiten-Modals) und Dark Mode — Code fertig und im Headless-Browser bei 320–430 px geprüft, echter Test steht aus

## Priorität 2 – Verbesserungen

* [ ] Entscheidung: Erststart ohne Beispieldaten? (Demo-Trainings/-Pläne verfälschen Dashboard und Rekorde)
* [ ] Datum lokal statt UTC erzeugen (`toISOString().slice(0, 10)` in `CategoryQuickLog`, `WorkoutFormModal`, `useAppStore`, `calculations`, `Progress`, `seedData`)
* [ ] Übungsauswahl mit Suche statt langem Dropdown (Pläne, Training); `WorkoutFormModal` alphabetisch sortieren
* [ ] „Übungsfortschritt“ nur mit Übungen aus den Trainingsplänen anbieten (aktuell alle Übungen)
* [ ] JSON-Import validieren (Struktur von `plans`, `workouts`, `bodyMetrics`, `settings`)
* [ ] Plan-Notiz (`PlanExercise.note`, z. B. Dropsatz-Hinweis) in Plänen und Kategorie-Formular anzeigen
* [ ] Verhalten bei Konto-/Gerätewechsel absichern (lokale Daten beim Abmelden, Gast-Daten vs. Cloud-Stand)
* [ ] Prüfen, ob Neuladen von Unterseiten auf Vercel funktioniert; sonst `vercel.json` mit SPA-Rewrite ergänzen
* [ ] Körpergewichts-Einträge löschbar machen (Store-Aktion `deleteBodyMetric` existiert, UI fehlt)

## Trainingssystem

* [x] Direktbearbeitung der Kategorien im Code vorhanden (`CategoryQuickLog`)
* [ ] Beine direkt bearbeiten und speichern — praktisch testen
* [ ] Arme & Schulter direkt bearbeiten und speichern — praktisch testen
* [ ] Brust & Rücken direkt bearbeiten und speichern — praktisch testen
* [ ] Satz 1 und Satz 2 unabhängig bearbeiten — praktisch testen
* [ ] Änderungen zuverlässig speichern
* [ ] Änderungen zuverlässig aus der Cloud laden

## Übungsbibliothek

* [x] RepDB-Endpunkt erreichbar (601 Übungen, Felder passen zum Mapping); Browser-Import (CORS) noch nicht getestet
* [ ] Große externe Übungsdatenbank im Browser zuverlässig importieren
* [ ] Suche optimieren
* [ ] Filter optimieren
* [ ] Deduplizierung verbessern (aktuell nur nach Name)
* [ ] prüfen, dass Trainingspläne ausschließlich vorhandene Übungen verwenden
* [ ] unnötige Freitexteingaben vermeiden

## Cloud / Multi-Device

* [ ] Synchronisierung zwischen Computer und iPhone testen
* [ ] Cloud-Daten nach Login korrekt laden
* [ ] Änderungen automatisch synchronisieren
* [ ] Verhalten bei zwei Geräten gleichzeitig testen
* [ ] Konflikt-/Merge-Strategie später verbessern

## Trainingshistorie

* [ ] vergangene Workouts übersichtlich anzeigen
* [ ] Workout öffnen
* [ ] Gewicht und Wiederholungen anzeigen
* [ ] Fortschritt je Übung anzeigen
* [ ] Bearbeiten/Kopieren/Löschen vollständig testen

## Fortschritt / Statistik

* [ ] persönliche Bestleistungen
* [ ] Gewichtsentwicklung
* [ ] Wiederholungsentwicklung
* [ ] Trainingsvolumen
* [ ] Trainingshäufigkeit
* [ ] Fortschrittsdiagramme
* [ ] Körpergewicht-Historie
* [ ] langfristige Statistiken
* [ ] Serien-Kennzahl überdenken (aktuell aufeinanderfolgende Kalendertage, passt schlecht zu 3 Trainingstagen pro Woche)

## UI / Mobile

* [ ] aktuelle Darstellung auf iPhone testen
* [ ] Navigation auf kleinen Displays testen
* [ ] Safe-Area-Verhalten testen
* [ ] Formulare auf kleinen Displays testen (fünfspaltige Satz-Zeilen im Kategorie-Formular)
* [ ] Dezimaleingabe mit Komma (z. B. 47,5) auf dem iPhone testen
* [ ] keine horizontalen Überläufe
* [ ] keine abgeschnittenen Buttons
* [ ] keine iOS-Zoom-Probleme
* [ ] helles neutrales Grau konsistent anwenden
* [ ] Modal-Höhe auf iPhone (`max-h-[90vh]`) prüfen
* [ ] Dark Mode: Statusleiste im Homescreen-Modus prüfen (`apple-mobile-web-app-status-bar-style` ist fest `default`)
* [ ] Entscheidung: Theme pro Gerät statt mit der Cloud synchronisiert?

## Einstellungen

* [ ] kg/lb testen
* [ ] JSON-Export testen
* [ ] JSON-Import testen
* [ ] Daten zurücksetzen testen
* [ ] Supabase-Accountbereich testen
* [ ] RepDB-Import testen

## Repository / Deployment / Doku

* [ ] `.gitignore` ergänzen (fehlt; u. a. `node_modules`, `dist`, `.env.local`, `*.tsbuildinfo`)
* [ ] `.env.example` ergänzen (README verweist darauf, Datei fehlt)
* [ ] README korrigieren: Beispiel-Plan heißt im Code „Beispiel: Beine“ (nicht „Beine“); Verweis auf `.env.example`
* [ ] Bundle-Größe (ca. 905 kB) bei Bedarf per Code-Splitting verringern
* [ ] Optional: Web-Manifest und App-Icon für den Homescreen
* [ ] Optional: Doku-Commits lösen jeweils ein Production-Deployment aus — bei Bedarf bündeln

## Später

* [ ] Drag-and-Drop für Planübungen
* [ ] Körpermaße/Umfänge vollständig integrieren
* [ ] Passwort-zurücksetzen
* [ ] weitere Login-Methoden
* [ ] Undo/Papierkorb
* [ ] Mehrsprachigkeit
* [ ] weitere sinnvolle Gym-Tracking-Funktionen

## Nicht implementiert

* [ ] automatische wöchentliche Suche nach Energy-Drink-Angeboten in lokalen Supermärkten

Dieses Feature wurde im bisherigen Projektstand nicht als App-Funktion umgesetzt.

## Erledigt

* [x] GitHub-Repository eingerichtet
* [x] GitHub mit Vercel verbunden
* [x] automatisches Deployment über Vercel
* [x] Supabase-Integration
* [x] Login/Registrierung
* [x] Gastmodus
* [x] persönlicher Standardplan fest in den Code integriert
* [x] individuelle Satzwerte in Trainingsplänen
* [x] externe Übungsdatenbank integriert
* [x] Trainingskategorien konzipiert
* [x] neutrales helles Design entwickelt
* [x] App in „Gym App“ umbenannt
* [x] Mobile-Optimierungen entwickelt
* [x] Aktuellen GitHub-Code vollständig analysiert (21.09.2026)
* [x] Mobile-/UI-Stand ist im Repository vorhanden (Commit `947352c`)
* [x] Aktueller Stand ist auf Vercel deployed (Production READY für `main` @ `1a0b916`)
* [x] Lokaler Build (`npm run build`) erfolgreich
* [x] Überlauf im Kategorie-Formular und in den Modals behoben (Layout-Regel in `PROJECT_CONTEXT.md`), im Headless-Browser verifiziert
* [x] Dark Mode (Schwarz und dunkles Grau) umgesetzt, umschaltbar in den Einstellungen

## Regeln

Aufgaben erst abhaken, wenn sie tatsächlich funktionieren.

Nach größeren Änderungen:

1. Code prüfen/testen
2. TODO aktualisieren
3. CURRENT_STATE aktualisieren
4. dauerhaft relevante technische Entscheidungen in PROJECT_CONTEXT aktualisieren
