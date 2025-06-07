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

export const getAssignedTasks = createAsyncThunk(
  "task/assigned",
  async (body, thunkAPI) => {
    try {
      const response = await apiService.post("/task/assigned", body);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch tasks");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  "task/create",
  async (taskData, thunkAPI) => {
    try {
      const response = await apiService.post("/task/create", taskData);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create task");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/update",
  async (taskData, thunkAPI) => {
    try {
      const response = await apiService.post("/task/update", taskData);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update task");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/delete",
  async (taskId, thunkAPI) => {
    try {
      const response = await apiService.post("/task/delete", { taskId });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete task");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  "task/notifications",
  async (thunkAPI) => {
    try {
      const response = await apiService.get("/task/notifications");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch notifications");
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
    assignedTasks: [],
    notifications: [],
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
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAssignedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedTasks = action.payload.tasks;
      })
      .addCase(getAssignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
