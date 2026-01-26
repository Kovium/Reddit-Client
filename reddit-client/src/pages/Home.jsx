import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterBar from "../components/FilterBar/FilterBar";
import PostList from "../components/PostList/PostList";
import { mockPosts} from "../utils/mockPosts.js";


function Home() {
  return (
    <>
      <Header />
      <SearchBar />
      <FilterBar />
      <PostList posts={mockPosts} />
    </>
  );
}

export default Home;
