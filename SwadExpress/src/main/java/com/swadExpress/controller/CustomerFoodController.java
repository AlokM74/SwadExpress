package com.swadExpress.controller;

import com.swadExpress.entity.Food;
import com.swadExpress.entity.User;
import com.swadExpress.response.FoodSearchResponse;
import com.swadExpress.service.FoodService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
public class CustomerFoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<?> searchFood(@RequestParam String name) throws Exception {
        List<Food> foods = foodService.searchFood(name);

        List<FoodSearchResponse> results = foods.stream()
                .map(food -> new FoodSearchResponse(
                        food.getId(),
                        food.getName(),
                        food.getDescription(),
                        food.getPrice(),
                        food.getImages(),
                        food.isAvailable(),
                        food.isVegetarian(),
                        food.getIngredients(),
                        food.getRestaurant() == null ? null : food.getRestaurant().getName(),
                        food.getRestaurant() == null || food.getRestaurant().getAddress() == null
                                ? null
                                : food.getRestaurant().getAddress().getStreetAddress(),
                        food.getRestaurant() == null || food.getRestaurant().getAddress() == null
                                ? null
                                : food.getRestaurant().getAddress().getCity()
                ))
                .toList();

        return new ResponseEntity<>(results, HttpStatus.OK);
    }


    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Food>> getRestaurantFood(@RequestHeader("Authorization") String jwt,
                                                        @RequestParam(required = false)  boolean vegetarian,
                                                        @RequestParam(required = false)  boolean sessional,
                                                        @RequestParam(required = false)  boolean nonveg,
                                                        @RequestParam(required = false) String foodCategory,
                                                        @PathVariable Long restaurantId) throws Exception {

        User user=userService.findUserByJwtToken(jwt);

        List<Food> foods=foodService.getRestaurantFoods(restaurantId, vegetarian, nonveg, sessional, foodCategory);

        return new ResponseEntity<>(foods, HttpStatus.OK);
    }

}
