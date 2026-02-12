// Tests für die Home-Seite.
// Ziel: Sicherstellen, dass die Startseite die erwarteten Kernkomponenten rendert.

import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import Home from "./Home";
import { renderWithProviders } from "../test-utils/renderWithProviders";

// Wir mocken fetch, um unerwartete Netzwerkzugriffe durch PostList zu vermeiden.
afterEach(() => {
  vi.restoreAllMocks();
});

describe("Home", () => {
  it("rendert Header, SearchBar, FilterBar und PostList", () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          children: [],
          after: null,
        },
      }),
    });

    renderWithProviders(<Home />);

    // Header
    expect(
      screen.getByRole("heading", { name: "Reddit Client" }),
    ).toBeInTheDocument();

    // SearchBar (Input anhand des Platzhalters)
    expect(
      screen.getByPlaceholderText("Search for Reddit Posts..."),
    ).toBeInTheDocument();

    // FilterBar (Buttons)
    expect(screen.getByRole("button", { name: "hot" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "new" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "top" })).toBeInTheDocument();
  });
});

