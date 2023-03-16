import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";
import {
  getKamarFailure,
  getKamarStart,
  getKamarSuccess,
  deleteKamarFailure,
  deleteKamarStart,
  deleteKamarSuccess,
  updateKamarFailure,
  updateKamarStart,
  updateKamarSuccess,
  addKamarFailure,
  addKamarStart,
  addKamarSuccess,
} from "./kamarRedux";
import {
  getSaleFailure,
  getSaleStart,
  getSaleSuccess,
  addSaleFailure,
  addSaleStart,
  addSaleSuccess,
} from "./saleRedux"
import { createAlert } from "./alertRedux";

// export const loginn = async (dispatch, user) => {
//   dispatch(loginStart());
//   let result;
//   const res = await publicRequest.post("/auth/login", user).then(res => {
//     console.log('login success', res.data);
//     dispatch(loginSuccess(res.data));
//     return res.data;
//   }).catch(err => {
//     console.log('error on', err.response.data);
//     dispatch(loginFailure());
//     result = err.response.data;
//     return err.response.data;
//   })
//   return result;
// }

export const login2 = (dispatch, user) => {
  dispatch(loginStart());
  const res = publicRequest.post("/auth/login", user).then(res => {
    dispatch(loginSuccess(res.data));
    return res.data;
  }).catch(err => {
    createAlert(err.response.data.message);
    dispatch(loginFailure());
    return err.response.data;
  })
  console.log(res);
}

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user)
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
}

export const getKamars = async (dispatch) => {
  dispatch(getKamarStart());
  try {
    const res = await publicRequest.get("/kamars");
    dispatch(getKamarSuccess(res.data));
  } catch (err) {
    dispatch(getKamarFailure());
  }
}

export const getKamar = async (dispatch, id) => {
  dispatch(getKamarStart());
  try {
    const res = await publicRequest.get(`/kamars/find/${id}`);
    dispatch(getKamarSuccess(res.data));
  } catch (err) {
    dispatch(getKamarFailure());
  }
}

export const deleteKamar = async (id, dispatch) => {
  dispatch(deleteKamarStart());
  try {
    const res = await userRequest.delete(`/kamars/${id}`);
    dispatch(deleteKamarSuccess(id));
  } catch (err) {
    dispatch(deleteKamarFailure());
  }
};

export const updateKamar = async (id, kamar, dispatch) => {
  dispatch(updateKamarStart());
  try {
    const res = await userRequest.put(`/kamars/${id}`)
    dispatch(updateKamarSuccess({ id, kamar }));
  } catch (err) {
    dispatch(updateKamarFailure());
  }
};

export const addKamar = async (kamar, dispatch) => {
  dispatch(addKamarStart());
  try {
    const res = await userRequest.post("/kamars", kamar);
    dispatch(addKamarSuccess(res.data));
  } catch (err) {
    dispatch(addKamarFailure());
  }
};

export const getSales = async (dispatch) => {
  dispatch(getSaleStart());
  try {
    const res = await publicRequest.get("/sales");
    dispatch(getSaleSuccess(res.data));
  } catch (err) {
    dispatch(getSaleFailure());
  }
};

export const addSale = async (sale, dispatch) => {
  dispatch(addSaleStart());
  try {
    const res = await userRequest.post("/sales/newCollection", sale);
    dispatch(addSaleSuccess(res.data));
  } catch (err) {
    dispatch(addSaleFailure());
  }
};
