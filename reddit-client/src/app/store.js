import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/filters/filtersSlice";
import postsReducer from "../features/posts/postsSlice";
import searchReducer from "../features/search/searchSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    posts: postsReducer,
    search: searchReducer,
  },
});
