# SuperTranslatorPro Checkliste

> Diese Datei zeigt, was bereits umgesetzt ist und welche Punkte aktuell noch offen sind.

## Aktueller Status
- **Version:** 28.2
- **Datum:** 2. April 2026
- **Status:** Produktiv nutzbare Basis. Fokus aktuell auf Feinschliff, Copyfit, Provider-Stabilisierung, Hybrid-Modus und UXP-Planung.

---

## Kurzstatus

### Bereits umgesetzt
- [x] Deutsche Rechtschreibprüfung inkl. Korrekturdialog für `-de` Musterseiten und zugehörige Dokumentseiten
- [x] Verlinken von Referenzen und Web-URLs
- [x] Live-Auslesen der Sprach-/Seitenzuordnung von Seite 1 für Hyperlinks
- [x] Automatische Musterseiten-Generierung inkl. Erkennung, Auswahl/Abwahl und Reihenfolge
- [x] Wörterbuch-/Glossar-System inkl. Erststart-Setup, Template, Migration und verständlicher Erklärungen
- [x] Dynamische UI-Sprache DE/EN über `app.locale`
- [x] Nachbearbeitung technischer Tokens wie `M5*15`, damit Leerzeichen sauber bleiben
- [x] Provider-Abstraktion mit DeepL als Default und OpenAI als optionalem Phase-1-Provider

### Noch offen
- [ ] Intelligente Copyfitting-Logik
- [ ] Optionaler Hybrid-Modus zwischen DeepL und LLMs
- [ ] Migration auf UXP / Plugin-Architektur
- [ ] Erweiterte End-to-End-Tests mit echten InDesign-Dokumenten

---

## Übersicht
- [x] Rechtschreibprüfung in der Mastersprache
- [ ] Intelligente Copyfitting-Logik
- [x] Automatische Musterseiten-Generierung (Legacy-Fallback)
- [x] Andere LLMs (ChatGPT / Gemini / Claude)
- [ ] Migration auf UXP
- [ ] UI/UX Optimierung
- [x] Verlinken (Linking Features)
- [x] Wörterbuch / Glossar-System

---

## 1. Rechtschreibprüfung in der Mastersprache
- [x] UI-Button für die deutsche Prüfung eingebaut
- [x] Deutsche `-de` Masterseiten erkennen
- [x] Zugehörige Dokumentseiten auf Basis der deutschen Musterseite prüfen
- [x] Korrekturhinweise und Dialog zur Übernahme/Überspringen anzeigen
- [x] Ergebnisse sauber zusammenfassen
- [ ] Optional: Direkten Sprung zur ersten Auffälligkeit weiter verbessern

**Notizen:**
- Funktion ist produktiv nutzbar. Sinnvoll wären noch mehr Praxistests mit unterschiedlichen Layout-Strukturen.

---

## 2. Intelligente Copyfitting-Logik
- [ ] Neue Helper-Funktion `applySmartCopyfit(textFrame)` erstellen
- [ ] Priorität 1: Tracking (Laufweite) schrittweise bis -10 reduzieren
- [ ] Priorität 2: Horizontal Scale (Zeichenbreite) schrittweise bis 98% reduzieren
- [ ] Priorität 3: Rahmenvergrößerung nur als letzter Fallback anwenden
- [ ] Overflow-Fix innerhalb von `executeTranslation` ersetzen

**Notizen:**
- Das ist aktuell eines der wichtigsten offenen Themen.

---

## 3. Automatische Musterseiten-Generierung (Legacy-Fallback)
- [x] In `runBDAMode` prüfen, ob zielsprachige Masterseiten fehlen
- [x] Deutsche `-de` Masterseite identifizieren
- [x] UI-Dialog für Zielsprachen implementieren
- [x] Bereits erkannte Zielsprachen automatisch aktivieren
- [x] Sprachen manuell auswählen oder abwählen
- [x] Reihenfolge pro Sprache über Eingabefeld festlegen
- [x] Deutsche Masterseite für fehlende Sprachen duplizieren
- [x] Neue Masters korrekt umbenennen (`-en`, `-fr`, etc.)
- [x] Bereits vorhandene und neue Musterseiten passend neu anordnen
- [x] Danach normalen BDA-Automatikfluss fortsetzen
- [ ] End-to-End-Test mit mehreren echten BDA-Dokumenten abschließen

**Notizen:**
- Der Legacy-Fallback ist umgesetzt und deutlich flexibler als in der ersten Planung.

---

## 4. Andere LLMs (ChatGPT / Gemini / Claude)
- [x] Provider-Interface für Übersetzungen definieren
- [x] DeepL als Default behalten
- [x] OpenAI-Adapter für XML-/Tag-sichere Übersetzungen ergänzen
- [x] Adapter für Google / Gemini ergänzen
- [x] Adapter für Anthropic / Claude ergänzen
- [x] Lokalen OpenAI-kompatiblen Provider für LM Studio / Ollama ergänzen
- [x] UI für Provider-Auswahl und API-Key-Felder hinzufügen

**Notizen:**
- DeepL bleibt Standard; OpenAI, Gemini, Claude und lokale OpenAI-kompatible Server hängen jetzt an derselben XML-/Tag-validierten Provider-Schicht.
- Offene Folgeschritte sind vor allem Live-Tests in echten InDesign-Dokumenten sowie später ein optionaler Hybrid-/Polish-Modus.

---

## 5. Migration auf UXP
- [ ] Kernlogik / UI klar trennen
- [ ] UXP-Plugin-Struktur planen (`manifest.json`, HTML/CSS/JS)
- [ ] UXP-UI-Portierung vorbereiten

**Notizen:**
- Aktuell noch Zukunftsthema.

---

## 6. UI/UX Optimierung
- [x] Dynamische Anpassung der Skript-Sprache an `app.locale` (DE/EN)
- [x] Legacy-Dialogtext verbessert, damit auch erkannte Sprachen verständlich erklärt werden
- [x] Auswahl-/Abwahl-Logik im Musterseiten-Dialog erweitert
- [x] Reihenfolge-Feld pro Sprache im Musterseiten-Dialog ergänzt
- [ ] Weitere UI-Feinschliffe und Usability-Tests in InDesign

**Notizen:**
- UI ist deutlich besser als im ursprünglichen Plan, aber noch nicht vollständig finalisiert.

---

## 7. Verlinken (Linking Features)
- [x] System für Referenz-Symbole in Einstellungen integriert (Standard `[]`)
- [x] Button "Hyperlinks" im manuellen Modus implementiert
- [x] Automatische Erkennung und Verlinkung von Web-URLs integriert
- [x] Sprach-/Seitenzuordnung live von Seite 1 auslesen
- [x] Automatische Referenz-Hyperlinks im BDA-Modus integriert
- [x] Fehlende Sprachen beim Auto-Linking ignorieren statt fehlerhaft zu verlinken
- [ ] Zukunft: Weitere Cross-Reference- oder Paket-Referenz-Logik ausbauen

**Notizen:**
- Verlinken ist inzwischen deutlich weiter als im ursprünglichen Plan.

---

## 8. Wörterbuch / Glossar-System
- [x] Erststart-Dialog: neues Wörterbuch erstellen oder bestehendes auswählen
- [x] Glossar-Template automatisch erzeugen
- [x] Alle unterstützten Sprachspalten im Template ergänzen
- [x] Meta-Spalten `_SOURCE`, `_INFO`, `_FLAGS`, `_ALIASES` integrieren
- [x] `_SOURCE` mit leerem Feld = Standard `DE`
- [x] Bestehendes Wörterbuch auf neues Format migrieren
- [x] Erklärungen und Beispiele für andere Nutzer verständlicher machen
- [ ] Optional: CSV-Validierung oder Glossar-Prüfung ergänzen

**Notizen:**
- Dieser Bereich ist inzwischen produktiv nutzbar und war im alten Plan noch gar nicht vollständig erfasst.

---

## Prioritäten
1. Intelligente Copyfitting-Logik
2. UI/UX Feinschliff und echte InDesign-Tests
3. Weitere LLM-Anbieter
4. Migration auf UXP
5. Zusätzliche Cross-Reference- und Glossar-Validierung

---

## Offene ToDo-Punkte
- [ ] `applySmartCopyfit(textFrame)` mit Tracking/Scale/Frame bauen
- [ ] Overflow-Fix in `executeTranslation` ersetzen
- [ ] Legacy-BDA, Auto-Hyperlinks und Glossar-Flow in echten Projekten breit testen
- [ ] Gemini-/Claude-Live-Tests inkl. Grenzfällen mit XML, Tabellen und langen BDA-Läufen durchführen
- [ ] Lokale LLM-Live-Tests mit LM Studio und Ollama durchführen
- [ ] Optionalen Hybrid-Modus (z. B. DeepL + LLM-Polish) konzipieren
- [ ] UXP-Refactoring-Plan erstellen
- [ ] Glossar-Validator für fehlerhafte CSV-Struktur ergänzen
- [ ] Erweiterte Cross-Reference-Logik für Spezialfälle ausbauen

---

## Änderungslog
- 2. April 2026: Gemini- und Claude-Adapter auf die gemeinsame XML-/Tag-sichere Provider-Schicht gehängt, inklusive UI-Feldern für Keys/Modelle und DeepL-Fallback
- 2. April 2026: Lokalen OpenAI-kompatiblen Provider für LM Studio/Ollama ergänzt (Base URL, Modell, optionaler Key)
- 1. April 2026: Phase 1 der Provider-Erweiterung umgesetzt (Provider-Interface, OpenAI-Adapter, UI für Provider- und API-Key-Auswahl)
- 31. März 2026: Plan auf realen Entwicklungsstand aktualisiert, Glossar-System ergänzt, Hyperlink- und Legacy-Fallback-Fortschritt eingetragen
- 31. März 2026: UI/UX-Optimierung und Verlinken als neue Hauptpunkte ergänzt
- 29. März 2026: Checkliste erstellt und als `FEATURE_PLAN.md` abgelegt
