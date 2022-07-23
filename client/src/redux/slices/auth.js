import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";


//params добавлено для отоброжения всей инфы(email,password)
export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params) => {
    const {data} = await axios.post('/auth/login', params)
    return data
})

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const {data} = await axios.get('/auth/me')
    return data
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const {data} = await axios.post('/auth/register', params)
    return data
})

const initialState = {
    data: null,
    status: 'loading'
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null
            localStorage.removeItem('token')
        }
    },
    extraReducers: {
        [fetchLogin.pending]: (state) => {
            state.data = null;
            state.status = 'loading';
        },
        [fetchLogin.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'loaded';
        },
        [fetchLogin.rejected]: (state) => {
            state.data = null;
            state.status = 'error';
        },
        [fetchAuthMe.pending]: (state) => {
            state.data = null;
            state.status = 'loading';
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'loaded';
        },
        [fetchAuthMe.rejected]: (state) => {
            state.data = null;
            state.status = 'error';
        },
        [fetchRegister.pending]: (state) => {
            state.data = null;
            state.status = 'loading';
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'loaded';
        },
        [fetchRegister.rejected]: (state) => {
            state.data = null;
            state.status = 'error';
        }
    }
})


export const selectIsAuth = (state) => Boolean(state.auth.data)

export const authReducer = authSlice.reducer;
export const {logout} = authSlice.actions