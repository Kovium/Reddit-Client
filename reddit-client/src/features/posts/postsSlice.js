import { createSlice } from "@reduxjs/toolkit";
import { mockPosts } from "../../utils/mockPosts";

const initialState = {
posts: mockPosts,   //Liste der Posts
status: "idle",     //idle | loading | error
error: null,        //Err-Msg
};

export const postsSlice = createSlice({
    name:"posts",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload
        },
    },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;