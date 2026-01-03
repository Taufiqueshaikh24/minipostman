import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import requestsReducer from "./slices/requestsSlice";
import collectionsReducer from "./slices/collectionsSlice";
import environmentsReducer from "./slices/enviromentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    collections: collectionsReducer,
    environments: environmentsReducer,
  },
});

export default store;