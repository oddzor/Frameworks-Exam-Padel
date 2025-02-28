import { describe, it, expect, vi, beforeEach } from "vitest";
import authReducer, { logout, restoreAuthState } from "../features/auth/authSlice";
import type { AuthState } from "../features/auth/authSlice";

const initialState: AuthState = {
  email: null,
  role: null,
  banned: false,
  banReason: undefined,
  isLoggedIn: false,
  status: "idle",
  error: null,
};

beforeEach(() => {
  Object.defineProperty(global, "localStorage", {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });
});

describe("authSlice", () => {
  it("should return the initial state", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should handle loginUser.pending by setting status to loading", () => {
    const nextState = authReducer(initialState, { type: "auth/loginUser/pending" });
    expect(nextState.status).toBe("loading");
    expect(nextState.error).toBeNull();
  });

  it("should handle loginUser.fulfilled and update state with user info", () => {
    const payload = { email: "user@example.com", role: "user", banned: false };
    const nextState = authReducer(initialState, { type: "auth/loginUser/fulfilled", payload });

    expect(nextState).toEqual({
      ...initialState,
      ...payload,
      isLoggedIn: true,
      status: "succeeded",
      error: null,
    });

    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "authState",
      JSON.stringify({
        email: "user@example.com",
        role: "user",
        banned: false,
        banReason: undefined,
        isLoggedIn: true,
      })
    );
  });

  it("should handle loginUser.rejected and update state with an error", () => {
    const errorMessage = "Invalid credentials";
    const nextState = authReducer(initialState, { type: "auth/loginUser/rejected", payload: errorMessage });

    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe(errorMessage);
  });

  it("should handle logout and reset the state", () => {
    const loggedInState: AuthState = {
      email: "user@example.com",
      role: "user",
      banned: false,
      banReason: undefined,
      isLoggedIn: true,
      status: "succeeded",
      error: null,
    };

    const nextState = authReducer(loggedInState, logout());
    expect(nextState).toEqual(initialState);
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("authState");
  });

  it("should restore authentication state correctly", () => {
    const storedState: AuthState = {
      email: "user@example.com",
      role: "user",
      banned: false,
      banReason: undefined,
      isLoggedIn: true,
      status: "idle",
      error: null,
    };

    const nextState = authReducer(initialState, restoreAuthState(storedState));
    expect(nextState).toEqual(storedState);
  });
});