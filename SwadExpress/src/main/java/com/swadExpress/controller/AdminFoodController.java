package com.swadExpress.controller;

import com.swadExpress.entity.Food;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.entity.User;
import com.swadExpress.exception.ApiException;
import com.swadExpress.request.CreateFoodRequest;
import com.swadExpress.response.MessageResponse;
import com.swadExpress.service.FoodService;
import com.swadExpress.service.RestaurantService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/food")
public class AdminFoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<Food> createFood(
            @RequestBody CreateFoodRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());
        if (req.getRestaurantId() != null
                && !req.getRestaurantId().equals(restaurant.getId())) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You don't have permission to add food to this restaurant."
            );
        }

        Food food = foodService.createFood(
                req,
                req.getCategory(),
                restaurant
        );

        return new ResponseEntity<>(food, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteFood(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());

        foodService.deleteFood(id, restaurant.getId());

        MessageResponse response = new MessageResponse();
        response.setMessage("Food has been deleted successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFoodAvailability(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());

        Food food = foodService.updateAvailabilityStatus(id, restaurant.getId());

        return new ResponseEntity<>(food, HttpStatus.OK);
    }

    @PutMapping("/{id}/details")
    public ResponseEntity<Food> updateFoodDetails(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id,
            @RequestBody CreateFoodRequest req) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());

        Food food = foodService.updateFoodDetails(id, req, restaurant);

        return new ResponseEntity<>(food, HttpStatus.OK);
    }
}
