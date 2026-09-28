package com.swadExpress.controller;

import com.swadExpress.entity.Restaurant;
import com.swadExpress.entity.User;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.RestaurantRepository;
import com.swadExpress.request.CreateRestaurantRequest;
import com.swadExpress.response.MessageResponse;
import com.swadExpress.service.RestaurantService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/restaurants")
public class AdminRestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping
    public ResponseEntity<?> createRestaurant(
            @RequestBody CreateRestaurantRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception{

        User user=userService.findUserByJwtToken(jwt);
        if (restaurantRepository.findByOwnerId(user.getId()) != null) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Your account already has a restaurant."
            );
        }

        Restaurant restaurant=restaurantService.createRestaurant(req,user);
        return new ResponseEntity<>(restaurant, HttpStatus.CREATED);

    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(
            @RequestBody CreateRestaurantRequest req,
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception{

        User user=userService.findUserByJwtToken(jwt);
        if (!isOwner(restaurantService.findRestaurantById(id), user)) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You don't have permission to update this restaurant."
            );
        }

        Restaurant restaurant=restaurantService.updateRestaurant(id,req);
        return new ResponseEntity<>(restaurant, HttpStatus.CREATED);

    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        if (!isOwner(restaurantService.findRestaurantById(id), user)) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You don't have permission to delete this restaurant."
            );
        }
        restaurantService.deleteRestaurant(id);
        MessageResponse  messageResponse=new MessageResponse();
        messageResponse.setMessage("Restaurant deleted successfully");
        return new ResponseEntity<>(messageResponse,HttpStatus.OK);
    }



    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRestaurantStatus(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long id) throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        if (!isOwner(restaurantService.findRestaurantById(id), user)) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You don't have permission to update this restaurant."
            );
        }
        Restaurant restaurant=restaurantService.updateRestaurantStatus(id);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);

    }

    @GetMapping("/user")
    public ResponseEntity<Restaurant> findRestaurantByUserId(
            @RequestHeader("Authorization") String jwt
            ) throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        Restaurant restaurant=restaurantRepository.findByOwnerId(user.getId());
        return ResponseEntity.of(Optional.ofNullable(restaurant));

    }

    private boolean isOwner(Restaurant restaurant, User user) {
        return restaurant.getOwner() != null
                && restaurant.getOwner().getId().equals(user.getId());
    }


}
