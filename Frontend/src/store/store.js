import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user/user.slice.js"
import interviewReducer from "./slice/interview/interview.slice.js"
import { persistStore, persistReducer } from "redux-persist";


import storageEngine from "redux-persist/lib/storage";


const storage = storageEngine.default || storageEngine;

const persistConfig = {
    key: "user",
    storage,
    whitelist: ["userProfile", "isAuthenticated"],
};

const persistedUserReducer = persistReducer(
    persistConfig,
    userReducer
);

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        interview: interviewReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);