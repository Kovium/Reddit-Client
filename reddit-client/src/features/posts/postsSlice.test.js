// Tests für den postsSlice inklusive des asynchronen Thunks fetchPosts.
// Ziel: Sicherstellen, dass API-Aufrufe, Daten-Mapping und Status-Übergänge korrekt funktionieren.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import postsReducer, { fetchPosts } from "./postsSlice";

// Hilfsfunktion: Erstellt einen isolierten Store nur mit dem posts-Reducer.
function createPostsTestStore(preloadedState) {
  return configureStore({
    reducer: {
      posts: postsReducer,
    },
    preloadedState,
  });
}

describe("postsSlice - fetchPosts Thunk", () => {
  // Nach jedem Test werden alle Mocks zurückgesetzt,
  // damit Tests unabhängig voneinander bleiben.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("baut die richtige URL ohne searchTerm und ohne after", async () => {
    const fakeResponse = {
      data: {
        children: [],
        after: null,
      },
    };

    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeResponse,
      });

    const store = createPostsTestStore();

    await store.dispatch(
      fetchPosts({ filter: "r/reactjs", searchTerm: "", after: null }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://www.reddit.com/r/reactjs.json?limit=10",
    );
  });

  it("baut die richtige URL mit searchTerm", async () => {
    const fakeResponse = {
      data: {
        children: [],
        after: null,
      },
    };

    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeResponse,
      });

    const store = createPostsTestStore();

    await store.dispatch(
      fetchPosts({ filter: "hot", searchTerm: "react", after: null }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://www.reddit.com/search.json?q=react&limit=10",
    );
  });

  it("hängt den after-Parameter an die URL an, wenn vorhanden", async () => {
    const fakeResponse = {
      data: {
        children: [],
        after: "t3_123",
      },
    };

    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fakeResponse,
      });

    const store = createPostsTestStore();

    await store.dispatch(
      fetchPosts({
        filter: "hot",
        searchTerm: "",
        after: "t3_123",
      }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://www.reddit.com/hot.json?limit=10&after=t3_123",
    );
  });

  it("mappt die API-Response korrekt auf das interne Post-Format", async () => {
    // Hier simulieren wir eine Reddit-Response mit Bild- und Videodaten,
    // um sicherzustellen, dass die Mapping-Logik funktioniert.
    const fakeResponse = {
      data: {
        children: [
          {
            data: {
              id: "abc123",
              title: "Ein Test-Post",
              author: "testuser",
              subreddit: "reactjs",
              ups: 42,
              num_comments: 7,
              preview: {
                images: [
                  {
                    source: {
                      url: "https://example.com/image&amp;test.jpg",
                    },
                  },
                ],
              },
              is_video: true,
              media: {
                reddit_video: {
                  fallback_url: "https://example.com/video.mp4",
                },
              },
            },
          },
        ],
        after: "t3_after",
      },
    };

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const store = createPostsTestStore();

    await store.dispatch(
      fetchPosts({ filter: "hot", searchTerm: "", after: null }),
    );

    const state = store.getState().posts;

    expect(state.status).toBe("succeeded");
    expect(state.after).toBe("t3_after");
    expect(state.posts).toHaveLength(1);

    const post = state.posts[0];

    // Prüfen, ob alle relevanten Felder korrekt übernommen wurden.
    expect(post).toEqual({
      id: "abc123",
      title: "Ein Test-Post",
      author: "testuser",
      subreddit: "reactjs",
      upvotes: 42,
      comments: 7,
      // &amp; wurde in ein einfaches & umgewandelt
      image: "https://example.com/image&test.jpg",
      video: "https://example.com/video.mp4",
    });
  });

  it("setzt Status auf failed und speichert die Fehlermeldung, wenn die API nicht ok ist", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
    });

    const store = createPostsTestStore();

    await store.dispatch(
      fetchPosts({ filter: "hot", searchTerm: "", after: null }),
    );

    const state = store.getState().posts;

    expect(state.status).toBe("failed");
    expect(state.error).toBe("Fehler beim Laden der Posts");
  });
});

describe("postsSlice - initialer State", () => {
  it("hat den erwarteten Initialzustand", () => {
    const store = createPostsTestStore();
    const state = store.getState().posts;

    expect(state).toEqual({
      posts: [],
      status: "idle",
      error: null,
      after: null,
    });
  });
});

