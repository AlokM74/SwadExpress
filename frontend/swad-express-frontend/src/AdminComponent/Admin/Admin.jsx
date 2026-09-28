import { Route, Routes } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Dashboard from "./../Dashboard/Dashboard";
import Orders from "./../Orders/Orders";
import Menu from "./../Menu/Menu";
import FoodCategory from './../FoodCategory/FoodCategory';
import Events from "./../Events/Events";
import RestaurantDetails from "./../Details/RestaurantDetails";
import IngredientsCategory from "../Ingredients/IngredientsCategory";
import IngredientsItem from "../Ingredients/IngredientsItem";


const Admin = ({ onRestaurantDeleted }) => {
  const handleClose = () => {};

  return (
    <div>
      <div className="lg:flex justify-between ">
        <div>
          <AdminSidebar handlClose={handleClose} />
        </div>

        <div className="lg:w-[84%]">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/category" element={<FoodCategory />} />
            <Route path="/ingredients_category" element={<IngredientsCategory/>}/>
            <Route path="/ingredients_item" element={<IngredientsItem />} />
            <Route path="/events" element={<Events />} />
            <Route
              path="/"
              element={<RestaurantDetails onRestaurantDeleted={onRestaurantDeleted} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;