import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import { mockPosts } from "../../utils/mockPosts";

//----------------------------------------------------creating 3x Async Actions (pending | fulfilled | rejected)--------------//

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ filter, searchTerm, after = null, before = null }) => {
    let url;

    if (searchTerm) {
      url = `https://www.reddit.com/search.json?q=${searchTerm}&limit=10`;
    } else {
      url = `https://www.reddit.com/${filter}.json?limit=10`;
    }

    if (after) url += `&after=${after}`;

    if (before) url += `&before=${before}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Fehler beim Laden der Posts");
    }

    const json = await response.json();

    const listing = json.data;

    return {
      posts: listing.children.map((item) => ({
        id: item.data.id,
        title: item.data.title,
        author: item.data.author,
        subreddit: item.data.subreddit,
        upvotes: item.data.ups,
        comments: item.data.num_comments,
        image: item.data.preview?.images?.[0]?.source?.url
          ? item.data.preview.images[0].source.url.replace(/&amp;/g, "&") //replacing all "&amp" with a single "&" sign. Browser can't read HTML entitys
          : null,
        video: item.data.is_video
          ? item.data.media?.reddit_video?.fallback_url
          : null,
      })),
      after: listing.after,
      before: listing.before,
    };
  },
);

//------------------------------------------------------------------------------------------------------//

const initialState = {
  posts: [], //List of Posts as Array
  status: "idle", //idle | loading | error
  error: null, //Err-Msg
  after: null, //For Pagination
  before: null,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload.posts;
        state.after = action.payload.after;
        state.before = action.payload.before;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// export const { setPosts } = postsSlice.actions; Only for MockPosts-data needed
export default postsSlice.reducer;
