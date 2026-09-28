import {
  GET_USERS_ORDERS_REQUEST,
  GET_USERS_ORDERS_SUCCESS,
  GET_USERS_ORDERS_FAILURE,
  GET_RESTAURANT_ORDERS_REQUEST,
  GET_RESTAURANT_ORDERS_SUCCESS,
  GET_RESTAURANT_ORDERS_FAILURE,
  UPDATE_RESTAURANT_ORDER_REQUEST,
  UPDATE_RESTAURANT_ORDER_SUCCESS,
  UPDATE_RESTAURANT_ORDER_FAILURE,
} from "./ActionType";

const initialState = {
  isLoading: false,
  orders: [],
  restaurantOrders: [],
  error: null,
};
export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS_ORDERS_REQUEST:
    case GET_RESTAURANT_ORDERS_REQUEST:
    case UPDATE_RESTAURANT_ORDER_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    case GET_USERS_ORDERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        orders: action.payload,
      };
    case GET_RESTAURANT_ORDERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        restaurantOrders: action.payload,
      };
    case UPDATE_RESTAURANT_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        restaurantOrders: state.restaurantOrders.map((order) =>
          order.id === action.payload.id ? action.payload : order,
        ),
      };
    case GET_USERS_ORDERS_FAILURE:
    case GET_RESTAURANT_ORDERS_FAILURE:
    case UPDATE_RESTAURANT_ORDER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
        return state;
  }
};
