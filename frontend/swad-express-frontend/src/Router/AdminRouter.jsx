import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, CircularProgress } from "@mui/material";
import { getRoleFromToken } from "./role";
import CreateRestaurantForm from "../AdminComponent/CreateRestaurantForm/CreateRestaurantForm";
import Admin from "../AdminComponent/Admin/Admin";
import { api } from "../components/config/api";
import { GET_RESTAURANT_BY_USER_ID_SUCCESS } from "../State/Restaurant/ActionType";
import { logout } from "../State/Authentication/Action";

const AdminRouter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const token = localStorage.getItem("jwt");
  const [hasRestaurant, setHasRestaurant] = useState(null);
  const [loadError, setLoadError] = useState("");

  const role =
    auth.user?.role ||
    localStorage.getItem("userRole") ||
    getRoleFromToken();

  useEffect(() => {
    if (!token || role !== "ROLE_RESTAURANT_OWNER") return undefined;
    let active = true;

    const loadRestaurant = async () => {
      setHasRestaurant(null);
      setLoadError("");
      try {
        const restaurantResponse = await api.get("/api/admin/restaurants/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (active) {
          dispatch({
            type: GET_RESTAURANT_BY_USER_ID_SUCCESS,
            payload: restaurantResponse.data,
          });
          setHasRestaurant(true);
        }
      } catch (error) {
        if (!active) return;
        if (error.response?.status === 404) {
          setHasRestaurant(false);
        } else {
          setLoadError(
            error.response?.data?.message ||
              "Unable to load your restaurant. Please try again.",
          );
        }
      }
    };

    loadRestaurant();
    return () => {
      active = false;
    };
  }, [dispatch, role, token]);

  if (!token) {
    return <Navigate to="/account/login" replace />;
  }

  if (role !== "ROLE_RESTAURANT_OWNER") {
    return <Navigate to="/" replace />;
  }

  if (loadError) {
    return (
      <Box
        sx={{
          display: "grid",
          minHeight: "100vh",
          placeItems: "center",
          bgcolor: "#0d0d0d",
        }}
      >
        <Button
          onClick={() => {
            dispatch(logout());
            localStorage.removeItem("jwt");
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            navigate("/account/login", { replace: true });
          }}
          sx={{ color: "#fff", bgcolor: "#7a1f1f" }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (hasRestaurant === null) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0d0d0d",
        }}
      >
        <CircularProgress sx={{ color: "#e91e63" }} />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/*"
        element={
          hasRestaurant ? (
            <Admin onRestaurantDeleted={() => setHasRestaurant(false)} />
          ) : (
            <CreateRestaurantForm
              onRestaurantCreated={() => setHasRestaurant(true)}
            />
          )
        }
      />
    </Routes>
  );
};

export default AdminRouter;