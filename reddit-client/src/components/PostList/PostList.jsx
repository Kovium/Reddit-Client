import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../features/posts/postsSlice";

import PostCard from "../PostCard/PostCard";
import "./PostList.css";



function PostList() {
    const dispatch = useDispatch();

    const posts = useSelector((state) => state.posts.posts);
    const status = useSelector((state) => state.posts.status);
    const error = useSelector((state) => state.posts.error);
    const after = useSelector((state) => state.posts.after);
    const before = useSelector((state) => state.posts.before);

    const activeFilter = useSelector((state) => state.filters.activeFilter);
    const searchTerm = useSelector((state) => state.search.term);

    useEffect(() =>{
        dispatch(fetchPosts({ filter: activeFilter, searchTerm}));
    }, [dispatch, activeFilter, searchTerm]);

    if(status === "loading") return <p>Lade Posts...</p>;
    
    if(status === "failed") {
        return (
        <div className="error-state">
            <p>❌ Fehler beim Laden der Posts</p>
            <p>{error}</p>
        <button onClick={() => dispatch(fetchPosts({ filter: activeFilter, searchTerm }))}>
        🔄 Erneut versuchen
        </button>
    </div>
  );
}

    return  (
        <div className="post-list-container">

  {/* -------- Pagination Buttons oben -------- */}
  <div className="pagination-top">
    {before && (
      <button onClick={() => dispatch(fetchPosts({ filter: activeFilter, searchTerm, before, after: null }))}>
        ⬅️ Prev
      </button>
    )}
    {after && (
      <button onClick={() => dispatch(fetchPosts({ filter: activeFilter, searchTerm, after, before: null }))}>
        Next ➡️
      </button>
    )}
  </div>

  {/* -------- Liste der Posts -------- */}
   <section className="post-list">
            {posts.map((post) => (
                <PostCard 
                key={post.id} {...post}
                />
            ))}
        </section>

  {/* -------- Pagination Buttons unten -------- */}
  <div className="pagination-bottom">
    {before && (
      <button onClick={() => dispatch(fetchPosts({ filter: activeFilter, searchTerm, before, after: null }))}>
        ⬅️ Prev
      </button>
    )}
    {after && (
      <button onClick={() => dispatch(fetchPosts({ filter: activeFilter, searchTerm, after, before: null }))}>
        Next ➡️
      </button>
    )}
  </div>

</div>
)}

export default PostList;