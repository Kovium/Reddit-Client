// Tests für die Header-Komponente.
// Ziel: Sicherstellen, dass der sichtbare Anwendungstitel korrekt angezeigt wird.

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("zeigt den Anwendungstitel 'Reddit Client' an", () => {
    render(<Header />);

    const titleElement = screen.getByRole("heading", { name: "Reddit Client" });
    expect(titleElement).toBeInTheDocument();
  });
});

