import PostCard from "../PostCard/PostCard";
import "./PostList.css";

function PostList({ posts }) {
    if(!posts || posts.length === 0){
        return <p className="postlist-empty">No posts available.</p>
    }

    return  (
        <section className="post-list">
            {posts.map((post) => (
                <PostCard 
                key={post.id}
                title={post.title}
                author={post.author}
                subreddit={post.subreddit}
                upvotes={post.upvotes}
                comments={post.comments}
                />
            ))}
        </section>
    )
}
export default PostList;