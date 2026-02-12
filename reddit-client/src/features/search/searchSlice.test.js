// Tests für den searchSlice.
// Ziel: Sicherstellen, dass der Suchbegriff im Redux-State korrekt verwaltet wird.

import { describe, it, expect } from "vitest";
import searchReducer, { setSearchTerm } from "./searchSlice";

describe("searchSlice", () => {
  it("liefert den erwarteten Initialzustand", () => {
    const initialState = undefined;
    const action = { type: "@@INIT" };

    const state = searchReducer(initialState, action);

    expect(state).toEqual({ term: "" });
  });

  it("setzt den Suchbegriff mit setSearchTerm", () => {
    const initialState = { term: "" };

    const state = searchReducer(initialState, setSearchTerm("react"));

    expect(state.term).toBe("react");
  });
});

