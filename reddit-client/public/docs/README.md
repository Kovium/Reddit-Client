# Reddit Client

[![CI Pipeline](https://github.com/Kovium/Reddit-Client/actions/workflows/ci.yml/badge.svg)](https://github.com/DEIN_USERNAME/Reddit-Client/actions)

## Beschreibung
Eine React-Anwendung, die Posts von Reddit anzeigt.  
Nutzer können nach Begriffen suchen, Posts filtern und Details einsehen.

## Wireframes
Die Wireframes befinden sich im Ordner `/docs/wireframes/`.

## Technologien
- React (Vite)
- Redux Toolkit
- CSS
- Unit Tests: Jest + React Testing Library  
- End-to-End Tests: Selenium

## Features
- Ansicht von Reddit-Posts
- Suchfunktion
- Filterfunktion (hot, new, top)
- Detailansicht für einzelne Posts
- Responsives Design (Desktop & Mobile)
- Fehler-Handling für API & leere Daten

## State Management (Redux)
Die Anwendung nutzt Redux für globales State Management.

### Globaler State umfasst:
- **posts**
  - Liste der Reddit-Posts
  - Ladezustand (`loading`, `success`, `error`)
  - Fehlermeldungen
- **search**
  - Aktueller Suchbegriff aus der SearchBar
- **filters**
  - Aktiver Filter (`hot`, `new`, `top`)

### Begründung:
Diese Daten werden von mehreren Komponenten genutzt und beeinflussen das Verhalten der gesamten Anwendung.  
Lokaler State wäre hier unübersichtlich und schwer wartbar.

## Future Work
- API-Anbindung an Reddit
- Redux für Posts implementieren
- Routing zur Detailseite
- Animationen & Übergänge
- Lighthouse-Optimierung

## Testing
- Unit Tests: Jest + React Testing Library
- End-to-End Tests: Selenium

## 🧪 End-to-End Testing (E2E)

Wir nutzen **Selenium WebDriver** für automatisierte E2E-Tests.

### Voraussetzungen:
- Lokaler Dev-Server muss laufen (`npm run dev`)
- Browser (z. B. Chrome) muss installiert sein

### Tests ausführen:

```bash
npm run e2e         # Testet Home-Seite
npm run e2e:detail  # Testet Post-Detail-Navigation
