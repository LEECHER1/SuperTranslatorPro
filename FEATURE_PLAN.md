# SuperTranslatorPro Checkliste

> Diese Datei ist die zentrale Aufgabenliste für die nächsten Features. Punkte können jederzeit abgehakt, ergänzt oder verschoben werden.

## Aktueller Status
- **Version:** 28.2
- **Datum:** 31. März 2026
- **Status:** Aktive Entwicklung

---

## Übersicht
- [x] Rechtschreibprüfung in der Mastersprache
- [ ] Intelligente Copyfitting-Logik
- [ ] Automatische Musterseiten-Generierung (Legacy-Fallback)
- [ ] Andere LLMs (ChatGPT / Gemini / Claude)
- [ ] Migration auf UXP
- [ ] UI/UX Optimierung
- [ ] Verlinken (Linking Features)

---

## 1. Rechtschreibprüfung in der Mastersprache
- [x] UI-Button "Rechtschreibprüfung" im Hauptfenster oder im Einstellungen-Dialog einbauen
- [x] Deutsche Masterseiten (`-de` Master) finden
- [x] Alle TextFrames / Stories auf diesen Seiten mit InDesign `spellingErrors` prüfen
- [x] Ergebnis anzeigen: Fehleranzahl + erste Fehlerstelle oder Hinweis
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

## 6. UI/UX Optimierung
- [ ] Dynamische Anpassung der Skript-Sprache an `app.locale` (DE/EN)

**Notizen:**
- 

---

## 7. Verlinken (Linking Features)
- [x] System für Referenz-Symbole in Einstellungen integriert (Standard `[]`)
- [x] Button "Hyperlinks Einstellungen" im Manuellen Modus implementiert
- [ ] Zukunft: Automatische Erkennung und Verlinkung von Web-URLs
- [ ] Zukunft: Querverweise für Seitenzahlen automatisieren

**Notizen:**
- Basis für weitere Linking-Features wie Cross-References, URL-Erkennung und Paket-Referenzen

---

## Prioritäten
1. UI/UX Optimierung
2. Verlinken (Linking Features)
3. Intelligente Copyfitting-Logik
4. Automatische Musterseiten-Generierung
5. Andere LLMs
6. Migration auf UXP

---

## Offene ToDo-Punkte
- [ ] Dynamische DE/EN-Lokalisierung in allen UI-Dialogen finalisieren und testen
- [ ] `applySmartCopyfit(textFrame)` mit Tracking/Scale/Frame bauen
- [ ] Overflow-Fix in `executeTranslation` ersetzen
- [ ] `runBDAMode` Legacy-Fallback für fehlende Masters produktiv absichern
- [ ] Provider-Abstraktion für andere LLMs definieren
- [ ] Automatische Erkennung und Verlinkung von Web-URLs ergänzen
- [ ] Seitenzahlen-Querverweise automatisieren
- [ ] UXP-Refactoring-Plan erstellen

---

## Änderungslog
- 31. März 2026: UI/UX-Optimierung und Verlinken als neue Hauptpunkte ergänzt
- 29. März 2026: Checkliste erstellt und als `FEATURE_PLAN.md` abgelegt
