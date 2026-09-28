import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_USERS_ORDERS_FAILURE,
  GET_USERS_ORDERS_REQUEST,
  GET_USERS_ORDERS_SUCCESS,
  GET_RESTAURANT_ORDERS_FAILURE,
  GET_RESTAURANT_ORDERS_REQUEST,
  GET_RESTAURANT_ORDERS_SUCCESS,
  UPDATE_RESTAURANT_ORDER_FAILURE,
  UPDATE_RESTAURANT_ORDER_REQUEST,
  UPDATE_RESTAURANT_ORDER_SUCCESS,
} from "./ActionType";
import { api } from "./../../components/config/api";
import { clearCartAction } from "../Cart/Action";

export const createOrder = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });
  try {
    const jwt = reqData.jwt || localStorage.getItem("jwt");
    if (!jwt) {
      throw new Error("Authentication token is missing");
    }
    const { data } = await api.post(`/api/order`, reqData.order, {
      headers: {
        Authorization: `Bearer ${reqData.jwt}`,
      },
    });
    console.log("created order data ", data);
    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
    await dispatch(clearCartAction());
    return data;
  } catch (error) {
    console.error("Failed to create order:", error.response?.data || error);
    dispatch({ type: CREATE_ORDER_FAILURE, payload: error });
    return null;
  }
};

export const getUsersOrder = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USERS_ORDERS_REQUEST });
  try {
    const { data } = await api.get(`/api/order/user`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("users order ", data);
    dispatch({ type: GET_USERS_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: GET_USERS_ORDERS_FAILURE, payload: error });
  }
};

export const getRestaurantOrders =
  ({ restaurantId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_ORDERS_REQUEST });
    try {
      const { data } = await api.get(
        `/api/admin/order/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        },
      );
      dispatch({ type: GET_RESTAURANT_ORDERS_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: GET_RESTAURANT_ORDERS_FAILURE, payload: error });
      throw error;
    }
  };

export const updateRestaurantOrder =
  ({ orderId, orderStatus, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_ORDER_REQUEST });
    try {
      const { data } = await api.put(
        `/api/admin/order/${orderId}/${encodeURIComponent(orderStatus)}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        },
      );
      dispatch({ type: UPDATE_RESTAURANT_ORDER_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: UPDATE_RESTAURANT_ORDER_FAILURE, payload: error });
      throw error;
    }
  };
