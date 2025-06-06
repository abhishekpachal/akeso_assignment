import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../services/apiService";

export const getMyTasks = createAsyncThunk(
  "task/mytasks",
  async (body, thunkAPI) => {
    try {
      const response = await apiService.post("/task/mytasks", body);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch tasks");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: {
    myTasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.myTasks = action.payload.tasks;
      })
      .addCase(getMyTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
