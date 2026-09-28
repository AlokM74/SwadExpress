import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { Avatar, Box, Button, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../State/Authentication/Action";

const menu = [
  {
    title: "Profile",
    icon: <PersonOutlineOutlinedIcon fontSize="small" />,
    color: "#42A5F5",
  },
  {
    title: "Orders",
    icon: <ShoppingBagOutlinedIcon fontSize="small" />,
    color: "#AB47BC",
  },
  {
    title: "Favorites",
    icon: <FavoriteBorderIcon fontSize="small" />,
    color: "#EC407A",
  },
  {
    title: "Addresses",
    icon: <LocationOnOutlinedIcon fontSize="small" />,
    color: "#26A69A",
  },
  {
    title: "Events",
    icon: <EventOutlinedIcon fontSize="small" />,
    color: "#7E57C2",
  },
   {
    title: "Help & Support",
    icon: <HelpOutlineOutlinedIcon fontSize="small" />,
    color: "#FFA726",
  }
];

const ProfileNavigation = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.auth.user);

  const displayName = user?.fullName || "Guest";
  const displayEmail = user?.email || "";

  const handleNavigate = (item) => {
    const path = item.title === "Help & Support" ? "support" : item.title.toLowerCase();
    navigate(`/my-profile/${path}`);
    onNavigate?.();
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
    onNavigate?.();
  };

  const isActive = (item) => {
    const path = item.title === "Help & Support" ? "support" : item.title.toLowerCase();
    return location.pathname === `/my-profile/${path}`;
  };

  return (
    <Box
      className="profile-scrollbar-hidden"
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#181818",
        overflowY: "auto",
      }}
    >
      <div className="flex min-h-full w-full flex-col">
        <div className="flex items-center gap-3 px-4! py-5!">
          <Avatar
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              backgroundColor: "#7a1f1f",
              color: "#fff",
              fontSize: "20px",
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold text-white">
              {displayName}
            </h2>

            <p className="truncate text-xs text-gray-400">{displayEmail}</p>
          </div>
        </div>

        <Divider sx={{ borderColor: "#292929" }} />

        <div className="w-full flex flex-col lg:gap-8 p-2!">
          {menu.map((item) => {
            const active = isActive(item);

            return (
              <Button
                key={item.title}
                type="button"
                fullWidth
                onClick={() => handleNavigate(item)}
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  textTransform: "none",
                  color: active ? "#fff" : "#bdbdbd",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 500,
                  minHeight: "48px",
                  px: 1.5,
                  py: 1,
                  mt: 0.5,
                  borderRadius: "8px",
                  gap: 1.25,
                  backgroundColor: active ? "#2a171b" : "transparent",
                  transition: "all 0.2s ease",

                  "&:hover": {
                    backgroundColor: active ? "#321820" : "#202020",
                  },
                }}
              >
                <span
                  className="flex w-8 shrink-0 items-center justify-center"
                  style={{
                    color: item.color,
                  }}
                >
                  {item.icon}
                </span>

                <span className="min-w-0 flex-1 text-left">{item.title}</span>
              </Button>
            );
          })}
        </div>

        <div className="mt-6!">
          <Divider sx={{ borderColor: "#292929" }} />

          <Button
            onClick={handleLogout}
            type="button"
            fullWidth
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              textTransform: "none",
              color: "#ef4444",
              fontSize: "14px",
              fontWeight: 500,
              minHeight: "48px",
              px: 1.5,
              py: 1,
              m: 1,
              width: "calc(100% - 16px)",
              borderRadius: "8px",
              gap: 1.25,
              transition: "all 0.2s ease",

              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#f87171",
              },
            }}
          >
            <span className="flex w-8 shrink-0 items-center justify-center">
              <LogoutOutlinedIcon fontSize="small" />
            </span>

            <span className="min-w-0 flex-1 text-left">Logout</span>
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default ProfileNavigation;
