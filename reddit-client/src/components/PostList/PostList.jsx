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

    const activeFilter = useSelector((state) => state.filters.activeFilter);
    const searchTerm = useSelector((state) => state.search.term);

    useEffect(() =>{
        dispatch(fetchPosts({ filter: activeFilter, searchTerm}));
    }, [dispatch, activeFilter, searchTerm]);

    if(status === "loading") return <p>Lade Posts...</p>;
    if(status === "failed") return <p>{error}</p>;

    // if(filteredPosts.length === 0){
    //     return <p className="postlist-empty">No posts available.</p>
    // }

    return  (
        <section className="post-list">
            {posts.map((post) => (
                <PostCard 
                key={post.id} {...post}
                // title={post.title}
                // author={post.author}
                // subreddit={post.subreddit}
                // upvotes={post.upvotes}
                // comments={post.comments}
                />
            ))}
        </section>
    )
}
export default PostList;