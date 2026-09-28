import { Card, Chip, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorite } from "../../State/Authentication/Action";
import { isPresentInFavorites } from "../config/logic";
import { useNavigate } from "react-router-dom";
import { safeImageUrl } from "../config/media";

const RestaurantCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const jwt = localStorage.getItem("jwt");


  const { auth } = useSelector((store) => store);

  const favorites = auth?.user?.favourites || [];

  const isFavorite = isPresentInFavorites(favorites, item);

  const handleNavigateToRestaurant = () => {
  if (item.open) {
    navigate(`/restaurant/${item.id}`);
  }
};

  const handleAddToFavorite = () => {


    if (!jwt) return;

    dispatch(
      addToFavorite({
        jwt,
        restaurantId: item.id,
      })
    );
  };

  return (
    <Card
      className={`
        flex
        flex-col
        p-3!
        group
        w-62
        h-52
        min-w-62.5
        bg-[#181818]
        overflow-hidden
        rounded-2xl
        transition-all
        duration-300
        ${
          item.open
            ? "cursor-pointer hover:shadow-2xl"
            : "cursor-not-allowed opacity-70"
        }

      `}
      
    >
      <div className="relative overflow-hidden">
        <img
        onClick={handleNavigateToRestaurant}
          src={safeImageUrl(item.images?.[0])}
          alt={item.name}
          className={`
            w-full
            h-35
            object-cover
            ${item.open ? "" : "grayscale"}
          `}
        />

        <Chip
          size="small"
          label={item.open ? "Open" : "Closed"}
          color={item.open ? "success" : "error"}
          sx={{
            position: "absolute",
            top: "8px",
            left: "8px",
            height: "26px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        />
      </div>

      <div className="p-3 flex justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-white truncate">
            {item.name}
          </h2>

          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>

        <IconButton
          size="small"
          onClick={handleAddToFavorite}
          className="self-center"
        >
          {isFavorite ? (
            <FavoriteIcon
              sx={{
                color: "#ef4444",
              }}
              fontSize="small"
            />
          ) : (
            <FavoriteBorderIcon
              sx={{
                color: "#ffffff",
              }}
              fontSize="small"
            />
          )}
        </IconButton>
      </div>
    </Card>
  );
};

export default RestaurantCard;