import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const initialState = {
    listOfProjects: [],
    listOfUserProjects: [],
    listOfArtistProjects: [],
    listOfManagerProjects: [],
    listOfProducersProjects: [],
    selectedProject: {},
    numberOfProjects: 0,
    numberOfProducerProjects: 0,
    numberOfUserProjects: 0,
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
            const { id, role } = action.payload.filter;
            
            if (role === 'Producer') {
                var producerProjects = action.payload.projects.filter(project => project.producerId === id);
                state.listOfProducersProjects = producerProjects;
                state.numberOfProjects = producerProjects.length;
            } else {
                var userProjects = [];
                action.payload.projects.forEach(project =>{
                    project.users.forEach(user => {
                        if (user.id === id) {
                            userProjects.push(project);
                        }
                    });
                });

                state.listOfUserProjects = userProjects;
                state.numberOfProjects = userProjects.length;
            }
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