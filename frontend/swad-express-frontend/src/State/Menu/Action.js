

import { api } from "../../components/config/api";
import {
  CREATE_MENU_ITEM_FAILURE,
  CREATE_MENU_ITEM_REQUEST,
  CREATE_MENU_ITEM_SUCCESS,
  DELETE_MENU_ITEM_FAILURE,
  DELETE_MENU_ITEM_REQUEST,
  DELETE_MENU_ITEM_SUCCESS,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS,
  SEARCH_MENU_ITEM_FAILURE,
  SEARCH_MENU_ITEM_REQUEST,
  SEARCH_MENU_ITEM_SUCCESS,
  UPDATE_MENU_ITEM_AVAILABILITY_FAILURE,
  UPDATE_MENU_ITEM_AVAILABILITY_REQUEST,
  UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS,
  UPDATE_MENU_ITEM_FAILURE,
  UPDATE_MENU_ITEM_REQUEST,
  UPDATE_MENU_ITEM_SUCCESS,
} from "./ActionType";

export const createMenuItem =
  ({ menu, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_MENU_ITEM_REQUEST });
    try {
      const { data } = await api.post(`api/admin/food`, menu, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("menu created ", data);
      dispatch({ type: CREATE_MENU_ITEM_SUCCESS, payload: data });
      return data;
    } catch (error) {
      console.log("error ", error);
      dispatch({ type: CREATE_MENU_ITEM_FAILURE, payload: error });
      throw error;
    }
  };

export const getMenuItemsByRestaurantId = (reqData) => async (dispatch) => {
  dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST });
  try {
    const params = new URLSearchParams({
      vegetarian: String(reqData.vegetarian ?? false),
      nonveg: String(reqData.nonveg ?? false),
      sessional: String(reqData.seasonal ?? reqData.sessional ?? false),
      foodCategory: reqData.foodCategory ?? "",
    });
    const { data } = await api.get(
      `api/food/restaurant/${reqData.restaurantId}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      },
    );
    const selectedCategory = reqData.foodCategory?.trim().toLowerCase();
    const filteredData = selectedCategory
      ? data.filter((item) => {
          const itemCategory = (item.category || item.foodCategory)?.name?.trim().toLowerCase();

          return (
            itemCategory === selectedCategory ||
            (!itemCategory &&
              item.name?.toLowerCase().includes(selectedCategory))
          );
        })
      : data;

    console.log("menu items by restaurants ", filteredData);
    dispatch({
      type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS,
      payload: filteredData,
    });
    return filteredData;
  } catch (error) {
    console.log("error ", error);
    dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, payload: error });
    throw error;
  }
};

export const searchMenuItem =
  ({ keyword, jwt }) =>
  async (dispatch) => {
    dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
    try {
      const { data } = await api.get(`api/food/search?name=${encodeURIComponent(keyword.trim())}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("data ", data);
      dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
      return data;
    } catch (error) {
      console.log("error ", error);
      dispatch({ type: SEARCH_MENU_ITEM_FAILURE, payload: error });
      throw error;
    }
  };

export const updateMenuItemAvailability =
  ({ foodId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEM_AVAILABILITY_REQUEST });
    try {
      const { data } = await api.put(
        `api/admin/food/${foodId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      console.log("menu items availlability ", data);
      dispatch({ type: UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS, payload: data });
      return data;
    } catch (error) {
      console.log("error ", error);
      dispatch({
        type: UPDATE_MENU_ITEM_AVAILABILITY_FAILURE,
        payload: error,
      });
      throw error;
    }
  };

export const deleteFoodAction =
  ({ foodId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_MENU_ITEM_REQUEST });
    try {
      const { data } = await api.delete(
        `api/admin/food/${foodId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      console.log("Delete food successfully ", data);
      dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: foodId });
      return data;
    } catch (error) {
      console.log("error ", error);
      dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: error });
      throw error;
    }
  };

export const updateMenuItemDetails =
  ({ foodId, menu, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEM_REQUEST });
    try {
      const { data } = await api.put(
        `api/admin/food/${foodId}/details`,
        menu,
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        },
      );
      dispatch({ type: UPDATE_MENU_ITEM_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: UPDATE_MENU_ITEM_FAILURE, payload: error });
      throw error;
    }
  };
