import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "../reducers/eventSlice";

const store = configureStore({
    reducer: {
        event: eventReducer,
    },
    });

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;


