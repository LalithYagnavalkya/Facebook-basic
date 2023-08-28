import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../services/types";

const initialState: RootState["auth"] = {
    isLoggedIn:
        JSON.parse(localStorage.getItem("userData") ?? "{}").isLoggedIn || false,
    id: JSON.parse(localStorage.getItem("userData") ?? "{}").id || null,
    email: JSON.parse(localStorage.getItem("userData") ?? "{}").email || null,
    accessToken:
        JSON.parse(localStorage.getItem("userData") ?? "{}").token || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isLoggedIn = true;
            localStorage.setItem(
                "userData",
                JSON.stringify({ ...action.payload, isLoggedIn: true })
            );
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.accessToken = action.payload.token;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
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
            state.accessToken = null;
            state.id = null;
        },
    },
});

export const { loginSuccess, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;