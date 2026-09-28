import { CREATE_CATEGORY_FAILURE, CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_EVENTS_FAILURE, CREATE_EVENTS_SUCCESS, CREATE_RESTAURANT_FAILURE, CREATE_RESTAURANT_REQUEST, CREATE_RESTAURANT_SUCCESS, DELETE_EVENTS_SUCCESS, DELETE_RESTAURANT_FAILURE, DELETE_RESTAURANT_REQUEST, DELETE_RESTAURANT_SUCCESS, GET_ALL_EVENTS_SUCCESS, GET_ALL_RESTAURANT_FAILURE, GET_ALL_RESTAURANT_REQUEST, GET_ALL_RESTAURANT_SUCCESS, GET_RESTAURANT_BY_ID_FAILURE, GET_RESTAURANT_BY_ID_REQUEST, GET_RESTAURANT_BY_ID_SUCCESS, GET_RESTAURANT_BY_USER_ID_FAILURE, GET_RESTAURANT_BY_USER_ID_REQUEST, GET_RESTAURANT_BY_USER_ID_SUCCESS, GET_RESTAURANTS_CATEGORY_FAILURE, GET_RESTAURANTS_CATEGORY_REQUEST, GET_RESTAURANTS_CATEGORY_SUCCESS, GET_RESTAURANTS_EVENTS_SUCCESS, UPDATE_RESTAURANT_FAILURE, UPDATE_RESTAURANT_REQUEST, UPDATE_RESTAURANT_STATUS_FAILURE, UPDATE_RESTAURANT_STATUS_REQUEST, UPDATE_RESTAURANT_STATUS_SUCCESS, UPDATE_RESTAURANT_SUCCESS } from './ActionType';
import {
    DELETE_CATEGORY_FAILURE,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    DELETE_EVENTS_FAILURE,
    DELETE_EVENTS_REQUEST,
    GET_ALL_EVENTS_FAILURE,
    GET_ALL_EVENTS_REQUEST,
    GET_RESTAURANTS_EVENTS_FAILURE,
    GET_RESTAURANTS_EVENTS_REQUEST,
    UPDATE_CATEGORY_FAILURE,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_EVENTS_FAILURE,
    UPDATE_EVENTS_REQUEST,
    UPDATE_EVENTS_SUCCESS,
} from "./ActionType";
const initialState={
    restaurants:[],
    userRestaurant:null,
    restaurant:null,
    isLoading:false,
    error:null,
    events:[],
    restaurantEvents:[],
    categories:[]
}

export const restaurantReducer=(state=initialState,action)=>{
    switch(action.type){
        case CREATE_RESTAURANT_REQUEST:
        case GET_ALL_RESTAURANT_REQUEST:
        case DELETE_RESTAURANT_REQUEST:
        case UPDATE_RESTAURANT_REQUEST:
        case GET_RESTAURANT_BY_ID_REQUEST:
        case GET_RESTAURANT_BY_USER_ID_REQUEST:
        case UPDATE_RESTAURANT_STATUS_REQUEST:
        case CREATE_CATEGORY_REQUEST:
        case GET_RESTAURANTS_CATEGORY_REQUEST:
        case GET_ALL_EVENTS_REQUEST:
        case GET_RESTAURANTS_EVENTS_REQUEST:
        case DELETE_EVENTS_REQUEST:
        case UPDATE_EVENTS_REQUEST:
        case UPDATE_CATEGORY_REQUEST:
        case DELETE_CATEGORY_REQUEST:
            return {
                ...state,
                isLoading:true,
                error:null
            };
        case CREATE_RESTAURANT_SUCCESS:
            return{
                ...state,
                isLoading:false,
                userRestaurant:action.payload
            };
        case GET_ALL_RESTAURANT_SUCCESS:
            return{
                ...state,
                isLoading:false,
                restaurants:action.payload
            };
        case GET_RESTAURANT_BY_ID_SUCCESS:
            return{
                ...state,
                isLoading:false,
                restaurant:action.payload
            };
        case GET_RESTAURANT_BY_USER_ID_SUCCESS:
        case UPDATE_RESTAURANT_SUCCESS:
        case UPDATE_RESTAURANT_STATUS_SUCCESS:
            return{
                ...state,
                isLoading:false,
                userRestaurant:action.payload
            };
        case DELETE_RESTAURANT_SUCCESS:
            return{
                ...state,
                error:null,
                isLoading:false,
                restaurants:state.restaurants.filter(
                    (item)=>item.id!==action.payload
                ),
                userRestaurant:null,
            };
        case CREATE_EVENTS_SUCCESS:
            return{
                ...state,
                isLoading:false,
                events:[...state.events,action.payload],
                restaurantEvents:[...state.restaurantEvents,action.payload]
            };
        case GET_ALL_EVENTS_SUCCESS:
            return{
                ...state,
                isLoading:false,
                events:action.payload
            };
        case GET_RESTAURANTS_EVENTS_SUCCESS:
            return{
                ...state,
                isLoading:false,
                restaurantEvents:action.payload
            };
        case UPDATE_EVENTS_SUCCESS:
            return{
                ...state,
                isLoading:false,
                events:state.events.map((item)=>item.id===action.payload.id?action.payload:item),
                restaurantEvents:state.restaurantEvents.map((item)=>item.id===action.payload.id?action.payload:item)
            };
        case DELETE_EVENTS_SUCCESS:
            return{
                ...state,
                isLoading:false,
                events:state.events.filter((item)=>item.id !== action.payload),
                restaurantEvents:state.restaurantEvents.filter((item)=>item.id !== action.payload)
            }
        case CREATE_CATEGORY_SUCCESS:
            return{
                ...state,
                isLoading:false,
                categories:[...state.categories,action.payload]
            };
        case UPDATE_CATEGORY_SUCCESS:
            return{
                ...state,
                isLoading:false,
                categories:state.categories.map((item)=>item.id===action.payload.id?action.payload:item)
            };
        case DELETE_CATEGORY_SUCCESS:
            return{
                ...state,
                isLoading:false,
                categories:state.categories.filter((item)=>item.id!==action.payload)
            };
        case GET_RESTAURANTS_CATEGORY_SUCCESS:
            return{
                ...state,
                isLoading:false,
                categories:action.payload
            };
        case CREATE_RESTAURANT_FAILURE:
        case GET_ALL_RESTAURANT_FAILURE:
        case DELETE_RESTAURANT_FAILURE:
        case UPDATE_RESTAURANT_FAILURE:
        case GET_RESTAURANT_BY_ID_FAILURE:
        case GET_RESTAURANT_BY_USER_ID_FAILURE:
        case UPDATE_RESTAURANT_STATUS_FAILURE:
        case CREATE_CATEGORY_FAILURE:
        case GET_RESTAURANTS_CATEGORY_FAILURE:
        case CREATE_EVENTS_FAILURE:
        case GET_ALL_EVENTS_FAILURE:
        case GET_RESTAURANTS_EVENTS_FAILURE:
        case DELETE_EVENTS_FAILURE:
        case UPDATE_EVENTS_FAILURE:
        case UPDATE_CATEGORY_FAILURE:
        case DELETE_CATEGORY_FAILURE:
            return{
                ...state,
                isLoading:false,
                error:action.payload
            };
        default:
            return state;
    }
}