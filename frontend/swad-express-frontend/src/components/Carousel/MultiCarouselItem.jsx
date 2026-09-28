import CarouselItem from "./CarouselItem";
import { topMeals } from "./TopMeal";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const MultiCarouselItem = ({ onCategorySelect }) => {
  return (
    <div className="w-full ">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={8}
        slidesPerView={5}
        mousewheel={{
          forceToAxis: true,
        }}
        autoplay={{
          delay: 747,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
      >
        {topMeals.map((item) => (
          <SwiperSlide key={item.title}>
            <CarouselItem
              title={item.title}
              image={item.image}
              onClick={() => onCategorySelect(item.title)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MultiCarouselItem;
