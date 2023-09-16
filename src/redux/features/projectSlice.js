import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const initialState = {
    listOfProjects: [],
    listOfArtistProjects: [],
    listOfManagerProjects: [],
    listOfProducersProjects: [],
    selectedProject: {},
    numberOfProjects: 0,
    responseMessage: '',
    searchedQuery: '',
    searchProjectsResults: [],
    isLoading: false,
}

export const getAllProjects = createAsyncThunk(
    'project/getAllProjects',
    async (filter, thunkAPI) => {
        try {
            const response = await axios.get(serverUrl+`/api/v1/mppms/project/list`);
            response.data.projects.forEach((element, index) => {
                element.id = element._id;
                delete element._id;
                delete element.__v;
                element.startDate = new Date(element.startDate).toLocaleString();
                element.endDate = new Date(element.endDate).toLocaleString();
                element.estimatedEndDate = new Date(element.estimatedEndDate).toLocaleString();
                element.number = index;
            });
            return { projects: response.data.projects, filter }
        } catch (error) {
            return thunkAPI.rejectWithValue('Something went wrong!!');
        }
    }
);

export const getSelectedProject = createAsyncThunk(
    'project/getSelectedProject',
    async (filter, thunkAPI) => {
        const { projectCode } = filter;
        
        try {
            const response = await axios.get(`${serverUrl}/api/v1/mppms/project/findByCode?code=${projectCode}`);
            
            response.data.project.startDate = new Date(response.data.project.startDate).toLocaleString();
            response.data.project.endDate = new Date(response.data.project.endDate).toLocaleString();
            response.data.project.estimatedEndDate = new Date(response.data.project.estimatedEndDate).toLocaleString();
            
            return { project: response.data.project }
        } catch (error) {
            return thunkAPI.rejectWithValue('Something went wrong!!');
        }
    }
);

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        updateProjects: (state, action) => {
            state.selectedProject = action.payload;
            let projects = state.listOfProjects;

            projects.forEach(project => {
                if (project.id === action.payload._id) {
                    project = action.payload;
                }
            })
            state.listOfProjects = projects;
        },
        dynamicSearch: (state, action) => {
            state.searchProjectsResults = state.listOfProjects.filter(project => project.jobLocation.toUpperCase().includes(action.payload.toUpperCase()));
        },
        manualSearch: (state, action) => {
            state.searchProjectsResults = state.listOfProjects.filter(project => project.jobLocation.toUpperCase().includes(action.payload.toUpperCase()));
        }
    },
    extraReducers: {
        [getAllProjects.pending] : (state) => {
            state.isLoading = true;
        },
        [getAllProjects.fulfilled] : (state, action) => {
            state.isLoading = false;
            const { id, email } = action.payload.filter;
            let listOfProjects = action.payload.projects.sort((a,b) => new Date(a.creationDate) - new Date(b.creationDate));
            state.listOfProjects = listOfProjects;
            state.listOfProducersProjects = action.payload.projects.filter(project => project.producerId === id);
            // state.listOfManagerProjects = action.payload.projects.filter(project => project.ownerEmail === email);
            // state.numberOfProjects = state.listOfProducersProjects.length + state.listOfManagerProjects.length;
        },
        [getAllProjects.rejected] : (state) => {
            state.isLoading = false;
        },
        [getSelectedProject.pending] : (state) => {
            state.isLoading = true;
        },
        [getSelectedProject.fulfilled] : (state, action) => {
            state.isLoading = false;
            state.selectedProject = action.payload.project;
        },
        [getSelectedProject.rejected] : (state) => {
            state.isLoading = false;
        }
    }
});

export const { updateProjects, dynamicSearch, manualSearch } = projectSlice.actions;
export default projectSlice.reducer;