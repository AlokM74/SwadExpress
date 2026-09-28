import { api } from "../../components/config/api";
import {
  CREATE_INGREDIENT_FAILURE,
  CREATE_INGREDIENT_REQUEST,
  CREATE_INGREDIENT_SUCCESS,
  CREATE_INGRREDIENT_CATEGORY_FAILURE,
  CREATE_INGRREDIENT_CATEGORY_REQUEST,
  CREATE_INGRREDIENT_CATEGORY_SUCCESS,
  DELETE_INGREDIENT_FAILURE,
  DELETE_INGREDIENT_REQUEST,
  DELETE_INGREDIENT_SUCCESS,
  GET_INGREDIENTS_FAILURE,
  GET_INGREDIENTS_REQUEST,
  GET_INGREDIENTS_SUCCESS,
  GET_INGRREDIENT_CATEGORY_FAILURE,
  GET_INGRREDIENT_CATEGORY_REQUEST,
  GET_INGRREDIENT_CATEGORY_SUCCESS,
  UPDATE_INGREDIENT_FAILURE,
  UPDATE_INGREDIENT_REQUEST,
  UPDATE_INGREDIENT_SUCCESS,
  UPDATE_STOCK,
} from "./ActionType";

const authConfig = (jwt) => ({
  headers: {
    Authorization: "Bearer " + jwt,
  },
});

export const getIngredientsOfRestaurant =
  ({ restaurantId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_INGREDIENTS_REQUEST });
    try {
      const { data } = await api.put(
        `/api/admin/ingredients/restaurant/${restaurantId}/item`,
        {},
        authConfig(jwt),
      );
      dispatch({ type: GET_INGREDIENTS_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: GET_INGREDIENTS_FAILURE, payload: error });
      throw error;
    }
  };

export const createIngredient =
  ({ reqData, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_INGREDIENT_REQUEST });
    try {
      const { data } = await api.post(
        "/api/admin/ingredients/item",
        reqData,
        authConfig(jwt),
      );
      dispatch({ type: CREATE_INGREDIENT_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: CREATE_INGREDIENT_FAILURE, payload: error });
      throw error;
    }
  };

export const createIngredientCategory =
  ({ reqData, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_INGRREDIENT_CATEGORY_REQUEST });
    try {
      const { data } = await api.post(
        "/api/admin/ingredients/category",
        reqData,
        authConfig(jwt),
      );
      dispatch({ type: CREATE_INGRREDIENT_CATEGORY_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: CREATE_INGRREDIENT_CATEGORY_FAILURE, payload: error });
      throw error;
    }
  };

export const getIngredientCategory =
  ({ restaurantId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_INGRREDIENT_CATEGORY_REQUEST });
    try {
      const { data } = await api.get(
        `/api/admin/ingredients/restaurant/${restaurantId}/category`,
        authConfig(jwt),
      );
      dispatch({ type: GET_INGRREDIENT_CATEGORY_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: GET_INGRREDIENT_CATEGORY_FAILURE, payload: error });
      throw error;
    }
  };

export const updateIngredient =
  ({ ingredientId, reqData, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_INGREDIENT_REQUEST });
    try {
      const { data } = await api.put(
        `/api/admin/ingredients/item/${ingredientId}`,
        reqData,
        authConfig(jwt),
      );
      dispatch({ type: UPDATE_INGREDIENT_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: UPDATE_INGREDIENT_FAILURE, payload: error });
      throw error;
    }
  };

export const deleteIngredient =
  ({ ingredientId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_INGREDIENT_REQUEST });
    try {
      await api.delete(
        `/api/admin/ingredients/item/${ingredientId}`,
        authConfig(jwt),
      );
      dispatch({ type: DELETE_INGREDIENT_SUCCESS, payload: ingredientId });
      return ingredientId;
    } catch (error) {
      dispatch({ type: DELETE_INGREDIENT_FAILURE, payload: error });
      throw error;
    }
  };

export const updateStockOfIngredient =
  ({ ingredientId, ingridientId, jwt }) =>
  async (dispatch) => {
    const id = ingredientId ?? ingridientId;
    dispatch({ type: UPDATE_INGREDIENT_REQUEST });
    try {
      const { data } = await api.put(
        `/api/admin/ingredients/${id}/stock`,
        {},
        authConfig(jwt),
      );
      dispatch({ type: UPDATE_STOCK, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: UPDATE_INGREDIENT_FAILURE, payload: error });
      throw error;
    }
  };
