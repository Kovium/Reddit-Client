import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./PostDetail.css";

function PostDetail() {
  const { id } = useParams();
  const post = useSelector((state) =>
    state.posts.posts.find((p) => p.id === id),
  );

  if (!post) return <p>Post nicht gefunden...</p>;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p>
        Posted by <strong>{post.author}</strong> in{" "}
        <strong>{post.subreddit}</strong>
      </p>
      <div className="post-stats">
        <span>⬆️ {post.upvotes}</span>
        <span>💬 {post.comments}</span>
      </div>
      {post.image && <img src={post.image} alt={post.title} />}
      {post.video && (
        <video controls>
          <source src={post.video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
export default PostDetail;
