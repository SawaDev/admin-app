import { createSlice } from "@reduxjs/toolkit";

export const kamarSlice = createSlice({
  name: "kamar",
  initialState: {
    kamars: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    //GET ALL
    getKamarStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getKamarSuccess: (state, action) => {
      state.isFetching = false;
      state.kamars = action.payload;
    },
    getKamarFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //DELETE
    deleteKamarStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteKamarSuccess: (state, action) => {
      state.isFetching = false;
      state.kamars.splice(
        state.kamars.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteKamarFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //UPDATE
    updateKamarStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateKamarSuccess: (state, action) => {
      state.isFetching = false;
      state.kamars[
        state.kamars.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.kamar;
    },
    updateKamarFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //add
    addKamarStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    addKamarSuccess: (state, action) => {
      state.isFetching = false;
      state.kamars.push(action.payload);
    },
    addKamarFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  }
});

export const {
  getKamarStart,
  getKamarSuccess,
  getKamarFailure,
  deleteKamarStart,
  deleteKamarSuccess,
  deleteKamarFailure,
  updateKamarStart,
  updateKamarSuccess,
  updateKamarFailure,
  addKamarStart,
  addKamarSuccess,
  addKamarFailure,
} = kamarSlice.actions;

export default kamarSlice.reducer;