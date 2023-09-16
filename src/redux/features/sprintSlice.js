import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const initialState = {
    listOfIssueSprints: [],
    listOfTodoSprints: [],
    listOfInProgressSprints: [],
    listOfCompletedSprints: [],
    numberOfIssueSprints: 0,
    numberOfTodoSprints: 0,
    numberOfInProgressSprints: 0,
    numberOfCompletedSprints: 0,
    selectedSprint: {},
    searchedQuery: '',
    searchSprintsResults: [],
    isLoading: false,
}

export const getIssueSprints = createAsyncThunk(
    'sprint/getIssueSprints',
    async (issue, thunkAPI) => {
        try {
            const response = await axios.get(`${serverUrl}/api/v1/mppms/sprint/findByIssueId?issue=${issue}`);
            response.data.sprints.forEach(element => {
                element.id = element._id;
                delete element._id;
                delete element.__v;
            });
            return response.data.sprints;
        } catch (error) {
            return thunkAPI.rejectWithValue('Something went wrong!!');
        }
    }
);

const sprintSlice = createSlice({
    name: 'sprint',
    initialState,
    reducers: {
        updateSprint: (state, action) => {
            state.selectedSprint = action.payload;
            let sprints = state.listOfIssueSprints;

            sprints.forEach(sprint => {
                if (sprint.id === action.payload._id) {
                    sprint = action.payload;
                }
            })
            state.listOfIssueSprints = sprints;
        },
        dynamicSearch: (state, action) => {
            state.searchSprintsResults = state.listOfIssueSprints.filter(sprint => sprint.name.toUpperCase().includes(action.payload.toUpperCase()));
        },
        manualSearch: (state, action) => {
            state.searchSprintsResults = state.listOfIssueSprints.filter(sprint => sprint.name.toUpperCase().includes(action.payload.toUpperCase()));
        }
    },
    extraReducers: {
        [getIssueSprints.pending] : (state) => {
            state.isLoading = true;
        },
        [getIssueSprints.fulfilled] : (state, action) => {
            state.isLoading = false;
            
            let listOfIssueSprints = action.payload.sort((a,b) => new Date(a.creationDate) - new Date(b.creationDate));
            
            state.listOfIssueSprints = listOfIssueSprints;
            state.numberOfIssueSprints = listOfIssueSprints.length;
            
            state.listOfTodoSprints = action.payload.filter(element => element.progress === 'Todo');
            state.listOfInProgressSprints = action.payload.filter(element => element.progress === 'In Progress');
            state.listOfCompletedSprints = action.payload.filter(element => element.progress === 'Completed');
            
            state.numberOfTodoSprints = state.listOfTodoSprints.length;
            state.numberOfInProgressSprints = state.listOfInProgressSprints.length;
            state.numberOfCompletedSprints = state.listOfCompletedSprints.length;
        },
        [getIssueSprints.rejected] : (state) => {
            state.isLoading = false;
        }
    }
});

export const { updateSprint, dynamicSearch, manualSearch } = sprintSlice.actions;
export default sprintSlice.reducer;