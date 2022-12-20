import { createSlice } from "@reduxjs/toolkit";

export const saleSlice = createSlice({
  name: "sale",
  initialState: {
    sales: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    //GET ALL
    getSaleStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getSaleSuccess: (state, action) => {
      state.isFetching = false;
      state.sales = action.payload;
    },
    getSaleFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //add
    addSaleStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    addSaleSuccess: (state, action) => {
      state.isFetching = false;
      state.sales.push(action.payload);
    },
    addSaleFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  }
});

export const {
  getSaleStart,
  getSaleSuccess,
  getSaleFailure,
  addSaleStart,
  addSaleSuccess,
  addSaleFailure,
} = saleSlice.actions;

export default saleSlice.reducer;