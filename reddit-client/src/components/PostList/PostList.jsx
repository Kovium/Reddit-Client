import PostCard from "../PostCard/PostCard";
import "./PostList.css";
import { useSelector } from "react-redux";

function PostList() {

    const posts = useSelector((state) => state.posts.posts);

    const activeFilter = useSelector((state) => state.filters.activeFilter);

    const searchTerm = useSelector((state) => state.search.term);

    const filteredPosts = posts.filter((post) => post.filterType === activeFilter).filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()));  //Firstly Filter the activeFilter state, then checking the posttext appears in the searchterm 

    if(filteredPosts.length === 0){
        return <p className="postlist-empty">No posts available.</p>
    }

    return  (
        <section className="post-list">
            {filteredPosts.map((post) => (
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