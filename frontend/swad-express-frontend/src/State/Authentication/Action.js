import {
  ADD_TO_FAVORITE_FAILURE,
  ADD_TO_FAVORITE_REQUEST,
  ADD_TO_FAVORITE_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
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
import { api } from "./../../components/config/api";
import { notify } from "../../components/config/notifications";

export const registerUser = (reqData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const { fullName, email, password, role } = reqData.userData;
    const { data } = await api.post("/auth/signup", {
      fullName,
      email,
      password,
      role,
      emailVerified: false,
    });
    dispatch({ type: REGISTER_OTP_SENT });
    return true;
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.message || error.response?.data || "Account creation failed",
    });
    return false;
  }
};

export const verifyRegistration = (reqData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await api.post("/auth/verify-registration", {
      email: reqData.email,
      otp: reqData.otp,
    });
    localStorage.setItem("jwt", data.jwt);
    localStorage.setItem("userRole", data.role);
    dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
    notify("Registration successful.", "success");
    reqData.navigate(
      data.role === "ROLE_RESTAURANT_OWNER"
        ? "/admin/restaurant"
        : "/my-profile/profile",
    );
    return true;
  } catch (error) {
    const responseData = error.response?.data;
    dispatch({
      type: REGISTER_FAILURE,
      payload:
        responseData?.message ||
        (typeof responseData === "string" ? responseData : null) ||
        "Unable to verify the OTP. Please try again.",
    });
    return false;
  }
};

export const loginUser = (reqData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await api.post(`/auth/login`, reqData.userData);
    if (data.jwt) localStorage.setItem("jwt", data.jwt);
    if (data.role) localStorage.setItem("userRole", data.role);
    dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
    notify("Login Successfully", "success");
    reqData.navigate(
      data.role === "ROLE_RESTAURANT_OWNER"
        ? "/admin/restaurant"
        : "/",
    );
  } catch (error) {
    const responseMessage = String(
      error.response?.data?.message || error.response?.data || "",
    );
    const message =
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      responseMessage.toLowerCase().includes("forbidden")
        ? "Your Email or Password is Wrong"
        : responseMessage || "Your Email or Password is Wrong";
    dispatch({
      type: LOGIN_FAILURE,
      payload: message,
    });
  }
};

export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    const { data } = await api.get(`/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USER_FAILURE, payload: error });
  }
};

export const addToFavorite =
  ({ jwt, restaurantId }) =>
  async (dispatch) => {
    dispatch({ type: ADD_TO_FAVORITE_REQUEST });

    try {
      const { data } = await api.put(
        `/api/restaurants/${restaurantId}/add-to-fav`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      dispatch({
        type: ADD_TO_FAVORITE_SUCCESS,
        payload: data,
      });

      dispatch(getUser(jwt));
    } catch (error) {
      dispatch({
        type: ADD_TO_FAVORITE_FAILURE,
        payload: error,
      });
    }
  };
export const logout = () => async (dispatch) => {
  try {
    localStorage.clear();
    dispatch({ type: LOGOUT, payload: "logout success" });
    notify("Logout Successfully", "success");
  } catch (error) {
  }
};
