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

const initialState = {
  ingredients: [],
  category: [],
  categories: [],
  isLoading: false,
  error: null,
};

export const ingredientReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INGREDIENTS_REQUEST:
    case GET_INGRREDIENT_CATEGORY_REQUEST:
    case CREATE_INGREDIENT_REQUEST:
    case CREATE_INGRREDIENT_CATEGORY_REQUEST:
    case UPDATE_INGREDIENT_REQUEST:
    case DELETE_INGREDIENT_REQUEST:
      return { ...state, isLoading: true, error: null };
    case GET_INGREDIENTS_SUCCESS:
      return { ...state, isLoading: false, error: null, ingredients: action.payload };
    case GET_INGRREDIENT_CATEGORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        category: action.payload,
        categories: action.payload,
      };
    case CREATE_INGRREDIENT_CATEGORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        category: [...state.category, action.payload],
        categories: [...state.categories, action.payload],
      };
    case CREATE_INGREDIENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ingredients: [action.payload, ...state.ingredients],
      };
    case UPDATE_INGREDIENT_SUCCESS:
    case UPDATE_STOCK:
      return {
        ...state,
        isLoading: false,
        ingredients: state.ingredients.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case DELETE_INGREDIENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ingredients: state.ingredients.filter((item) => item.id !== action.payload),
      };
    case GET_INGREDIENTS_FAILURE:
    case GET_INGRREDIENT_CATEGORY_FAILURE:
    case CREATE_INGREDIENT_FAILURE:
    case CREATE_INGRREDIENT_CATEGORY_FAILURE:
    case UPDATE_INGREDIENT_FAILURE:
    case DELETE_INGREDIENT_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};
