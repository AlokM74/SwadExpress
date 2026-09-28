import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../State/Cart/Action";
import { useNavigate } from "react-router-dom";
import { safeImageUrl } from "../config/media";

const MenuCard = ({ item }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const isAvailable = item.available;

  const handleCheckBoxChange = (ingredient) => {
    setSelectedIngredients((prev) => {
      const exists = prev.some(
        (selected) => selected.id === ingredient.id
      );

      if (exists) {
        return prev.filter(
          (selected) => selected.id !== ingredient.id
        );
      }

      return [...prev, ingredient];
    });
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
    <div className="w-full">
      <Accordion
        sx={{
          backgroundColor: "#181818",
          color: "white",
          borderRadius: "12px",
          overflow: "hidden",

          "&:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon className="text-gray-300" />
          }
          aria-controls={`panel-${item.id}-content`}
          id={`panel-${item.id}-header`}
          sx={{
            padding: "12px 16px",
            minHeight: "unset",

            "& .MuiAccordionSummary-content": {
              margin: 0,
            },

            "& .MuiAccordionSummary-content.Mui-expanded": {
              margin: 0,
            },
          }}
        >
          <div className="w-full flex flex-col sm:flex-row gap-4">

            <div
              className={`relative shrink-0 ${
                !isAvailable
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <img
                className={`
                  w-full
                  h-40
                  sm:w-32
                  sm:h-32
                  object-cover
                  rounded-lg
                  transition-all
                  duration-300
                  ${
                    !isAvailable
                      ? "grayscale opacity-70"
                      : "grayscale-0"
                  }
                `}
                src={safeImageUrl(item.images?.[0])}
                alt={item.name}
              />

              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
                  <span className="text-white font-bold text-xs sm:text-sm bg-black/70 px-3 py-1 rounded-md">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  title={item.vegetarian ? "Vegetarian" : "Non-vegetarian"}
                  aria-label={item.vegetarian ? "Vegetarian" : "Non-vegetarian"}
                  className={`flex h-5 w-5 items-center justify-center rounded-sm border-2 ${
                    item.vegetarian ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.vegetarian ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </span>
                <p className="font-semibold text-xl text-white">{item.name}</p>
              </div>

              <p className="font-semibold text-lg text-gray-200">
                ₹{item.price}
              </p>

              <p className="text-sm text-gray-400 max-w-2xl">
                {item.description}
              </p>
            </div>

          </div>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            borderTop: "1px solid #333",
            padding: "16px",
          }}
        >
          <div className="flex flex-col gap-5">

            {item.ingredients?.length > 0 && (
              <div>
                <p className="text-white font-semibold mb-3">
                  Ingredients
                </p>

                <FormGroup>
                  {item.ingredients.map((ingredient) => (
                    <FormControlLabel
                      key={ingredient.id}
                      control={
                        <Checkbox
                          checked={selectedIngredients.some(
                            (selected) =>
                              selected.id === ingredient.id
                          )}
                          disabled={
                            !ingredient.stoke || !isAvailable
                          }
                          onChange={() =>
                            handleCheckBoxChange(ingredient)
                          }
                          sx={{
                            color: "#9ca3af",

                            "&.Mui-checked": {
                              color: "#22c55e",
                            },

                            "&.Mui-disabled": {
                              color: "#4b5563",
                            },
                          }}
                        />
                      }
                      label={
                        <span
                          className={
                            ingredient.stoke && isAvailable
                              ? "text-gray-300"
                              : "text-gray-500 line-through"
                          }
                        >
                          {ingredient.name}

                          {!ingredient.stoke &&
                            " (Out of stock)"}
                        </span>
                      }
                    />
                  ))}
                </FormGroup>
              </div>
            )}

            {selectedIngredients.length > 0 && (
              <div className="text-sm text-gray-400">
                Selected:{" "}
                <span className="text-green-400">
                  {selectedIngredients
                    .map((ingredient) => ingredient.name)
                    .join(", ")}
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!isAvailable}
                onClick={handleAddToCart}
                className={`
                  h-9
                  min-w-30
                  px-4
                  flex
                  items-center
                  justify-center
                  gap-1
                  rounded-md
                  font-semibold
                  text-sm
                  transition
                  duration-200
                  ${
                    isAvailable
                      ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
                  }
                `}
              >
                {isAvailable && (
                  <AddIcon fontSize="small" />
                )}

                {isAvailable
                  ? "Add to Cart"
                  : "Out Of Stock"}
              </button>
            </div>

          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default MenuCard;