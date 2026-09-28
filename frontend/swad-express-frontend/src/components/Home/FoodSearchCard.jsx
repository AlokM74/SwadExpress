import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { addItemToCart } from "../../State/Cart/Action";
import { safeImageUrl } from "../config/media";

const FoodSearchCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const isAvailable = item.available !== false;

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((current) =>
      current.some((selected) => selected.id === ingredient.id)
        ? current.filter((selected) => selected.id !== ingredient.id)
        : [...current, ingredient],
    );
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        jwt: localStorage.getItem("jwt"),
        cartItem: {
          foodId: item.id,
          quantity: 1,
          ingredients: selectedIngredients.map((ingredient) => ingredient.name),
        },
      }),
    );
    navigate("/cart");
  };

  return (
    <Accordion
      sx={{
        width: "100%",
        bgcolor: "#181818",
        color: "#fff",
        border: "1px solid #2a2a2a",
        borderRadius: "16px !important",
        overflow: "hidden",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#d1d5db" }} />}
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1,
          "& .MuiAccordionSummary-content": { my: 0 },
        }}
      >
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <img
            src={safeImageUrl(item.images?.[0])}
            alt={item.name}
            className="lg:h-40 lg:w-40 rounded-xl object-cover h-32 w-40"
          />
          <div className="min-w-0 flex-1 py-1!">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-sm border-2 ${
                    item.vegetarian ? "border-green-500" : "border-red-500"
                  }`}
                  title={item.vegetarian ? "Vegetarian" : "Non-vegetarian"}
                >
                  <span className={`h-2 w-2 rounded-full ${item.vegetarian ? "bg-green-500" : "bg-red-500"}`} />
                </span>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              </div>
              <span className="text-lg font-bold text-green-400">₹{item.price}</span>
            </div>
            <p className="mt-1! text-sm text-gray-400">{item.description}</p>
            <p className="mt-3! text-sm font-medium text-gray-200">{item.restaurantName || "Restaurant"}</p>
            <p className="mt-1! text-sm text-gray-400">
              {[item.streetAddress, item.city].filter(Boolean).join(", ") || "Address unavailable"}
            </p>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{ borderTop: "1px solid #333", px: { xs: 2, sm: 3 }, py: 2 }}
        className="mt-5! py-5!"
      >
        {item.ingredients?.length > 0 && (
          <div className="mt-5! py-5!">
            <p className="mb-2 font-semibold text-white">Ingredients</p>
            <FormGroup>
              {item.ingredients.map((ingredient) => (
                <FormControlLabel
                  key={ingredient.id}
                  control={
                    <Checkbox
                      checked={selectedIngredients.some((selected) => selected.id === ingredient.id)}
                      disabled={!ingredient.stoke || !isAvailable}
                      onChange={() => toggleIngredient(ingredient)}
                      sx={{ color: "#9ca3af", "&.Mui-checked": { color: "#22c55e" } }}
                    />
                  }
                  label={
                    <span className={ingredient.stoke && isAvailable ? "text-gray-300" : "text-gray-500 line-through"}>
                      {ingredient.name}{!ingredient.stoke && " (Out of stock)"}
                    </span>
                  }
                />
              ))}
            </FormGroup>
          </div>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400">
            {selectedIngredients.length > 0
              ? `Selected: ${selectedIngredients.map((ingredient) => ingredient.name).join(", ")}`
              : "Choose ingredients if available"}
          </p>
          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleAddToCart}
            className={`flex h-10 items-center justify-center gap-1 rounded-lg px-4! text-sm font-semibold ${
              isAvailable ? "bg-green-600 text-white hover:bg-green-700" : "cursor-not-allowed bg-gray-600 text-gray-300 opacity-60"
            }`}
          >
            {isAvailable && <AddIcon fontSize="small" />}
            {isAvailable ? "Add to Cart" : "Out of stock"}
          </button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default FoodSearchCard;
