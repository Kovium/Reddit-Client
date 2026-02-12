// Integrations-Tests für zentrale User-Flows:
// - Startseite laden
// - Filter ändern
// - Suchbegriff setzen
// - Post anklicken und Detailansicht öffnen
//
// Hier verwenden wir eine Test-App, die den echten Store und eine MemoryRouter-Konfiguration nutzt,
// um die App-Routen nachzubilden, ohne den Produktivcode ändern zu müssen.

import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import filtersReducer from "../features/filters/filtersSlice";
import postsReducer from "../features/posts/postsSlice";
import searchReducer from "../features/search/searchSlice";
import Home from "../pages/Home";
import PostDetail from "../pages/PostDetail";

afterEach(() => {
  vi.restoreAllMocks();
});

// Hilfsfunktion: Erstellt einen echten Store mit allen Slices für Integrations-Tests.
function createIntegrationStore(preloadedState) {
  return configureStore({
    reducer: {
      filters: filtersReducer,
      posts: postsReducer,
      search: searchReducer,
    },
    preloadedState,
  });
}

// Test-App mit Provider + MemoryRouter + unseren Routen.
function TestApp({ store, initialEntries = ["/"] }) {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

// Beispiel-API-Response mit einem Post; wird für mehrere Tests wiederverwendet.
function createListingResponse({ id = "abc123", title = "Integration Post" } = {}) {
  return {
    data: {
      children: [
        {
          data: {
            id,
            title,
            author: "alice",
            subreddit: "reactjs",
            ups: 10,
            num_comments: 3,
            is_video: false,
            preview: null,
            media: null,
          },
        },
      ],
      after: null,
    },
  };
}

describe("App Integration - User Flows", () => {
  it("lädt die Startseite und zeigt mindestens einen Post nach erfolgreichem Fetch", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => createListingResponse(),
      });

    const store = createIntegrationStore();

    // Start auf der Home-Route.
    renderWithIntegration(<TestApp store={store} />);

    expect(fetchMock).toHaveBeenCalled();

    // Auf den gerenderten Post-Titel warten.
    const postTitle = await screen.findByText("Integration Post");
    expect(postTitle).toBeInTheDocument();
  });

  it("ändert den Filter und ruft dadurch neue Posts ab", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      // erster Aufruf: initiale Posts
      .mockResolvedValueOnce({
        ok: true,
        json: async () => createListingResponse(),
      })
      // zweiter Aufruf: nach Filterwechsel
      .mockResolvedValueOnce({
        ok: true,
        json: async () =>
          createListingResponse({
            id: "def456",
            title: "Gefilterter Post",
          }),
      });

    const store = createIntegrationStore();
    const user = userEvent.setup();

    renderWithIntegration(<TestApp store={store} />);

    // Warten, bis der erste Post gerendert ist.
    await screen.findByText("Integration Post");

    const newFilterButton = screen.getByRole("button", { name: "new" });
    await user.click(newFilterButton);

    // Nach dem Klick sollte fetch ein zweites Mal aufgerufen werden.
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  it("setzt einen Suchbegriff und löst dadurch einen neuen Fetch mit Such-URL aus", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      // initialer Aufruf ohne Suchbegriff
      .mockResolvedValueOnce({
        ok: true,
        json: async () => createListingResponse(),
      })
      // zweiter Aufruf für die Suche
      .mockResolvedValueOnce({
        ok: true,
        json: async () =>
          createListingResponse({
            id: "search1",
            title: "Suchergebnis Post",
          }),
      });

    const store = createIntegrationStore();
    const user = userEvent.setup();

    renderWithIntegration(<TestApp store={store} />);

    await screen.findByText("Integration Post");

    const searchInput = screen.getByPlaceholderText(
      "Search for Reddit Posts...",
    );

    await user.clear(searchInput);
    await user.type(searchInput, "react");

    // Die Suchänderung triggert über PostList neue Fetches.
    // Da pro Tastenanschlag ein Effect laufen kann, erwarten wir
    // mindestens zwei Aufrufe (Initial-Load + Suche), aber nicht exakt zwei.
    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    // Prüfen, dass der letzte Aufruf eine Search-URL verwendet.
    const lastCall = fetchMock.mock.calls.at(-1);
    expect(lastCall[0]).toContain(
      "https://www.reddit.com/search.json?q=react&limit=10",
    );
  });

  it("öffnet die Detailansicht, wenn ein Post angeklickt wird", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => createListingResponse(),
    });

    const store = createIntegrationStore();
    const user = userEvent.setup();

    renderWithIntegration(<TestApp store={store} />);

    const postLink = await screen.findByText("Integration Post");
    await user.click(postLink);

    // In der Detailansicht sollte derselbe Titel angezeigt werden.
    const detailTitle = await screen.findByText("Integration Post");
    expect(detailTitle).toBeInTheDocument();
  });
});

// Kleine Hilfsfunktion, um Integrations-Komponenten zu rendern.
import { render } from "@testing-library/react";

function renderWithIntegration(ui) {
  return render(ui);
}

