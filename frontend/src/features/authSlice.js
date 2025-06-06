import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../services/apiService";

export const loginUser = createAsyncThunk(
  "auth/signin",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await apiService.post("/auth/signin", {
        email,
        password,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // Save JWT to localStorage
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await apiService.post("/auth/signup", {
        name,
        email,
        password,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
    async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      return { token, user: JSON.parse(user) };
    } else {
      return thunkAPI.rejectWithValue("No token found in storage");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    registrationDone: false,
    error: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.registrationDone = true;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        console.log("Loaded user from storage:", action.payload.user);
        
        state.user = action.payload.user;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
