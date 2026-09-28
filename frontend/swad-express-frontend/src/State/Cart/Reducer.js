import {
  ADD_ITEM_TO_CART_SUCCESS,
  CLEAR_CART_SUCCESS,
  FIND_CART_FAILURE,
  FIND_CART_REQUEST,
  FIND_CART_SUCCESS,
  GET_ALL_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
} from "./ActionType";
import { LOGOUT } from "./../Authentication/ActionType";

const intialState = {
  cart: null,
  cartItems: [],
  isLoading: false,
  error: null,
};

export const cartReducer = (state = intialState, action) => {
  switch (action.type) {
    case FIND_CART_REQUEST:
    case GET_ALL_CART_ITEM_REQUEST:
    case UPDATE_CART_ITEM_REQUEST:
    case REMOVE_CART_ITEM_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FIND_CART_SUCCESS:
      {
        const cartItems = action.payload?.cartItem || action.payload?.items || [];

      return {
        ...state,
        isLoading: false,
        cart: action.payload,
        cartItems,
      };
      }
    case CLEAR_CART_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cart: null,
        cartItems: [],
      };
    case ADD_ITEM_TO_CART_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cartItems: [action.payload, ...(state.cartItems || [])],
        cart: state.cart
          ? {
              ...state.cart,
              cartItem: [action.payload, ...(state.cart.cartItem || [])],
            }
          : state.cart,
      };
    case UPDATE_CART_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cartItems: (state.cartItems || []).map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
        cart: state.cart
          ? {
              ...state.cart,
              cartItem: (state.cart.cartItem || []).map((item) =>
                item.id === action.payload.id ? action.payload : item,
              ),
            }
          : state.cart,
      };
    case REMOVE_CART_ITEM_SUCCESS:
      {
        const removedCart = action.payload;
        const cartItems = removedCart?.cartItem || (state.cartItems || []).filter(
          (item) => item.id !== removedCart,
        );

      return {
        ...state,
        isLoading: false,
        cart: removedCart?.cartItem ? removedCart : state.cart,
        cartItems,
      };
      }
    case FIND_CART_FAILURE:
    case UPDATE_CART_ITEM_FAILURE:
    case REMOVE_CART_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem("jwt");
      return {
        ...state,
        cartItems: [],
        cart: null,
        success: "logout success",
      };
    default:
      return state;
  }
};
