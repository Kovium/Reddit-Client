// Tests für die FilterBar-Komponente.
// Ziel: Sicherstellen, dass alle Filter-Buttons gerendert werden, der aktive Filter hervorgehoben ist
// und Button-Klicks den aktiven Filter im Redux-State ändern.

import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import FilterBar from "./FilterBar";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

describe("FilterBar", () => {
  it("rendert alle Filter-Buttons und markiert den aktiven Filter", () => {
    const preloadedState = {
      filters: {
        activeFilter: "new",
      },
    };

    renderWithProviders(<FilterBar />, { preloadedState });

    // Erwartete Buttons
    const hotButton = screen.getByRole("button", { name: "hot" });
    const newButton = screen.getByRole("button", { name: "new" });
    const topButton = screen.getByRole("button", { name: "top" });

    expect(hotButton).toBeInTheDocument();
    expect(newButton).toBeInTheDocument();
    expect(topButton).toBeInTheDocument();

    // Der aktuelle Filter "new" sollte die CSS-Klasse "active" haben
    expect(newButton.className).toContain("active");
  });

  it("ändert den aktiven Filter im Redux-State, wenn ein Button geklickt wird", async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<FilterBar />, {
      preloadedState: {
        filters: {
          activeFilter: "hot",
        },
      },
    });

    const newButton = screen.getByRole("button", { name: "new" });

    await user.click(newButton);

    const state = store.getState();
    expect(state.filters.activeFilter).toBe("new");
  });
});

