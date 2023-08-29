import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../services/types";

const initialState: RootState["auth"] = {
    isLoggedIn:
        JSON.parse(localStorage.getItem("userData") ?? "{}").isLoggedIn || false,
    id: JSON.parse(localStorage.getItem("userData") ?? "{}").id || null,
    email: JSON.parse(localStorage.getItem("userData") ?? "{}").email || null,
    token:
        JSON.parse(localStorage.getItem("userData") ?? "{}").token || null,
    friends: JSON.parse(localStorage.getItem('userData') ?? "{}").token || null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            let userObj = action.payload.userObj;
            let token = action.payload.token;
            state.isLoggedIn = true;
            localStorage.setItem(
                "userData",
                JSON.stringify({ ...userObj, token, isLoggedIn: true })
            );
            state.id = userObj._id;
            state.email = userObj.email;
            state.token = token;
            state.friends = userObj.friends;
        },
        setAccessToken: (state, action) => {
            state.token = action.payload.accessToken;
            localStorage.setItem(
                "userData",
                JSON.stringify({
                    ...action.payload,
                    accessToken: action.payload.accessToken,
                })
            );
        },
        logout: (state) => {
            localStorage.removeItem("userData");
            state.isLoggedIn = false;
            state.email = null;
            state.token = null;
            state.id = null;
        },
    },
});

export const { loginSuccess, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;