import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "./authApi";

// Register user
export const registration = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.registration(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || "Registration failed");
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Verify email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyEmail(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || "Email verification failed");
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.forgotPassword(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || "Forgot password failed");
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, from }, { rejectWithValue }) => {
    try {
      const res = await authApi.resetPassword(token,{password:from.password});
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || "Reset password failed");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },

  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          email: action.payload.email,
          username: action.payload.username,
        };
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // registration
      .addCase(registration.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(registration.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(registration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      // verify email
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Email verification failed";
      })
      // forgot password
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(forgotPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Forgot password failed";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
