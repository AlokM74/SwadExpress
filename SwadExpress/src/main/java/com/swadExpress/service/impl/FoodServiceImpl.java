package com.swadExpress.service.impl;

import com.swadExpress.entity.Category;
import com.swadExpress.entity.Food;
import com.swadExpress.entity.IngredientsItem;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.CategoryRepository;
import com.swadExpress.repository.FoodRepository;
import com.swadExpress.repository.IngredientItemRepository;
import com.swadExpress.request.CreateFoodRequest;
import com.swadExpress.request.FoodIngredientRequest;
import com.swadExpress.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private IngredientItemRepository ingredientItemRepository;

    @Override
    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant) throws Exception {

        Food food = new Food();
        food.setName(req.getName());
        food.setFoodCategory(resolveCategory(category, restaurant));
        food.setRestaurant(restaurant);
        food.setPrice(req.getPrice());
        food.setDescription(req.getDescription());
        food.setImages(req.getImages() == null ? List.of() : req.getImages());
        food.setIngredients(resolveIngredients(req.getIngredients(), restaurant));
        food.setSessional(Boolean.TRUE.equals(req.getSeasonal()));
        food.setVegetarian(Boolean.TRUE.equals(req.getVegetarian()));
        food.setCreationDate(new Date());



        Food  savedFood = foodRepository.save(food);

        restaurant.getFoods().add(savedFood);

        return savedFood;
    }

    @Override
    public void deleteFood(Long foodId, Long restaurantId) throws Exception {

        Food food = findOwnedFood(foodId, restaurantId);
        foodRepository.delete(food);

    }

    @Override
    public List<Food> getRestaurantFoods(Long restaurantId,
                                         boolean isVegetarian,
                                         boolean isNonveg,
                                         boolean isSessional,
                                         String foodCategory) throws Exception {

        List<Food> foods=foodRepository.findByRestaurantId(restaurantId);

        if(isVegetarian){
            foods=filterByVegetarian(foods,isVegetarian);
        }
        if(isNonveg){
            foods=filterByNonveg(foods,isNonveg);
        }
        if(isSessional){
            foods=filterBySessional(foods,isSessional);
        }
        if(foodCategory!=null && !foodCategory.equals("")){
            foods=filterByCategory(foods,foodCategory);
        }

        return foods;
    }

    @Override
    public List<Food> searchFood(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return List.of();
        }
        String normalizedKeyword = keyword.trim().toLowerCase();
        if (normalizedKeyword.startsWith("biry")
                || normalizedKeyword.startsWith("biriyani")
                || normalizedKeyword.startsWith("biriani")) {
            return foodRepository.searchBiryaniVariants();
        }
        return foodRepository.searchFood(keyword.trim());
    }

    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {
        return foods.stream().filter(food -> {
            if(food.getFoodCategory()!=null){
                return food.getFoodCategory().getName().equalsIgnoreCase(foodCategory);
            }
            else return false;
        }).collect(Collectors.toList());
    }

    private List<Food> filterBySessional(List<Food> foods, boolean isSessional) {
        return foods.stream().filter(food ->food.isSessional()==isSessional).collect(Collectors.toList());
    }

    private List<Food> filterByNonveg(List<Food> foods, boolean isNonveg) {

        return foods.stream().filter(food->food.isVegetarian()==false).collect(Collectors.toList());

    }


    private List<Food> filterByVegetarian(List<Food> foods, boolean isVegetarian) {

        return foods.stream().filter(food->food.isVegetarian()==isVegetarian).collect(Collectors.toList());
    }

    @Override
    public Food findFoodById(Long foodId) throws Exception {

        Optional<Food> optionalFood=foodRepository.findById(foodId);

        if(optionalFood.isEmpty()){
            throw new ApiException(HttpStatus.NOT_FOUND, "The menu item could not be found.");
        }
        return optionalFood.get();
    }

    @Override
    public Food updateAvailabilityStatus(Long foodId, Long restaurantId) throws Exception {

        Food food = findOwnedFood(foodId, restaurantId);
        food.setAvailable(!food.isAvailable());

        return foodRepository.save(food);

    }

    @Override
    public Food updateFoodDetails(Long foodId, CreateFoodRequest req, Restaurant restaurant) throws Exception {
        Food food = findOwnedFood(foodId, restaurant.getId());
        food.setName(req.getName());
        food.setDescription(req.getDescription());
        food.setPrice(req.getPrice());
        food.setFoodCategory(resolveCategory(req.getCategory(), restaurant));
        food.setImages(req.getImages() == null ? List.of() : req.getImages());
        food.setIngredients(resolveIngredients(req.getIngredients(), restaurant));
        food.setVegetarian(Boolean.TRUE.equals(req.getVegetarian()));
        food.setSessional(Boolean.TRUE.equals(req.getSeasonal()));

        return foodRepository.save(food);
    }

    private Food findOwnedFood(Long foodId, Long restaurantId) throws Exception {
        return foodRepository.findByIdAndRestaurantId(foodId, restaurantId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "The menu item could not be found in your restaurant."
                ));
    }

    private Category resolveCategory(Category requestedCategory, Restaurant restaurant) throws Exception {
        if (requestedCategory == null) {
            return null;
        }

        Category category;
        if (requestedCategory.getId() != null) {
            category = categoryRepository.findById(requestedCategory.getId())
                    .orElseThrow(() -> new ApiException(
                            HttpStatus.NOT_FOUND,
                            "The food category could not be found."
                    ));
        } else if (requestedCategory.getName() != null && !requestedCategory.getName().isBlank()) {
            category = categoryRepository.findByNameIgnoreCaseAndRestaurantId(
                            requestedCategory.getName().trim(), restaurant.getId())
                    .orElseThrow(() -> new ApiException(
                            HttpStatus.NOT_FOUND,
                            "The food category could not be found in your restaurant."
                    ));
        } else {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please select a valid food category.");
        }

        if (category.getRestaurant() == null
                || !category.getRestaurant().getId().equals(restaurant.getId())) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You don't have permission to use this food category."
            );
        }
        return category;
    }

    private List<IngredientsItem> resolveIngredients(List<FoodIngredientRequest> requestedIngredients,
                                                       Restaurant restaurant) throws Exception {
        if (requestedIngredients == null || requestedIngredients.isEmpty()) {
            return List.of();
        }

        List<IngredientsItem> ingredients = new java.util.ArrayList<>();
        for (FoodIngredientRequest requestedIngredient : requestedIngredients) {
            if (requestedIngredient == null) {
                continue;
            }
            IngredientsItem ingredient;
            if (requestedIngredient.getId() != null) {
                ingredient = ingredientItemRepository
                        .findByIdAndRestaurantId(requestedIngredient.getId(), restaurant.getId())
                        .orElseThrow(() -> new ApiException(
                                HttpStatus.NOT_FOUND,
                                "The ingredient could not be found in your restaurant."
                        ));
            } else if (requestedIngredient.getName() != null && !requestedIngredient.getName().isBlank()) {
                ingredient = ingredientItemRepository.findByRestaurantId(restaurant.getId()).stream()
                        .filter(item -> item.getName().equalsIgnoreCase(requestedIngredient.getName().trim()))
                        .findFirst()
                        .orElseThrow(() -> new ApiException(
                                HttpStatus.NOT_FOUND,
                                "The ingredient could not be found in your restaurant."
                        ));
            } else {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Please select a valid ingredient.");
            }
            ingredients.add(ingredient);
        }
        return ingredients;
    }

}
