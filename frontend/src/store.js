import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import taskReducer from "./features/taskSlice";
import loaderReducer from "./features/loaderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    loader: loaderReducer,
  },
});

export default store;
