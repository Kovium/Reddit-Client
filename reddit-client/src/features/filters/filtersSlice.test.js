// Tests für den filtersSlice.
// Ziel: Sicherstellen, dass der aktive Filter korrekt im Redux-State gehalten wird.

import { describe, it, expect } from "vitest";
import filtersReducer, { setFilter } from "./filtersSlice";

describe("filtersSlice", () => {
  it("liefert den erwarteten Initialzustand", () => {
    const initialState = undefined;
    const action = { type: "@@INIT" };

    const state = filtersReducer(initialState, action);

    expect(state).toEqual({ activeFilter: "hot" });
  });

  it("setzt den aktiven Filter mit setFilter", () => {
    const initialState = { activeFilter: "hot" };

    const state = filtersReducer(initialState, setFilter("new"));

    expect(state.activeFilter).toBe("new");
  });
});

