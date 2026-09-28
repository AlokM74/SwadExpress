package com.swadExpress.service;

import com.swadExpress.dto.RestaurantDto;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.entity.User;
import com.swadExpress.request.CreateRestaurantRequest;

import java.util.List;

public interface RestaurantService {

    public Restaurant createRestaurant(CreateRestaurantRequest req, User user);

    public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest updateRestaurant) throws Exception;

    public void deleteRestaurant(Long restaurantId) throws Exception;

    public List<Restaurant> getAllRestaurants() throws Exception;

    public List<Restaurant> searchRestaurant(String keyword);

    public Restaurant findRestaurantById(Long restaurantId) throws Exception;

    public Restaurant getRestaurantByUserId(Long userId) throws Exception;

    public RestaurantDto addToFavorites(Long restaurantId, User user) throws Exception;

    public Restaurant updateRestaurantStatus(Long id)  throws Exception;



}
