import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from './State/Authentication/Action';
import { findCart } from './State/Cart/Action';
import AuthNotification from './components/config/AuthNotification';
import Routers from "./Router/Routers";

function App(){

  const dispatch=useDispatch();
  const jwt=localStorage.getItem("jwt")
  const {auth}=useSelector(store=>store)

 useEffect(() => {
  const token = auth?.jwt || jwt;

  if (token) {
    dispatch(getUser(token));
        dispatch(findCart(jwt))

  }
}, [auth?.jwt, dispatch,jwt]);

  return (
    <div>
      <Routers/>
      <AuthNotification />
    </div>
  )
}

export default App;