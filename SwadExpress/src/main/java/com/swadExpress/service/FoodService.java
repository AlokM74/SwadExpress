package com.swadExpress.service;

import com.swadExpress.entity.Category;
import com.swadExpress.entity.Food;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.request.CreateFoodRequest;

import java.util.List;

public interface FoodService {

    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant) throws Exception;

    void deleteFood(Long foodId, Long restaurantId) throws Exception;

    public List<Food> getRestaurantFoods(Long restaurantId,
                                         boolean isVegetarian,
                                         boolean isNonveg,
                                         boolean isSessional,
                                         String foodCategory) throws Exception;

    public List<Food> searchFood(String keyword);

    public Food findFoodById(Long foodId) throws Exception;

    public Food updateAvailabilityStatus(Long foodId, Long restaurantId) throws Exception;

    public Food updateFoodDetails(Long foodId, CreateFoodRequest req, Restaurant restaurant) throws Exception;
}
