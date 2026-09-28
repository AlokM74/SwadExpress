package com.swadExpress.controller;

import com.swadExpress.dto.RestaurantDto;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.entity.User;
import com.swadExpress.service.RestaurantService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class CustomerRestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurant(
            @RequestHeader("Authorization") String jwt,
            @RequestParam String keyword) throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        List<Restaurant> restaurant=restaurantService.searchRestaurant(keyword);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurant(
            @RequestHeader("Authorization") String jwt) throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        List<Restaurant> restaurant=restaurantService.getAllRestaurants();
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> findRestaurantById(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        Restaurant restaurant=restaurantService.findRestaurantById(id);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @PutMapping("/{id}/add-to-fav")
    public ResponseEntity<RestaurantDto> addToFavorites(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        RestaurantDto restaurantDto=restaurantService.addToFavorites(id,user);
        return new ResponseEntity<>(restaurantDto, HttpStatus.OK);
    }

}
