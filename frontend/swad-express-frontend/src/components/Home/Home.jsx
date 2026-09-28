import { useDispatch, useSelector } from "react-redux";
import MultiCarouselItem from "../Carousel/MultiCarouselItem";
import RestaurantCard from "../Restaurant/RestaurantCard";
import "./Home.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRestaurantsAction } from './../../State/Restaurant/Action';

const Home = () => {

  const dispatch=useDispatch();
  const jwt=localStorage.getItem("jwt");
  const {restaurant}=useSelector(store=>store)
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(getAllRestaurantsAction(jwt))
  },[dispatch,jwt])

  const handleCategorySelect = (category) => {
    navigate(`/search?search=${encodeURIComponent(category)}`);
  };

  const restaurants = restaurant?.restaurants || [];

  

  return (
    <div className="home ">
      <section className="banner z-50 relative flex flex-col justify-center items-center">
        <div className="w-[50w] z-10 text-center flex flex-col gap-4">
          <span className="text-2xl lg:text-6xl z-10 py-5! font-bold">
            Swad Express
          </span>
          <div className="flex flex-col ">
            <span className="z-10 text-amber-100 lg:text-3xl">
              Taste the Best, Delivered to You
            </span>
            <span className="z-10 text-amber-100 lg:text-3xl">
              Aapka favorite khana, ab aapke doorstep par.
            </span>
          </div>
        </div>

        <div className="cover absolute top-0 left-0 right-0"></div>
        <div className="fadeout"></div>
      </section>

      <section className="mt-7! pl-5! flex flex-col lg:gap-7 gap-2 lg:p carousel">
        <p className="text-xl lg:text-2xl font-semibold text-gray-3300">
          Explore our tranding dishes
        </p>
        <MultiCarouselItem onCategorySelect={handleCategorySelect} />
        <div className="flex gap-7"></div>
      </section>

       <section className="flex w-full flex-col gap-5! bg-black px-4! py-8! sm:px-6! lg:gap-7! lg:px-8!">
        <h2 className="mb-2! text-center text-xl font-bold text-gray-300 sm:text-2xl">
          Our All Restaurants
        </h2>

        {restaurants.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-5! pb-5! sm:gap-7!">
            {restaurants.map((item) => (
              <RestaurantCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#181818] px-4!">
            <p className="text-sm text-gray-400 sm:text-base">
              No Restaurants available. Please Login to see all the Restaurants
            </p>
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
