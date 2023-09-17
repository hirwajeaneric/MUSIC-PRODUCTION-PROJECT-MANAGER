import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const initialState = {
    listOfProjectPayments: [],
    selectedPayment: {},
    totalPaidAmountForSelectedProject: 0, 
    totalAmountOfAllPayments: 0,
    searchedQuery: '',
    searchPaymentsResults: [],
    isLoading: false,
}

export const getProjectPayments = createAsyncThunk(
    'payment/getProjectPayments',
    async (project, thunkAPI) => {
        try {
            const response = await axios.get(`${serverUrl}/api/v1/mppms/payment/findByProjectId?project=${project}`);
            response.data.payments.forEach(element => {
                element.id = element._id;
                delete element._id;
                delete element.__v;
                element.entryDate = new Date(element.entryDate).toLocaleString();
            });
            response.data.payments.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
            return response.data.payments;
        } catch (error) {
            return thunkAPI.rejectWithValue('Something went wrong!!');
        }
    }
);

export const getSelectedPayments = createAsyncThunk(
    'payment/getSelectedPayment',
    async (filter, thunkAPI) => {
        const { paymentId } = filter;
        try {
            const response = await axios.get(`${serverUrl}/api/v1/mppms/payment/findById?id=${paymentId}`);
            response.data.payment.entryDate = new Date(response.data.payment.entryDate).toLocaleString();
            return response.data.payment;
        } catch (error) {
            return thunkAPI.rejectWithValue('Something went wrong!!');
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        updateResource: (state, action) => {
            state.selectedResource = action.payload;
            let Payments = state.listOfProjectPayments;

            Payments.forEach(resource => {
                if (resource.id === action.payload._id) {
                    resource = action.payload;
                }
            })
            state.listOfProjectPayments = Payments;
        },
        dynamicSearch: (state, action) => {
            state.searchPaymentsResults = state.listOfProjectPayments.filter(resource => resource.name.toUpperCase().includes(action.payload.toUpperCase()));
        },
        manualSearch: (state, action) => {
            state.searchPaymentsResults = state.listOfProjectPayments.filter(resource => resource.name.toUpperCase().includes(action.payload.toUpperCase()));
        }
    },
    extraReducers: {
        [getProjectPayments.pending] : (state) => {
            state.isLoading = true;
        },
        [getProjectPayments.fulfilled] : (state, action) => {
            state.isLoading = false;
            let listOfProjectPayments = action.payload.sort((a,b) => new Date(a.creationDate) - new Date(b.creationDate));
            let totalAmountOfAllPayments = 0;
            
            listOfProjectPayments.forEach(element => {
                totalAmountOfAllPayments = totalAmountOfAllPayments + element.amount;
            });

            state.totalAmountOfAllPayments = totalAmountOfAllPayments;
            state.listOfProjectPayments = listOfProjectPayments;
            state.numberOfProjectPayments = listOfProjectPayments.length; 
        },
        [getProjectPayments.rejected] : (state) => {
            state.isLoading = false;
        },
        [getSelectedPayments.pending] : (state) => {
            state.isLoading = true;
        },
        [getSelectedPayments.fulfilled] : (state, action) => {
            state.isLoading = false;
            state.selectedPayment = action.payload; 
        },
        [getSelectedPayments.rejected] : (state) => {
            state.isLoading = false;
        }
    }
});

export const { updateResource, dynamicSearch, manualSearch } = paymentSlice.actions;
export default paymentSlice.reducer;