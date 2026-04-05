import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"; 
import storage from "redux-persist/lib/storage"; 
import { combineReducers } from "@reduxjs/toolkit";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";


const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: ["companySlice", "jobSlice"],
};

const rootReducer = combineReducers({
    authSlice: authSlice,
    jobSlice: jobSlice,
    companySlice: companySlice,
    applicationSlice: applicationSlice,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], 
            },
        }),
});


export default store;