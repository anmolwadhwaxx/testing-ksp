import {
    createSlice
} from "@reduxjs/toolkit";

const initialValue = {
    id: '',
    name: '',
    role: '',
    email_id: '',
    access_token: '',
    refresh_token: '',
    profile_pic: '',
    joining_date: '',
    is_logged_in: false
};

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: initialValue
    },
    reducers: {
        login: (state, action) => {
            state.value = action.payload;
        },
        logout: (state) => {
            state.value = initialValue;
        }
    }
});

export const {
    login,
    logout
} = userSlice.actions;

export default userSlice.reducer;