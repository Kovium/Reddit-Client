import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import { mockPosts } from "../../utils/mockPosts";

//--------------------------------------------------------------creating 3x Async Actions (pending | fulfilled | rejected)
export const fetchPosts = createAsyncThunk(
    
    "posts/fetchPosts",
    async ({ filter, searchTerm }) => {
        
        let url;

        if(searchTerm){
            url = `https://www.reddit.com/search.json?q=${searchTerm}`;
        } else {
            url = `https://www.reddit.com/${filter}.json`;
        }

        const response = await fetch(url);

        if(!response.ok){
            throw new Error("Fehler beim Laden der Posts")
        }

        const data = await response.json();

        return data.data.children.map((item) => ({
            id: item.data.id,
            title: item.data.title,
            author: item.data.author,
            subreddit: item.data.subreddit,
            upvotes: item.data.ups,
            comments: item.data.num_comments,
        }));
    }
);

//------------------------------------------------------------------------------------------------------//
const initialState = {
posts: [],          //List of Posts as Array 
status: "idle",     //idle | loading | error
error: null,        //Err-Msg
};

export const postsSlice = createSlice({
    name:"posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    },
});

// export const { setPosts } = postsSlice.actions; Only for MockPosts-data needed
export default postsSlice.reducer;