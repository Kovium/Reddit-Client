import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../features/posts/postsSlice";

import PostCard from "../PostCard/PostCard";
import "./PostList.css";

function PostList() {
  const dispatch = useDispatch();
  const { posts, status, error, after } = useSelector((state) => state.posts);
  const { activeFilter } = useSelector((state) => state.filters);
  const searchTerm = useSelector((state) => state.search.term);

  // initial laden
  useEffect(() => {
    dispatch(fetchPosts({ filter: activeFilter, searchTerm }));
  }, [dispatch, activeFilter, searchTerm]);

  const handleNext = () => {
    if (after) {
      dispatch(fetchPosts({ filter: activeFilter, searchTerm, after }));
    }
  };

  if (status === "loading") return <p>Lade Posts...</p>;

  if (status === "failed") {
    return (
      <div className="error-state">
        <p>❌ Fehler beim Laden der Posts</p>
        <p>{error}</p>
        <button
          onClick={() =>
            dispatch(fetchPosts({ filter: activeFilter, searchTerm }))
          }
        >
          🔄 Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      {/* -------- Next Button oben -------- */}
      {after && (
        <button className="next-button" onClick={handleNext}>
          Next ➡️
        </button>
      )}

      <section className="post-list">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </section>

      {/* -------- Next Button unten -------- */}
      {after && (
        <button className="next-button" onClick={handleNext}>
          Next ➡️
        </button>
      )}
    </div>
  );
}

export default PostList;
