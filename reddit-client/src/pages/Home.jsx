import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterBar from "../components/FilterBar/FilterBar";
import PostList from "../components/PostList/PostList";


function Home() {
  return (
    <>
      <Header />
      <SearchBar />
      <FilterBar />
      <PostList />
    </>
  );
}

export default Home;
