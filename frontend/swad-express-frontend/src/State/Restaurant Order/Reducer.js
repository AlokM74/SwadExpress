
import { GET_RESTAURANTS_ORDER_REQUEST, GET_RESTAURANTS_ORDER_SUCCESS, UPDATE_ORDER_STATUS_FAILURE, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS } from './ActionType';
import { GET_RESTAURANT_BY_ID_FAILURE } from './../Restaurant/ActionType';

const initialState={
    isLoading:false,
    error:null,
    orders:[]
}

export const restauranrsOrderReducer=(state=initialState,action)=>{
    switch(action.type){
        case GET_RESTAURANTS_ORDER_REQUEST:
        case UPDATE_ORDER_STATUS_REQUEST:
            return{
                ...state,
                isLoading:true,
                error:null
            }
        case GET_RESTAURANTS_ORDER_SUCCESS:
            return{
                ...state,
                isLoading:false,
                error:null,
                orders:action.payload
            }
        case UPDATE_ORDER_STATUS_SUCCESS:
            return{
                ...state,
                isLoading:false,
                error:null,
                orders:state.orders.map((order)=>order.id===action.payload.id?action.payload:order)
            }
        case GET_RESTAURANT_BY_ID_FAILURE:
        case UPDATE_ORDER_STATUS_FAILURE:
            return{
                ...state,
                isLoading:false,
                error:action.error
            }
        default :
        return state;
    }
}