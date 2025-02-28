import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { getAllUsers } from "./usersAPI";
import bcrypt from "bcryptjs";

export interface AuthState {
  email: string | null;
  role: "admin" | "user" | null;
  banned: boolean;
  banReason?: string;
  isLoggedIn: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  email: null,
  role: null,
  banned: false,
  banReason: undefined,
  isLoggedIn: false,
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk<
  {
    email: string;
    role: "admin" | "user";
    banned: boolean;
    banReason?: string;
  },
  { emailOrAdmin: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || "admin";
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin";

    if (
      credentials.emailOrAdmin.toLowerCase() === ADMIN_USERNAME.toLowerCase()
    ) {
      if (credentials.password !== ADMIN_PASSWORD) {
        return thunkAPI.rejectWithValue("Invalid admin credentials");
      }
      return { email: ADMIN_USERNAME, role: "admin", banned: false };
    } else {
      const users = await getAllUsers();
      const foundUser = users.find(
        (u) => u.email?.toLowerCase() === credentials.emailOrAdmin.toLowerCase()
      );
      if (!foundUser) {
        return thunkAPI.rejectWithValue("No user found with that email");
      }
      const match = await bcrypt.compare(
        credentials.password,
        foundUser.password
      );
      if (!match) {
        return thunkAPI.rejectWithValue("Incorrect password");
      }
      return {
        email: foundUser.email || "",
        role: "user",
        banned: !!foundUser.banned,
        banReason: foundUser.banReason,
      };
    }
  } catch (err) {
    return thunkAPI.rejectWithValue("Login error");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.email = null;
      state.role = null;
      state.banned = false;
      state.banReason = undefined;
      state.isLoggedIn = false;
      state.error = null;
      state.status = "idle";
      localStorage.removeItem("authState");
    },
    restoreAuthState(state, action) {
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.banned = !!action.payload.banned;
      state.banReason = action.payload.banReason;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.banned = action.payload.banned;
        state.banReason = action.payload.banReason;
        state.isLoggedIn = true;
        state.error = null;
        const toStore = {
          email: state.email,
          role: state.role,
          banned: state.banned,
          banReason: state.banReason,
          isLoggedIn: state.isLoggedIn,
        };
        localStorage.setItem("authState", JSON.stringify(toStore));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, restoreAuthState } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
