import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { searchMenuItem } from "../../State/Menu/Action";
import FoodSearchCard from "./FoodSearchCard";

const FoodSearchResults = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("search")?.trim() || "";
  const jwt = localStorage.getItem("jwt");

  const { menu } = useSelector((store) => store);

  const [foodType, setFoodType] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");

  useEffect(() => {
    if (keyword) {
      dispatch(searchMenuItem({ keyword, jwt }));
    }
  }, [dispatch, keyword, jwt]);

  const filteredItems = useMemo(() => {
    return (menu?.search || []).filter((item) => {
      const matchesType =
        foodType === "all" ||
        (foodType === "veg" && item.vegetarian) ||
        (foodType === "nonveg" && !item.vegetarian);

      const matchesPrice =
        maxPrice === "all" ||
        Number(item.price) <= Number(maxPrice);

      return matchesType && matchesPrice;
    });
  }, [foodType, maxPrice, menu?.search]);

  const clearFilters = () => {
    setFoodType("all");
    setMaxPrice("all");
  };

  return (
    <main className="mt-5! min-h-[calc(100vh-4rem)] w-full bg-[#0f0f0f] px-3! py-6! text-white sm:px-5! sm:py-8! lg:px-10! xl:px-16!">
      <div className="mx-auto w-full max-w-7xl">

        <section className="rounded-2xl border border-[#3b2026] bg-linear-to-br from-[#32111b] via-[#181818] to-[#121212] p-4! shadow-2xl sm:rounded-3xl sm:p-6! md:p-8!">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-red-300 sm:text-sm sm:tracking-[0.2em]">
            Discover your next meal
          </p>

          <h1 className="mt-2! wrap-break-words text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Search results for{" "}
            <span className="text-red-300">
              "{keyword}"
            </span>
          </h1>

          <p className="mt-2! max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            Find the perfect dish by food type and budget.
          </p>
        </section>

        <div className="mt-5! grid grid-cols-1 gap-4! sm:gap-5! lg:grid-cols-[220px_minmax(0,1fr)]">

          <aside className="h-fit rounded-2xl border border-[#2a2a2a] bg-[#181818] p-4! lg:sticky lg:top-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Filters
              </h2>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-red-300 transition hover:text-red-200"
              >
                Clear
              </button>
            </div>

            <div className="mt-4! grid grid-cols-1 gap-4! sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <label
                  htmlFor="food-type"
                  className="block text-sm text-gray-400"
                >
                  Food type
                </label>

                <select
                  id="food-type"
                  value={foodType}
                  onChange={(event) => setFoodType(event.target.value)}
                  className="mt-2! w-full rounded-xl border border-[#3f3f46] bg-[#242424] px-3! py-2.5! text-sm text-white outline-none transition focus:border-red-400"
                >
                  <option value="all">All food</option>
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-vegetarian</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="max-price"
                  className="block text-sm text-gray-400"
                >
                  Maximum price
                </label>

                <select
                  id="max-price"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  className="mt-2! w-full rounded-xl border border-[#3f3f46] bg-[#242424] px-3! py-2.5! text-sm text-white outline-none transition focus:border-red-400"
                >
                  <option value="all">Any price</option>
                  <option value="100">Up to ₹100</option>
                  <option value="200">Up to ₹200</option>
                  <option value="300">Up to ₹300</option>
                  <option value="500">Up to ₹500</option>
                </select>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-4! flex flex-wrap items-center justify-between gap-2!">
              <p className="text-sm text-gray-400">
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "item" : "items"} found
              </p>

              {menu?.isLoading && (
                <span className="text-sm text-red-300">
                  Loading...
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3! sm:gap-4!">
              {menu?.error ? null : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <FoodSearchCard
                    key={item.id}
                    item={item}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-[#2a2a2a] bg-[#181818] px-4! py-12! text-center sm:py-16!">
                  <p className="text-sm text-gray-400 sm:text-base">
                    No matching food items found.
                  </p>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default FoodSearchResults;