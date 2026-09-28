import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Radio from "@mui/material/Radio";

import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getRestaurantById,
  getRestaurantCategory,
} from "../../State/Restaurant/Action";
import { getMenuItemsByRestaurantId } from "../../State/Menu/Action";
import { safeImageUrl } from "../config/media";

const foodTypes = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Vegetarian only",
    value: "vegetarian",
  },
  {
    label: "Non-Vegetarian",
    value: "non_vegetarian",
  },
  {
    label: "Seasonal",
    value: "sessional",
  },
];

const RestaurantDetails = () => {
  const [foodType, setFoodType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const restaurant = useSelector((store) => store.restaurant);
  const menu = useSelector((store) => store.menu);
  const { restaurantId } = useParams();

  const restaurantData = restaurant?.restaurant;
  const categories = restaurant?.categories;
  const menuItems = (menu?.menuItems || []).filter((item) => {
    if (!selectedCategory) return true;

    const categoryName = item.foodCategory?.name?.trim().toLowerCase();
    const selectedCategoryName = selectedCategory.trim().toLowerCase();

    return (
      categoryName === selectedCategoryName ||
      (!categoryName &&
        item.name?.toLowerCase().includes(selectedCategoryName))
    );
  });

  const handleFilter = (e) => {
    setFoodType(e.target.value);
  };

  const handleFilterCategory = (e) => {
    setSelectedCategory(e.target.value);
  };
  useEffect(() => {
    if (restaurantId) {
      dispatch(getRestaurantById(restaurantId, jwt));
      dispatch(getRestaurantCategory(jwt, restaurantId));
    }
  }, [dispatch, restaurantId, jwt]);

  useEffect(() => {
    dispatch(
      getMenuItemsByRestaurantId({
        restaurantId,
        jwt,
        vegetarian: foodType === "vegetarian",
        nonveg: foodType === "non_vegetarian",
        sessional: foodType === "sessional",
        foodCategory: selectedCategory,
      }),
    );
  }, [dispatch, selectedCategory, foodType, jwt, restaurantId]);

  const capitalizeCategory = (name) => {
    if (!name) return "";

    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4! sm:px-6! lg:px-10! xl:px-16! py-5!">
      <section className="max-w-7xl mx-auto py-5">
        <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-400 font-semibold mb-5!">
          Restaurant Details
        </h3>

        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <img
              src={safeImageUrl(restaurantData?.images?.[0])}
              alt={restaurantData?.name || "Restaurant"}
              className="w-full h-52 sm:h-60 md:h-64 lg:h-72 xl:h-80 object-cover rounded-xl"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <img
              src={safeImageUrl(restaurantData?.images?.[1] || restaurantData?.images?.[0])}
              alt={restaurantData?.name || "Restaurant"}
              className="w-full h-52 sm:h-60 md:h-64 lg:h-72 xl:h-80 object-cover rounded-xl"
            />
          </Grid>
        </Grid>

        <div className="pt-5! pb-5! flex flex-col gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-200">
            {restaurantData?.name}
          </h1>
          
          <div className="flex items-start gap-2 text-gray-400">
            <DescriptionOutlinedIcon sx={{color:"AccentColor"}}/>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-4xl">
            {restaurantData?.description}
          </p>
          </div>

          <div className="flex items-start gap-2 text-gray-400">
            <LocationOnIcon className="mt-0.5" sx={{color:"red"}} />

            <span className="text-sm sm:text-base lg:text-lg">
              {restaurantData?.address?.streetAddress}

              {restaurantData?.address?.city && (
                <> , {restaurantData.address.city}</>
              )}

              {restaurantData?.address?.stateProvince && (
                <> , {restaurantData.address.stateProvince}</>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <CalendarTodayIcon  sx={{color:"blue"}}/>

            <span className="text-sm sm:text-base lg:text-lg">
              {restaurantData?.openingHours}
            </span>
          </div>
        </div>
      </section>

      <Divider />

      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row pt-5!">
        <div className="w-full lg:w-[22%] p-3! sm:p-5!">
          <div className="lg:sticky lg:top-24 shadow-md rounded-xl p-4! sm:p-5! bg-[#151515]">
            <div>
              <Typography
                variant="h6"
                sx={{
                  paddingBottom: "1rem",
                }}
              >
                Food Type
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  name="food_type"
                  value={foodType}
                  onChange={handleFilter}
                  className="grid grid-cols-2 gap-x-2 sm:grid-cols-4 lg:grid-cols-1"
                >
                  {foodTypes.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      control={<Radio />}
                      label={item.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>

            <Divider sx={{ my: 3 }} />
            <div>
              <Typography
                variant="h6"
                sx={{
                  paddingBottom: "1rem",
                }}
              >
                Food Category
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  name="category_type"
                  value={selectedCategory}
                  onChange={handleFilterCategory}
                  className="grid grid-cols-2 gap-x-2 sm:grid-cols-4 lg:grid-cols-1"
                >
                  <FormControlLabel
                    value=""
                    control={<Radio />}
                    label="All"
                  />
                  {categories?.map((item) => (
                    <FormControlLabel
                      key={item.id}
                      value={item.name}
                      control={<Radio />}
                      label={capitalizeCategory(item.name)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[78%] px-3! sm:px-5! lg:pl-8! flex flex-col gap-5">
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => (
              <MenuCard key={index} item={item} />
            ))
          ) : (
            <Typography
              variant="h6"
              className="py-10! text-center text-gray-400"
            >
              {selectedCategory
                ? `${capitalizeCategory(selectedCategory)} is unavailable`
                : "No menu items available"}
            </Typography>
          )}
        </div>
      </section>
    </div>
  );
};

export default RestaurantDetails;
