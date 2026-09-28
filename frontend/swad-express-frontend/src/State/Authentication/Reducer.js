import { isPresentInFavorites } from "./../../components/config/logic";

import {
  ADD_TO_FAVORITE_FAILURE,
  ADD_TO_FAVORITE_REQUEST,
  ADD_TO_FAVORITE_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_OTP_SENT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from "./ActionType";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  jwt: typeof localStorage === "undefined" ? null : localStorage.getItem("jwt"),
  favorites: [],
  success: null,
};
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case ADD_TO_FAVORITE_REQUEST:
      return { ...state, isLoading: true, error: null, success: null };
    case REGISTER_OTP_SENT:
      return { ...state, isLoading: false, error: null, success: null };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        jwt: action.payload,
        success: action.type === LOGIN_SUCCESS
          ? "Login Successful"
          : "Account Created Successfully",
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        favorites: action.payload.favourites || [],
        error: null,
      };
    case ADD_TO_FAVORITE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        favorites: isPresentInFavorites(state.favorites, action.payload)
          ? state.favorites.filter((item) => item.id !== action.payload.id)
          : [action.payload, ...state.favorites],
      };
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
    case ADD_TO_FAVORITE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        success: null,
      };
    case LOGOUT:
      return {
        ...initialState,
        jwt: null,
        success: "Logout Successful",
      };
    case "AUTH_NOTICE_CLEARED":
      return {
        ...state,
        success: null,
      };

    default:
      return state;
  }
};
