import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const initialState = {
    listOfProjectIssues: [],
    numberOfProjectIssues: 0,
    listOfTodoIssues: [],
    listOfInProgressIssues: [],
    listOfCompletedIssues: [],
    numberOfTodoIssues: 0,
    numberOfInProgressIssues: 0,
    numberOfCompletedIssues: 0,
    selectedIssue: {},
    searchedQuery: '',
    searchIssuesResults: [],
    isLoading: false,
}

export const getProjectIssues = createAsyncThunk(
    'issue/getProjectIssues',
    async (project, thunkAPI) => {
        try {
            const response = await axios.get(`${serverUrl}/api/v1/mppms/issue/findByProjectId?project=${project}`);
            
            response.data.issues.forEach((element) => {
                element.id = element._id;
                delete element._id;
                delete element.__v;
            });
            return response.data.issues;
        } catch (error) {
            return thunkAPI.rejectWithValue('Something went wrong!!');
        }
    }
);

const issueSlice = createSlice({
    name: 'issue',
    initialState,
    reducers: {
        updateIssue: (state, action) => {
            state.selectedIssue = action.payload;
            let issues = state.listOfProjectIssues;

            issues.forEach(issue => {
                if (issue.id === action.payload._id) {
                    issue = action.payload;
                }
            })
            state.listOfProjectIssues = issues;
        },
        dynamicSearch: (state, action) => {
            state.searchIssuesResults = state.listOfProjectIssues.filter(issue => issue.name.toUpperCase().includes(action.payload.toUpperCase()));
        },
        manualSearch: (state, action) => {
            state.searchIssuesResults = state.listOfProjectIssues.filter(issue => issue.name.toUpperCase().includes(action.payload.toUpperCase()));
        }
    },
    extraReducers: {
        [getProjectIssues.pending] : (state) => {
            state.isLoading = true;
        },
        [getProjectIssues.fulfilled] : (state, action) => {
            state.isLoading = false;
            
            let listOfProjectIssues = action.payload.sort((a,b) => new Date(a.creationDate) - new Date(b.creationDate));
            
            state.listOfProjectIssues = listOfProjectIssues;
            state.numberOfProjectIssues = listOfProjectIssues.length;
            
            state.listOfTodoIssues = action.payload.filter(element => element.progress === 'Todo');
            state.listOfInProgressIssues = action.payload.filter(element => element.progress === 'In Progress');
            state.listOfCompletedIssues = action.payload.filter(element => element.progress === 'Completed');
            
            state.numberOfTodoIssues = state.listOfTodoIssues.length;
            state.numberOfInProgressIssues = state.listOfInProgressIssues.length;
            state.numberOfCompletedIssues = state.listOfCompletedIssues.length;
        },
        [getProjectIssues.rejected] : (state) => {
            state.isLoading = false;
        }
    }
});

export const { updateIssue, dynamicSearch, manualSearch } = issueSlice.actions;
export default issueSlice.reducer;