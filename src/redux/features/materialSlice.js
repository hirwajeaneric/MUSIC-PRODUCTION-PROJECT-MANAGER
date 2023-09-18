import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const initialState = {
    listOfProjectResources: [],
    listOfIssueResources: [],
    listOfSprintResources: [],
    selectedResource: {},
    numberOfProjectResources: 0,
    numberOfIssueResources: [],
    numberOfSprintResources: [],
    searchedQuery: '',
    searchResourcesResults: [],
    isLoading: false,
}

export const getProjectResources = createAsyncThunk(
    'material/getProjectResources',
    async (project, thunkAPI) => {
        try {
            const response = await axios.get(`${serverUrl}/api/v1/mppms/material/findByProjectId?project=${project}`);
            response.data.materials.forEach(element => {
                element.id = element._id;
                delete element._id;
                delete element.__v;
                // element.totalPrice = element.quantity*element.unitPrice;
                element.entryDate = new Date(element.entryDate).toLocaleString();
            });
            response.data.materials.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
            return response.data.materials;
        } catch (error) {
            return thunkAPI.rejectWithValue('Something went wrong!!');
        }
    }
);

const materialSlice = createSlice({
    name: 'material',
    initialState,
    reducers: {
        updateResource: (state, action) => {
            state.selectedResource = action.payload;
            let resources = state.listOfProjectResources;

            resources.forEach(resource => {
                if (resource.id === action.payload._id) {
                    resource = action.payload;
                }
            })
            state.listOfProjectResources = resources;
        },
        dynamicSearch: (state, action) => {
            state.searchResourcesResults = state.listOfProjectResources.filter(resource => resource.name.toUpperCase().includes(action.payload.toUpperCase()));
        },
        manualSearch: (state, action) => {
            state.searchResourcesResults = state.listOfProjectResources.filter(resource => resource.name.toUpperCase().includes(action.payload.toUpperCase()));
        }
    },
    extraReducers: {
        [getProjectResources.pending] : (state) => {
            state.isLoading = true;
        },
        [getProjectResources.fulfilled] : (state, action) => {
            state.isLoading = false;
            let listOfProjectResources = action.payload.sort((a,b) => new Date(a.creationDate) - new Date(b.creationDate));
            listOfProjectResources.forEach(element => {
                element.remaining = element.quantity - element.used;
            });
            state.listOfProjectResources = listOfProjectResources;
            state.numberOfProjectResources = listOfProjectResources.length; 
        },
        [getProjectResources.rejected] : (state) => {
            state.isLoading = false;
        }
    }
});

export const { updateResource, dynamicSearch, manualSearch } = materialSlice.actions;
export default materialSlice.reducer;