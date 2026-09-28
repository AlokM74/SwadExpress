import { Route, Routes } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import CustomerRouter from "./CustomerRouter";

const Routers = () => {
  return (
    <Routes>
      <Route
        path="admin/restaurant/*"
        element={<AdminRouter />}
      />

      <Route
        path="/*"
        element={<CustomerRouter />}
      />
    </Routes>
  );
};

export default Routers;