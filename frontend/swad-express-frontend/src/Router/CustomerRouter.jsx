import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { getRoleFromToken } from "./role";
import Navbar from './../components/Navbar/Navbar';
import Home from './../components/Home/Home';
import FoodSearchResults from './../components/Home/FoodSearchResults';
import LegalPage from './../components/Footer/LegalPage';
import RestaurantDetails from './../components/Restaurant/RestaurantDetails';
import Cart from './../components/Cart/Cart';
import Profile from './../components/Profile/Profile';
import Auth from './../Auth/Auth';
import Footer from './../components/Footer/Footer';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwt");

  return token ? children : <Navigate to="/account/login" replace />;
};

const RoleProtectedRoute = ({
  role,
  redirectTo,
  children,
}) => {
  const { auth } = useSelector((store) => store);

  const currentRole =
    auth.user?.role ||
    localStorage.getItem("userRole") ||
    getRoleFromToken();

  if (currentRole !== role) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

const CustomerRouter = () => {
  const location = useLocation();
  const { auth } = useSelector((store) => store);
  const role =
    auth.user?.role ||
    localStorage.getItem("userRole") ||
    getRoleFromToken();

  if (role === "ROLE_RESTAURANT_OWNER") {
    return <Navigate to="/admin/restaurant" replace />;
  }

  return (
    <div className="min-h-screen bg-[#181818]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/search"
          element={<FoodSearchResults />}
        />

        <Route
          path="/privacy"
          element={<LegalPage type="privacy" />}
        />

        <Route
          path="/terms"
          element={<LegalPage type="terms" />}
        />

        <Route
          path="/account/:register"
          element={<Home />}
        />

        <Route
          path="/restaurant/:city/:title/:id"
          element={<RestaurantDetails />}
        />

        <Route
          path="/restaurant/:restaurantId"
          element={<RestaurantDetails />}
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                role="ROLE_CUSTOMER"
                redirectTo="/admin/restaurant"
              >
                <Cart />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile/*"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute
                role="ROLE_CUSTOMER"
                redirectTo="/admin/restaurant"
              >
                <Profile />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      <Auth />

      {location.pathname === "/" && <Footer />}
    </div>
  );
};

export default CustomerRouter;