import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunk bleibt fast gleich
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ filter, searchTerm, after = null }) => {
    let url;
    if (searchTerm) {
      url = `https://www.reddit.com/search.json?q=${searchTerm}&limit=10`;
    } else {
      url = `https://www.reddit.com/${filter}.json?limit=10`;
    }
    if (after) url += `&after=${after}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Fehler beim Laden der Posts");

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
          ? item.data.preview.images[0].source.url.replace(/&amp;/g, "&")
          : null,
        video: item.data.is_video
          ? item.data.media?.reddit_video?.fallback_url
          : null,
      })),
      after: listing.after,
    };
  },
);

const initialState = {
  posts: [],
  status: "idle",
  error: null,
  after: null,
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
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
