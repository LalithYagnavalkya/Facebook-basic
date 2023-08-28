import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";

const Store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default Store;