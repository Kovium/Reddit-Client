import { useState } from "react";
import "./SearchBar.css";

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");

    function handleSubmit(event) {
        event.prevenDefault();
        console.log("Search term:", searchTerm);
    }

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="SearchReddit Posts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>

        </form>
    )
}
export default SearchBar;