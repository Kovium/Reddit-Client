// Tests für die SearchBar-Komponente.
// Ziel: Sicherstellen, dass der aktuelle Suchbegriff angezeigt wird und Änderungen im Input den Redux-State aktualisieren.

import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import SearchBar from "./SearchBar";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

describe("SearchBar", () => {
  it("zeigt den Suchbegriff aus dem Redux-State an", () => {
    const preloadedState = {
      search: {
        term: "initialer Suchtext",
      },
    };

    renderWithProviders(<SearchBar />, { preloadedState });

    const input = screen.getByPlaceholderText("Search for Reddit Posts...");

    expect(input.value).toBe("initialer Suchtext");
  });

  it("dispatcht setSearchTerm, wenn der Nutzer Text eingibt", async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<SearchBar />, {
      preloadedState: {
        search: { term: "" },
      },
    });

    const input = screen.getByPlaceholderText("Search for Reddit Posts...");

    await user.type(input, "react");

    const state = store.getState();
    expect(state.search.term).toBe("react");
  });
});

