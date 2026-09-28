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

const initialState = {
  menuItems: [],
  isLoading: false,
  error: null,
  search: [],
  message: null,
};

export const menuItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_MENU_ITEM_REQUEST:
    case GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST:
    case DELETE_MENU_ITEM_REQUEST:
    case SEARCH_MENU_ITEM_REQUEST:
    case UPDATE_MENU_ITEM_AVAILABILITY_REQUEST:
    case UPDATE_MENU_ITEM_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        message: null,
      };
    case CREATE_MENU_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        menuItems: [action.payload, ...state.menuItems],
        message: "Food Created Successfully",
      };
    case GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        menuItems: action.payload,
      };
    case DELETE_MENU_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        menuItems: state.menuItems.filter(
          (menuItem) => menuItem.id !== action.payload,
        ),
      };
    case UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS:
    case UPDATE_MENU_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        menuItems: state.menuItems.map((menuItem) =>
          menuItem.id === action.payload.id ? action.payload : menuItem,
        ),
      };
    case SEARCH_MENU_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        search: action.payload,
      };
    case CREATE_MENU_ITEM_FAILURE:
    case GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE:
    case DELETE_MENU_ITEM_FAILURE:
    case SEARCH_MENU_ITEM_FAILURE:
    case UPDATE_MENU_ITEM_AVAILABILITY_FAILURE:
    case UPDATE_MENU_ITEM_FAILURE:
        return{
            ...state,
            isLoading:false,
            error:action.payload,
            message:null
        };
    default :
        return state;
  }
};
