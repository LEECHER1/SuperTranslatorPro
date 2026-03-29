# SuperTranslatorPro Checkliste

> Diese Datei ist deine zentrale Aufgabenliste für die nächsten Features. Du kannst jederzeit Punkte abhaken, Kommentare ergänzen oder neue Aufgaben einfügen.

## Aktueller Status
- **Version:** 28.1
- **Datum:** 29. März 2026
- **Status:** Aktive Entwicklung

---

## Übersicht
- [ ] Rechtschreibprüfung in der Mastersprache
- [ ] Intelligente Copyfitting-Logik
- [ ] Automatische Musterseiten-Generierung (Legacy-Fallback)
- [ ] Andere LLMs (ChatGPT / Gemini / Claude)
- [ ] Migration auf UXP

---

## 1. Rechtschreibprüfung in der Mastersprache
- [ ] UI-Button "Rechtschreibprüfung" im Hauptfenster oder im Einstellungen-Dialog einbauen
- [ ] Deutsche Masterseiten (`-de` Master) finden
- [ ] Alle TextFrames / Stories auf diesen Seiten mit InDesign `spellingErrors` prüfen
- [ ] Ergebnis anzeigen: Fehleranzahl + erste Fehlerstelle oder Hinweis
- [ ] Optional: Sprung zum ersten Fehler anbieten

**Notizen:**
- 

---

## 2. Intelligente Copyfitting-Logik
- [ ] Neue Helper-Funktion `applySmartCopyfit(textFrame)` erstellen
- [ ] Priorität 1: Tracking (Laufweite) schrittweise bis -10 reduzieren
- [ ] Priorität 2: Horizontal Scale (Zeichenbreite) schrittweise bis 98% reduzieren
- [ ] Priorität 3: Rahmenvergrößerung nur als letzter Fallback anwenden
- [ ] Overflow-Fix innerhalb von `executeTranslation` ersetzen

**Notizen:**
- 

---

## 3. Automatische Musterseiten-Generierung (Legacy-Fallback)
- [ ] In `runBDAMode` prüfen, ob zielsprachige Masterseiten fehlen
- [ ] Deutsche `-de` Masterseite identifizieren
- [ ] UI-Dialog implementieren: nach benötigten Zielsprachen fragen
- [ ] Deutsche Masterseite für jede gewählte Sprache duplizieren
- [ ] Neue Masters korrekt umbenennen (`-en`, `-fr`, etc.)
- [ ] Danach normalen BDA-Automatikfluss fortsetzen

**Notizen:**
- 

---

## 4. Andere LLMs (ChatGPT / Gemini / Claude)
- [ ] Provider-Interface für Übersetzungen definieren
- [ ] DeepL als Default behalten
- [ ] Adapter für andere Anbieter vorbereiten (OpenAI, Google, Anthropic)
- [ ] UI für Provider-Auswahl und API-Key-Felder hinzufügen

**Notizen:**
- 

---

## 5. Migration auf UXP
- [ ] Kernlogik / UI klar trennen
- [ ] UXP-Plugin-Struktur planen (`manifest.json`, HTML/CSS/JS)
- [ ] UXP-UI-Portierung vorbereiten

**Notizen:**
- 

---

## Prioritäten
1. Rechtschreibprüfung
2. Intelligente Copyfitting-Logik
3. Automatische Musterseiten-Generierung
4. Andere LLMs
5. UXP-Migration

---

## Offene ToDo-Punkte
- [ ] Rechtschreibprüfung UI + Master-Scan bauen
- [ ] Helper für `spellingErrors` implementieren
- [ ] `applySmartCopyfit(textFrame)` mit Tracking/Scale/Frame bauen
- [ ] Overflow-Fix in `executeTranslation` ersetzen
- [ ] `runBDAMode` Legacy-Fallback für fehlende Masters einbauen
- [ ] Provider-Abstraktion für andere LLMs definieren
- [ ] UXP-Refactoring-Plan erstellen

---

## Änderungslog
- 29. März 2026: Checkliste erstellt und als `FEATURE_PLAN.md` abgelegt
- 

