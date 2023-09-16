import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const initialState = {
    listOfIssueComments: [],
    numberOfIssueComments: 0,
    listOfSprintComments: [],
    numberOfSprintComments: 0,
    isLoading: false,
}

export const getSprintComments = createAsyncThunk(
    'comment/getSprintcomments',
    async (sprint, thunkAPI) => {
        try {
            const response = await axios.get(`${serverUrl}/api/v1/mppms/comment/findBySprintId?sprint=${sprint}`);
            return response.data.comments;
        } catch (error) {
            return thunkAPI.rejectWithValue('Something went wrong!!');
        }
    }
);

export const getIssueComments = createAsyncThunk(
    'comment/getIssueComments',
    async (issue, thunkAPI) => {
        try {
            const response = await axios.get(`${serverUrl}/api/v1/mppms/comment/findByIssueId?issue=${issue}`);
            return response.data.comments;
        } catch (error) {
            return thunkAPI.rejectWithValue('Something went wrong!!');
        }
    }
);

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    extraReducers: {
        [getIssueComments.pending] : (state) => {
            state.isLoading = true;
        },
        [getIssueComments.fulfilled] : (state, action) => {
            state.isLoading = false;
            // let listOfIssueComments = action.payload.sort((a,b) => new Date(a.addDate) - new Date(b.addDate));
            state.listOfIssueComments = action.payload.filter(element => element.issue);
            state.numberOfIssueComments = state.listOfIssueComments.length;
        },
        [getIssueComments.rejected] : (state) => {
            state.isLoading = false;
        },
        [getSprintComments.pending] : (state) => {
            state.isLoading = true;
        },
        [getSprintComments.fulfilled] : (state, action) => {
            state.isLoading = false;
            // let listOfSprintComments = action.payload.sort((a,b) => new Date(a.addDate) - new Date(b.addDate));
            state.listOfSprintComments = action.payload.filter(element => element.sprint);
            state.numberOfSprintComments = state.listOfSprintComments.length;
        },
        [getSprintComments.rejected] : (state) => {
            state.isLoading = false;
        }
    }
});

// eslint-disable-next-line no-empty-pattern
export const { } = commentSlice.actions;
export default commentSlice.reducer;