
import { GET_RESTAURANTS_ORDER_FAILURE, GET_RESTAURANTS_ORDER_REQUEST, GET_RESTAURANTS_ORDER_SUCCESS, UPDATE_ORDER_STATUS_FAILURE, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS } from './ActionType';
import { api } from './../../components/config/api';

export const updateOrderStatus= ({orderId,orderStatus,jwt})=>async (dispatch)=>{
    dispatch({type:UPDATE_ORDER_STATUS_REQUEST})
    try {
        const response=await api.put(`api/admin/orders/${orderId}/${orderStatus}`,{},{
            headers:{
                Authorization:`Bearer ${jwt}`
            }
        })
        dispatch({type:UPDATE_ORDER_STATUS_SUCCESS,payload:response.data})
        console.log("update status ",response.data);
        
    } catch (error) {
     console.log(error);
     dispatch({type:UPDATE_ORDER_STATUS_FAILURE,payload:error})
        
    }
}

export const fetchRestaurantOrder= ({restaurantId,orderStatus,jwt})=>async (dispatch)=>{
    dispatch({type:GET_RESTAURANTS_ORDER_REQUEST})
    try {
        const {data}=await api.put(`api/admin/order/restaurant/${restaurantId}`,{
            params:{
                order_status:orderStatus
            },
            headers:{
                Authorization:`Bearer ${jwt}`
            }
        })
        dispatch({type:GET_RESTAURANTS_ORDER_SUCCESS,payload:data})
        console.log("restaurant orders :",data);
        
    } catch (error) {
     console.log(error);
     dispatch({type:GET_RESTAURANTS_ORDER_FAILURE,payload:error})
        
    }
}
