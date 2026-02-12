// Tests für die App-Komponente.
// Ziel: Sicherstellen, dass die Hauptanwendung startet und die Startseite (Home) gerendert wird.

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Wir mocken fetch global, um Netzwerkanfragen aus PostList/Thunks zu vermeiden.
afterEach(() => {
  vi.restoreAllMocks();
});

describe("App", () => {
  it("rendert die Startseite mit dem Header 'Reddit Client'", () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          children: [],
          after: null,
        },
      }),
    });

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Reddit Client" }),
    ).toBeInTheDocument();
  });
});

