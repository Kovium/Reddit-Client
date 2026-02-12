// Tests für die PostCard-Komponente.
// Ziel: Sicherstellen, dass die Post-Daten korrekt angezeigt werden und die Medien-Priorität (Video vor Bild) eingehalten wird.

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostCard from "./PostCard";

// Hilfsfunktion: Rendert PostCard innerhalb eines MemoryRouters,
// damit der Link (/post/:id) ohne echten Browser funktioniert.
function renderPostCard(props) {
  return render(
    <MemoryRouter>
      <PostCard {...props} />
    </MemoryRouter>,
  );
}

const basePostProps = {
  id: "abc123",
  title: "Ein Test-Post",
  author: "testuser",
  subreddit: "reactjs",
  upvotes: 42,
  comments: 7,
};

describe("PostCard", () => {
  it("zeigt die Basisinformationen des Posts an", () => {
    renderPostCard({
      ...basePostProps,
      image: null,
      video: null,
    });

    expect(screen.getByText("Ein Test-Post")).toBeInTheDocument();
    expect(screen.getByText(/Posted by/i)).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("r/reactjs")).toBeInTheDocument();
    expect(screen.getByText(/⬆️ 42/)).toBeInTheDocument();
    expect(screen.getByText(/💬 7/)).toBeInTheDocument();
  });

  it("verlinkt auf die Detailseite mit der korrekten ID", () => {
    renderPostCard({
      ...basePostProps,
      image: null,
      video: null,
    });

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/post/abc123");
  });

  it("zeigt ein Video, wenn video gesetzt ist", () => {
    renderPostCard({
      ...basePostProps,
      video: "https://example.com/video.mp4",
      image: "https://example.com/image.jpg",
    });

    // Es sollte ein Video-Element gerendert werden.
    const videoElement = document.querySelector("video");
    expect(videoElement).not.toBeNull();
  });

  it("zeigt ein Bild, wenn kein Video, aber ein Bild vorhanden ist", () => {
    renderPostCard({
      ...basePostProps,
      video: null,
      image: "https://example.com/image.jpg",
    });

    const imageElement = screen.getByRole("img", { name: "Ein Test-Post" });
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("zeigt weder Bild noch Video, wenn beides fehlt", () => {
    renderPostCard({
      ...basePostProps,
      video: null,
      image: null,
    });

    expect(document.querySelector("video")).toBeNull();
    expect(document.querySelector("img")).toBeNull();
  });
});

