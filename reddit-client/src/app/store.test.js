// Tests für den zentralen Redux-Store.
// Ziel: Sicherstellen, dass alle Slices korrekt registriert sind und Actions den State beeinflussen.

import { describe, it, expect } from "vitest";
import { store } from "./store";
import { setFilter } from "../features/filters/filtersSlice";
import { setSearchTerm } from "../features/search/searchSlice";
import { fetchPosts } from "../features/posts/postsSlice";

describe("Redux-Store Konfiguration", () => {
  it("enthält die erwarteten Slice-Keys", () => {
    const state = store.getState();

    // Erwartete State-Struktur
    expect(state).toHaveProperty("filters");
    expect(state).toHaveProperty("posts");
    expect(state).toHaveProperty("search");
  });

  it("reagiert auf Actions aus den registrierten Slices", () => {
    store.dispatch(setFilter("new"));
    store.dispatch(setSearchTerm("react"));

    const state = store.getState();

    expect(state.filters.activeFilter).toBe("new");
    expect(state.search.term).toBe("react");
  });

  it("akzeptiert Thunk-Actions wie fetchPosts, ohne Fehler zu werfen", async () => {
    // Wir prüfen hier nur, dass die Thunk-Action grundsätzlich dispatchbar ist.
    // Die Detail-Logik des Thunks wird im postsSlice-Test bereits ausführlich abgedeckt.
    const action = fetchPosts({ filter: "hot", searchTerm: "", after: null });

    await store.dispatch(action);

    const state = store.getState();
    expect(state.posts).toBeDefined();
  });
});

