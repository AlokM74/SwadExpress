import { useState } from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import CategoryIcon from "@mui/icons-material/Category";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FoodBankIcon from "@mui/icons-material/FoodBank";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../State/Authentication/Action";
import { Divider } from "@mui/material";

const menu = [
  {
    title: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    path: "/dashboard",
    color: "#42A5F5",
  },
  {
    title: "Orders",
    icon: <ShoppingBagOutlinedIcon fontSize="small" />,
    path: "/orders",
    color: "#AB47BC",
  },
  {
    title: "Menu",
    icon: <RestaurantMenuIcon fontSize="small" />,
    path: "/menu",
    color: "#FF7043",
  },
  {
    title: "Food Category",
    icon: <CategoryIcon fontSize="small" />,
    path: "/category",
    color: "#26A69A",
  },
  {
    title: "Ingredient Category",
    icon: <FoodBankIcon fontSize="medium" />,
    path: "/ingredients_category",
    color: "#00ACC1",
  },
  {
    title: "Ingredients Item",
    icon: <FastfoodIcon fontSize="small" />,
    path: "/ingredients_item",
    color: "#FFA726",
  },
  {
    title: "Events",
    icon: <EventOutlinedIcon fontSize="small" />,
    path: "/events",
    color: "#EC407A",
  },
  {
    title: "Details",
    icon: <AdminPanelSettingsIcon fontSize="small" />,
    path: "/",
    color: "#7E57C2",
  },
];

const SIDEBAR_WIDTH = 240;

const AdminSidebar = ({ handlClose }) => {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      dispatch(logout());
      navigate("/");
      setMobileOpen(false);
      handlClose?.();
      return;
    }

    navigate(`/admin/restaurant${item.path}`);

    if (isSmallScreen) {
      setMobileOpen(false);
      handlClose?.();
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col py-6!">
      
      <div className="flex items-center justify-between px-6! pb-6!">
        <div>
          <h1 className="text-lg font-bold text-white">
            Swad<span className="text-red-400">Express</span>
          </h1>

          <p className="mt-0.5! text-xs text-gray-500">Admin Panel</p>
        </div>
      

        
        {isSmallScreen && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              width: 36,
              height: 36,
              color: "#aaa",
              border: "1px solid #333",
              borderRadius: "10px",
              "&:hover": {
                color: "#fff",
                backgroundColor: "#ffffff10",
              },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <Divider/>

      
      <nav className="flex flex-col lg:gap-6  px-3! pt-4!">
        {menu.map((item) => {
          const fullPath = `/admin/restaurant/${item.path}`;
          const isActive = location.pathname === fullPath;

          return (
            <div
              key={item.title}
              id={item}
              onClick={() => handleNavigate(item)}
              className={`flex cursor-pointer items-center gap-3! rounded-xl px-3! py-3! text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                style={{ color: item.color }}
                className="flex items-center justify-center"
              >
                {item.icon}
              </span>

              <span>{item.title}</span>
            </div>
          );
        })}
      </nav>

      
      <div className="mt-2! border-t! border-[#262626] px-3! pt-4!">
        <div
          onClick={() => handleNavigate({ title: "Logout" })}
          className="flex cursor-pointer items-center gap-3! rounded-xl px-3! py-3! text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogoutOutlinedIcon fontSize="small" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isSmallScreen && (
        <div className="sticky top-0 z-1100 flex items-center justify-between border-b border-[#262626] bg-[#161616] px-4! py-3!">
          <div className="flex items-center gap-3">
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                width: 38,
                height: 38,
                color: "#fff",
                backgroundColor: "#1c1c1c",
                border: "1px solid #333",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#252525",
                },
              }}
            >
              <MenuRoundedIcon fontSize="small" />
            </IconButton>

            <span className="text-base font-bold text-white">
              Swad<span className="text-red-400">Express</span>
            </span>
          </div>
        </div>
      )}

      
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={isSmallScreen ? mobileOpen : true}
        onClose={handleDrawerToggle}
        anchor="left"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          zIndex: 1200,
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "#161616",
            color: "#fff",
            borderRight: "1px solid #262626",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default AdminSidebar;
