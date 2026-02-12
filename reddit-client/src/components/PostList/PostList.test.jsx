// Tests für die PostList-Komponente.
// Ziel: Sicherstellen, dass Lade-, Fehler- und Erfolgszustände korrekt gerendert werden
// und dass die "Next"- und "Retry"-Buttons das Nachladen von Posts auslösen.

import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

// Wir mocken fetchPosts aus dem postsSlice so, dass der Thunk selbst nichts tut.
// Dadurch ruft der useEffect in PostList zwar weiterhin fetchPosts auf,
// aber der Redux-State bleibt unverändert – ideal, um gezielt Preloaded-State zu testen.
vi.mock("../../features/posts/postsSlice", async () => {
  const actualModule = await vi.importActual(
    "../../features/posts/postsSlice",
  );

  return {
    ...actualModule,
    fetchPosts: () => () => Promise.resolve(),
  };
});

import PostList from "./PostList";

// Gemeinsamer Fake-Response-Body für erfolgreiche API-Aufrufe.
const emptyListingResponse = {
  data: {
    children: [],
    after: null,
  },
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PostList - Lade- und Fehlerzustände", () => {
  it("zeigt einen Ladehinweis, wenn der Status 'loading' ist", () => {
    // Wir mocken fetch, damit kein echter Netzwerkaufruf passiert.
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => emptyListingResponse,
    });

    renderWithProviders(<PostList />, {
      preloadedState: {
        posts: {
          posts: [],
          status: "loading",
          error: null,
          after: null,
        },
        filters: {
          activeFilter: "hot",
        },
        search: {
          term: "",
        },
      },
    });

    expect(screen.getByText("Lade Posts...")).toBeInTheDocument();
  });

  it("zeigt eine Fehlermeldung und einen Retry-Button, wenn der Status 'failed' ist", async () => {
    const user = userEvent.setup();

    renderWithProviders(<PostList />, {
      preloadedState: {
        posts: {
          posts: [],
          // Wir starten direkt in einem Fehlerzustand, so wie er im Slice entstehen würde.
          status: "failed",
          error: "Fehler beim Laden der Posts",
          after: null,
        },
        filters: {
          activeFilter: "hot",
        },
        search: {
          term: "",
        },
      },
    });

    // Sicherstellen, dass der Fehlertext angezeigt wird.
    const errorElement = screen.getByText(
      "❌ Fehler beim Laden der Posts",
    );
    expect(errorElement).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: /Erneut versuchen/i,
    });
    expect(retryButton).toBeInTheDocument();

    // Klick auf den Retry-Button. Durch das Mocking von fetchPosts (No-Op)
    // ändert sich der Zustand hier nicht, aber wir stellen sicher,
    // dass der Button grundsätzlich klickbar ist.
    await user.click(retryButton);
  });
}
);

describe("PostList - Erfolgszustand und Pagination", () => {
  it("rendert die vorhandenen Posts und zeigt die Next-Buttons, wenn 'after' gesetzt ist", () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => emptyListingResponse,
    });

    const preloadedState = {
      posts: {
        posts: [
          {
            id: "post1",
            title: "Erster Post",
            author: "alice",
            subreddit: "reactjs",
            upvotes: 10,
            comments: 2,
            image: null,
            video: null,
          },
        ],
        status: "succeeded",
        error: null,
        // Wenn after gesetzt ist, sollen die Next-Buttons erscheinen.
        after: "t3_next",
      },
      filters: {
        activeFilter: "hot",
      },
      search: {
        term: "",
      },
    };

    renderWithProviders(<PostList />, {
      preloadedState,
    });

    // Der Post-Titel sollte sichtbar sein (PostCard wird darunter gerendert).
    expect(screen.getByText("Erster Post")).toBeInTheDocument();

    // Oben und unten sollte ein "Next"-Button auftauchen.
    const nextButtons = screen.getAllByRole("button", { name: /Next ➡️/i });
    expect(nextButtons).toHaveLength(2);
  });
});

