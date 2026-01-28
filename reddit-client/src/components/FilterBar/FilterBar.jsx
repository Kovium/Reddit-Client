import "./FilterBar.css";

import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "../../features/filters/filtersSlice";


function FilterBar() {

const dispatch = useDispatch();

    // Redux State auslesen
const activeFilter = useSelector((state) => state.filters.activeFilter);

const FILTERS = ["hot", "new", "top"];      //Defining a list of Filtervalues as array pattern

    return (
        <div className="filter-bar">
            {FILTERS.map((filter) => (      //Creating buttons for each array element => 3 Buttons
                <button
                    key={filter}            //react needs key attribut to find the right listelement
                    className={filter === activeFilter? "active" : ""}      //active-filter gets an specified CSS-Class
                    onClick={() => dispatch(setFilter(filter))}                 // By clicking => changing the actual filter
                >
                    {filter}    {/* Text for each Button of the FILTER-Array  */}
                </button>
            ))}
        </div>
    )
}
export default FilterBar;