// Tests für die PostDetail-Seite.
// Ziel: Sicherstellen, dass Posts anhand der ID gefunden werden und Medien (Video/Bild) korrekt priorisiert angezeigt werden.

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PostDetail from "./PostDetail";
import postsReducer from "../features/posts/postsSlice";

// Hilfsfunktion: Erstellt einen Store nur mit dem posts-Reducer für diesen Test.
function createPostsOnlyStore(preloadedPostsState) {
  return configureStore({
    reducer: {
      posts: postsReducer,
    },
    preloadedState: {
      posts: preloadedPostsState,
    },
  });
}

describe("PostDetail", () => {
  it("zeigt eine Fehlermeldung, wenn kein Post zur ID gefunden wird", () => {
    const store = createPostsOnlyStore({
      posts: [],
      status: "succeeded",
      error: null,
      after: null,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/unknown"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(
      screen.getByText("Post nicht gefunden..."),
    ).toBeInTheDocument();
  });

  it("zeigt die Postdetails an, wenn ein passender Post vorhanden ist", () => {
    const store = createPostsOnlyStore({
      posts: [
        {
          id: "abc123",
          title: "Detail-Post",
          author: "alice",
          subreddit: "reactjs",
          upvotes: 100,
          comments: 50,
          image: "https://example.com/image.jpg",
          video: null,
        },
      ],
      status: "succeeded",
      error: null,
      after: null,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/abc123"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Detail-Post")).toBeInTheDocument();
    expect(screen.getByText(/Posted by/i)).toBeInTheDocument();
    expect(screen.getByText("alice")).toBeInTheDocument();
    expect(screen.getByText("r/reactjs")).toBeInTheDocument();
    expect(screen.getByText(/⬆️ 100/)).toBeInTheDocument();
    expect(screen.getByText(/💬 50/)).toBeInTheDocument();

    // Bei diesem Post sollte ein Bild, aber kein Video angezeigt werden.
    const imageElement = screen.getByRole("img", { name: "Detail-Post" });
    expect(imageElement).toBeInTheDocument();
    expect(document.querySelector("video")).toBeNull();
  });

  it("priorisiert Video vor Bild, wenn beides vorhanden ist", () => {
    const store = createPostsOnlyStore({
      posts: [
        {
          id: "abc123",
          title: "Video-Post",
          author: "alice",
          subreddit: "reactjs",
          upvotes: 10,
          comments: 1,
          image: "https://example.com/image.jpg",
          video: "https://example.com/video.mp4",
        },
      ],
      status: "succeeded",
      error: null,
      after: null,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/post/abc123"]}>
          <Routes>
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const videoElement = document.querySelector("video");
    expect(videoElement).not.toBeNull();
  });
});

