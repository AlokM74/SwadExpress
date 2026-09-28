import { api } from "./../../components/config/api";
import {
  CREATE_CATEGORY_FAILURE,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_EVENTS_FAILURE,
  CREATE_EVENTS_REQUEST,
  CREATE_EVENTS_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  CREATE_RESTAURANT_FAILURE,
  CREATE_RESTAURANT_REQUEST,
  CREATE_RESTAURANT_SUCCESS,
  DELETE_EVENTS_FAILURE,
  DELETE_EVENTS_REQUEST,
  DELETE_EVENTS_SUCCESS,
  DELETE_RESTAURANT_FAILURE,
  DELETE_RESTAURANT_REQUEST,
  DELETE_RESTAURANT_SUCCESS,
  GET_ALL_EVENTS_FAILURE,
  GET_ALL_EVENTS_REQUEST,
  GET_ALL_EVENTS_SUCCESS,
  GET_ALL_RESTAURANT_FAILURE,
  GET_ALL_RESTAURANT_REQUEST,
  GET_ALL_RESTAURANT_SUCCESS,
  GET_RESTAURANT_BY_ID_FAILURE,
  GET_RESTAURANT_BY_ID_REQUEST,
  GET_RESTAURANT_BY_ID_SUCCESS,
  GET_RESTAURANT_BY_USER_ID_FAILURE,
  GET_RESTAURANT_BY_USER_ID_REQUEST,
  GET_RESTAURANT_BY_USER_ID_SUCCESS,
  GET_RESTAURANTS_CATEGORY_FAILURE,
  GET_RESTAURANTS_CATEGORY_REQUEST,
  GET_RESTAURANTS_CATEGORY_SUCCESS,
  GET_RESTAURANTS_EVENTS_FAILURE,
  GET_RESTAURANTS_EVENTS_REQUEST,
  GET_RESTAURANTS_EVENTS_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_EVENTS_FAILURE,
  UPDATE_EVENTS_REQUEST,
  UPDATE_EVENTS_SUCCESS,
  UPDATE_RESTAURANT_FAILURE,
  UPDATE_RESTAURANT_REQUEST,
  UPDATE_RESTAURANT_STATUS_FAILURE,
  UPDATE_RESTAURANT_STATUS_REQUEST,
  UPDATE_RESTAURANT_STATUS_SUCCESS,
  UPDATE_RESTAURANT_SUCCESS,
} from "./ActionType";

export const getAllRestaurantsAction = (token) => async (dispatch) => {
  dispatch({ type: GET_ALL_RESTAURANT_REQUEST });
  try {
    const { data } = await api.get(`api/restaurants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: GET_ALL_RESTAURANT_SUCCESS, payload: data });
    console.log("all restaurant ", data);
  } catch (error) {
    console.log("error ", error);

    dispatch({ type: GET_ALL_RESTAURANT_FAILURE, payload: error });
  }
};

export const getRestaurantById = (restaurantId, jwt) => async (dispatch) => {
  dispatch({ type: GET_RESTAURANT_BY_ID_REQUEST });

  try {
    const { data } = await api.get(`/api/restaurants/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: GET_RESTAURANT_BY_ID_SUCCESS,
      payload: data,
    });

    console.log("restaurant:", data);
  } catch (error) {
    console.log("error:", error);

    dispatch({
      type: GET_RESTAURANT_BY_ID_FAILURE,
      payload: error,
    });
  }
};

export const getRestaurantByUserId = (jwt) => async (dispatch) => {
  dispatch({ type: GET_RESTAURANT_BY_USER_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/admin/restaurants/user`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_RESTAURANT_BY_USER_ID_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: GET_RESTAURANT_BY_USER_ID_FAILURE, payload: error });
    throw error;
  }
};

export const createRestaurant =
  (reqData) =>
  async (dispatch) => {
  dispatch({ type: CREATE_RESTAURANT_REQUEST });
  try {
    const { data } = await api.post(
      "/api/admin/restaurants",
      reqData.data,
      {
        headers: {
        Authorization: `Bearer ${reqData.jwt}`,
        },
      },
    );
    dispatch({ type: CREATE_RESTAURANT_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: CREATE_RESTAURANT_FAILURE, payload: error });
    throw error;
  }
};

export const updateRestaurant =
  ({ restaurantId, restaurantData, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_REQUEST });
    try {
      const { data } = await api.put(
        `api/admin/restaurants/${restaurantId}`,
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      dispatch({ type: UPDATE_RESTAURANT_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: UPDATE_RESTAURANT_FAILURE, payload: error });
      throw error;
    }
  };

export const deleteRestaurant =
  ({ restaurantId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_RESTAURANT_REQUEST });
    try {
      const { data } = await api.delete(
        `api/admin/restaurants/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      dispatch({ type: DELETE_RESTAURANT_SUCCESS, payload: restaurantId });
      return data;
    } catch (error) {
      dispatch({ type: DELETE_RESTAURANT_FAILURE, payload: error });
      throw error;
    }
  };

export const updateRestaurantStatus =
  ({ restaurantId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_RESTAURANT_STATUS_REQUEST });
    try {
      const { data } = await api.put(
        `api/admin/restaurants/${restaurantId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      dispatch({ type: UPDATE_RESTAURANT_STATUS_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: UPDATE_RESTAURANT_STATUS_FAILURE, payload: error });
      throw error;
    }
  };

export const createEventAction =
  ({ data, jwt, restaurantId }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_EVENTS_REQUEST });
    try {
      const { data: createdEvent } = await api.post(
        `api/admin/events/restaurants/${restaurantId}/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      dispatch({ type: CREATE_EVENTS_SUCCESS, payload: createdEvent });
      return createdEvent;
    } catch (error) {
      dispatch({ type: CREATE_EVENTS_FAILURE, payload: error });
      throw error;
    }
  };

export const getEvents = (jwt) => async (dispatch) => {
  dispatch({ type: GET_ALL_EVENTS_REQUEST });
  try {
    const { data } = await api.get(`api/events`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_ALL_EVENTS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: GET_ALL_EVENTS_FAILURE, payload: error });
    throw error;
  }
};

export const deleteEventAction =
  ({ eventId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_EVENTS_REQUEST });
    try {
      await api.delete(`api/admin/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: DELETE_EVENTS_SUCCESS, payload: eventId });
      return eventId;
    } catch (error) {
      dispatch({ type: DELETE_EVENTS_FAILURE, payload: error });
      throw error;
    }
  };

export const getRestaurantsEvents =
  ({ restaurantId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_RESTAURANTS_EVENTS_REQUEST });
    try {
      const { data } = await api.get(
        `api/admin/events/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      dispatch({ type: GET_RESTAURANTS_EVENTS_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: GET_RESTAURANTS_EVENTS_FAILURE, payload: error });
      throw error;
    }
  };

export const createCategoryAction =
  ({ reqData, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });
    try {
      const { data } = await api.post(`api/admin/category`, reqData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: CREATE_CATEGORY_FAILURE, payload: error });
      throw error;
    }
  };

export const getRestaurantCategory =
  ( jwt, restaurantId ) =>
  async (dispatch) => {
    dispatch({ type: GET_RESTAURANTS_CATEGORY_REQUEST });
    try {
      const { data }=await api.get(`/api/category/restaurant/${restaurantId}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      dispatch({ type: GET_RESTAURANTS_CATEGORY_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: GET_RESTAURANTS_CATEGORY_FAILURE, payload: error });
      throw error;
    }
  };

export const updateEventAction =
  ({ eventId, data, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_EVENTS_REQUEST });
    try {
      const { data: updatedEvent } = await api.put(
        `api/admin/events/${eventId}`,
        data,
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        },
      );
      dispatch({ type: UPDATE_EVENTS_SUCCESS, payload: updatedEvent });
      return updatedEvent;
    } catch (error) {
      dispatch({ type: UPDATE_EVENTS_FAILURE, payload: error });
      throw error;
    }
  };

export const updateCategoryAction =
  ({ categoryId, reqData, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });
    try {
      const { data } = await api.put(
        `api/admin/category/${categoryId}`,
        reqData,
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        },
      );
      dispatch({ type: UPDATE_CATEGORY_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: UPDATE_CATEGORY_FAILURE, payload: error });
      throw error;
    }
  };

export const deleteCategoryAction =
  ({ categoryId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_CATEGORY_REQUEST });
    try {
      await api.delete(`api/admin/category/${categoryId}`, {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
      dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: categoryId });
      return categoryId;
    } catch (error) {
      dispatch({ type: DELETE_CATEGORY_FAILURE, payload: error });
      throw error;
    }
  };
