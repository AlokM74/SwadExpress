const CarouselItem = ({ image, title, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center justify-center gap-1 cursor-pointer"
    >
      <img
        className="w-15 h-15 lg:h-40 lg:w-40 rounded-full object-cover object-center "
        src={image}
        alt=""
      />
      <span className="py-5 font-semibold text-xs lg:text-xl  text-gray-400">
        {title}
      </span>
    </button>
  );
};

export default CarouselItem;
