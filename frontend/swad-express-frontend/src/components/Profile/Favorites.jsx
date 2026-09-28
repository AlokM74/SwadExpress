import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Card,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { useDispatch, useSelector } from "react-redux";

import { addToFavorite } from "../../State/Authentication/Action";
import { isPresentInFavorites } from "../config/logic";
import { safeImageUrl } from "../config/media";
import { useNavigate } from "react-router-dom";

const ACCENT = "#7a1f1f";
const BG = "#0e0e0e";
const CARD_BG = "#181818";
const BORDER = "#2a2a2a";

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwt");

  const { auth } = useSelector((store) => store);
  const favorites = auth?.favorites || [];

  const [query, setQuery] = useState("");
  const handleAddToFavorite = (restaurant) => {
    if (!jwt) return;

    dispatch(
      addToFavorite({
        jwt,
        restaurantId: restaurant.id,
      }),
    );
  };

  const openRestaurant = (restaurant) => {
    navigate(`/restaurant/${restaurant.id}`);
  };
  const filteredFavorites = favorites.filter((restaurant) => {
    const search = query.toLowerCase().trim();

    if (!search) return true;

    return (
      restaurant.title?.toLowerCase().includes(search) ||
      restaurant.name?.toLowerCase().includes(search) ||
      restaurant.description?.toLowerCase().includes(search)
    );
  });

  return (
    <Box
      className="profile-scrollbar-hidden"
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        bgcolor: BG,
        color: "#fff",
        px: {
          xs: 2,
          sm: 4,
          md: 6,
        },
        py: {
          xs: 3,
          sm: 5,
        },
      }}
    >
      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: {
                xs: 20,
                sm: 26,
              },
              fontWeight: 600,
              color: "#fff",
            }}
          >
            <FavoriteBorderIcon sx={{ color: "#EF5350" }} />
            <span>Favorites</span>
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "#777",
              mt: 0.5,
            }}
          >
            Restaurants you love
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 13,
            color: "#aaa",
          }}
        >
          {favorites.length}{" "}
          {favorites.length === 1 ? "restaurant" : "restaurants"}
        </Typography>
      </Box>

      
      {favorites.length > 0 && (
        <TextField
          fullWidth
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your favourite restaurants..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon
                    sx={{
                      color: "#777",
                      fontSize: 21,
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 4,

            "& .MuiOutlinedInput-root": {
              bgcolor: "#161616",
              color: "#fff",
              borderRadius: 2,
              height: 48,

              "& fieldset": {
                borderColor: BORDER,
              },

              "&:hover fieldset": {
                borderColor: "#444",
              },

              "&.Mui-focused fieldset": {
                borderColor: ACCENT,
              },
            },

            "& input::placeholder": {
              color: "#777",
              opacity: 1,
            },
          }}
        />
      )}

      
      {filteredFavorites.length > 0 ? (
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
              lg: "1fr 1fr 1fr",
            },

            gap: 2.5,
          }}
        >
          {filteredFavorites.map((item) => {
            const isFavorite = isPresentInFavorites(favorites, item);

            return (
              <Card
                key={item.id}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  transition-all
                  duration-300
                "
                sx={{
                  bgcolor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  cursor: "pointer",

                  "&:hover": {
                    borderColor: ACCENT,
                    boxShadow: "0 10px 35px rgba(0,0,0,0.4)",
                  },
                }}
                onClick={() => openRestaurant(item)}
              >
                
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={safeImageUrl(item.images?.[0])}
                    alt={item.title || item.name}
                    className="
                      w-full
                      h-48
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAddToFavorite(item);
                    }}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,

                      width: 40,
                      height: 40,

                      bgcolor: "rgba(0,0,0,0.65)",

                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.9)",
                      },
                    }}
                  >
                    {isFavorite ? (
                      <FavoriteIcon
                        sx={{
                          color: "#ef4444",
                          fontSize: 23,
                        }}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{
                          color: "#fff",
                          fontSize: 23,
                        }}
                      />
                    )}
                  </IconButton>
                </Box>

                
                <Box
                  sx={{
                    p: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#fff",

                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title || item.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#888",
                      mt: 1,

                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",

                      minHeight: 38,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Card>
            );
          })}
        </Box>
      ) : (
<Box
          sx={{
            border: `1px dashed ${BORDER}`,
            borderRadius: 3,

            py: 10,

            textAlign: "center",
          }}
        >
          <FavoriteBorderIcon
            sx={{
              fontSize: 55,
              color: "#444",
              mb: 1.5,
            }}
          />

          <Typography
            sx={{
              fontSize: 17,
              color: "#aaa",
            }}
          >
            {favorites.length === 0
              ? "No favourite restaurants yet"
              : "No restaurants found"}
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "#666",
              mt: 0.7,
            }}
          >
            {favorites.length === 0
              ? "Restaurants you save will appear here"
              : "Try a different search term"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Favorites;
