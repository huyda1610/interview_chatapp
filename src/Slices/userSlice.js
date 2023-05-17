import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userAPI from "../Services/userAPI";

const initialState = {
  users: [],
};

export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  try {
    const data = await userAPI.getAllUsers();
    return data;
  } catch (error) {
    throw error;
  }
});

const userSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    getMovieId: (state, { payload }) => {
      state.movieId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, { payload }) => {
      state.users = payload.data;
    });
    builder.addCase(getAllUsers.rejected, (state, { error }) => {
      state.error = error.data;
    });
  },
});

// export reducer
export default userSlice.reducer;
