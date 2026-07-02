import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { post } from "../../api/axios";
const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

export const login = createAsyncThunk("login", async (data, thunkAPI) => {
  try {
    const res = await post("/auth/login", data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});
export const logout = createAsyncThunk("logout", async (_, thunkAPI) => {
  try {
    const res = await post("/auth/logout");
    console.log(res)
    return res;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});
const initialState = {
  user: null,
  isLoading: false,
  //   status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // logout: (state) => {
    //   state.user = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// export const { logout } = authSlice.actions;
export default authSlice.reducer;
