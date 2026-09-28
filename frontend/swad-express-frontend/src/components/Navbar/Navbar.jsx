import { Search } from "@mui/icons-material";
import { Avatar, Badge, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import "./Navbar.css";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const searchRef = useRef(null);

  const { auth, cart } = useSelector((store) => store);
  const cartItems = cart?.cart?.cartItem || cart?.cartItems || [];
  const cartItemCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0,
  );
  const isLoggedIn = Boolean(auth.user || localStorage.getItem("jwt"));
  const isAuthPage = location.pathname.startsWith("/account/");

  const closeSearch = () => {
    setIsSearching(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const closeSearchOnOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        closeSearch();
      }
    };

    document.addEventListener("pointerdown", closeSearchOnOutsideClick);
    return () => {
      document.removeEventListener("pointerdown", closeSearchOnOutsideClick);
    };
  }, []);

  const handleAvatarClick = () => {
    closeSearch();
    if (auth.user?.role == "ROLE_CUSTOMER") {
      navigate("/my-profile/profile");
    } else {
      navigate("/admin/restaurant");
    }
  };

  return (
    <nav className="relative flex h-16 w-full items-center justify-between bg-[#3B111C] px-5! lg:px-8!">
      
      <div
        className="flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer"
        onClick={() => {
          closeSearch();
          navigate("/");
        }}
      >
        <img
          src="/src/assets/logo2.png"
          alt="Swad Express"
          className="sm:w-12 h-12 lg:w-14 lg:h-14 object-contain"
        />

        <h2 className="text-2xl font-bold">
          Swad<span className="text-red-400">Express</span>
        </h2>
      </div>

      
      <div className="flex items-center gap-4 lg:gap-6">
        
        {!isAuthPage && (
          <div ref={searchRef}>
            {!isSearching ? (
              <IconButton
                onClick={() => setIsSearching(true)}
                sx={{ color: "white", padding: "6px" }}
                aria-label="Open search"
              >
                <Search
                  sx={{
                    fontSize: {
                      sm: 24,
                      lg: 26,
                    },
                  }}
                />
              </IconButton>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const query = searchTerm.trim();
                  if (query) {
                    setSearchTerm("");
                    setIsSearching(false);
                    navigate(`/search?search=${encodeURIComponent(query)}`);
                  }
                }}
                className="absolute left-3 right-3 top-2 z-50 flex h-12 min-w-0 items-center rounded-xl border border-white/30 bg-white px-2! py-1! shadow-xl sm:static sm:h-auto sm:w-64 sm:flex-none lg:w-96"
              >
                <input
                  autoFocus
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search food"
                  className="min-w-0 flex-1 bg-transparent px-2! text-sm text-[#3B111C] outline-none placeholder:text-gray-500"
                />
                <IconButton
                  type="submit"
                  size="small"
                  sx={{ color: "#3B111C", padding: "4px" }}
                  aria-label="Search food"
                >
                  <Search fontSize="small" />
                </IconButton>
              </form>
            )}
          </div>
        )}
        
        <div>
          {auth.user ? (
            <Avatar
              onClick={handleAvatarClick}
              sx={{ bgcolor: "white", cursor: "pointer" }}
            >
              {auth.user?.fullName[0].toUpperCase()}
            </Avatar>
          ) : (
            <IconButton onClick={() => navigate("/account/login")}>
              <PersonIcon />
            </IconButton>
          )}
        </div>
        
        <IconButton
          onClick={() => {
            closeSearch();
            navigate(isLoggedIn ? "/cart" : "/account/login");
          }}
          sx={{
            color: "white",
            padding: "6px",
          }}
        >
          {isLoggedIn ? (
            <Badge
              badgeContent={cartItemCount}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "10px",
                  minWidth: "16px",
                  height: "16px",
                },
              }}
            >
              <AddShoppingCartOutlinedIcon
                sx={{
                  fontSize: {
                    sm: 25,
                    lg: 27,
                  },
                }}
              />
            </Badge>
          ) : (
            <AddShoppingCartOutlinedIcon
              sx={{
                fontSize: {
                  sm: 25,
                  lg: 27,
                },
              }}
            />
          )}
        </IconButton>
      </div>
    </nav>
  );
};

export default Navbar;
