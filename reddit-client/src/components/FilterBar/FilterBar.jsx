import "./FilterBar.css";
import { useState } from "react";

const FILTERS = ["hot", "new", "top"]; //Defining a list of Filtervalues as array pattern

function FilterBar() {
    const [activeFilter, setActiveFilter] = useState("hot");  //actual-state is "hot"

    return (
        <div className="filter-bar">
            {FILTERS.map((filter) => (      //Creating buttons for each array element => 3 Buttons
                <button
                    key={filter}            //react needs key attribut to find the right listelement
                    className={filter === activeFilter? "active" : ""}      //active-filter gets an specified CSS-Class
                    onClick={() => setActiveFilter(filter)}                 // By clicking => changing the actual filter
                >
                    {filter}    {/* Text for each Button of the FILTER-Array  */}
                </button>
            ))}
        </div>
    )
}
export default FilterBar;