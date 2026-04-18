import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    sessionExpiresAt: null,
    superAdminOtpPending: false,
    superAdminEmail: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSessionExpiresAt: (state, action) => {
      state.sessionExpiresAt = action.payload;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.sessionExpiresAt = null;
      state.loading = false;
      state.superAdminOtpPending = false;
      state.superAdminEmail = null;
    },
    setSuperAdminOtpPending: (state, action) => {
      state.superAdminOtpPending = action.payload;
    },
    setSuperAdminEmail: (state, action) => {
      state.superAdminEmail = action.payload;
    },
  },
});

export const {
  setLoading,
  setUser,
  setSessionExpiresAt,
  clearAuthState,
  setSuperAdminOtpPending,
  setSuperAdminEmail,
} = authSlice.actions;

export default authSlice.reducer;