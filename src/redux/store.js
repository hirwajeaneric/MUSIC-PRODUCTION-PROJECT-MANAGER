import { configureStore } from '@reduxjs/toolkit';
import projectReducer  from './features/projectSlice';
import issueReducer from './features/issueSlice';
import materialReducer from './features/materialSlice';
import commentReducer from './features/commentSlice';
import sprintReducer from './features/sprintSlice';

export const store = configureStore({
    reducer: {
        project: projectReducer, 
        issue: issueReducer,
        material: materialReducer,
        comment: commentReducer,
        sprint: sprintReducer,
    }
})