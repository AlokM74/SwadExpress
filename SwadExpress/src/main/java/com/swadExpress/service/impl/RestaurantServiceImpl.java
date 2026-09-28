package com.swadExpress.service.impl;

import com.swadExpress.dto.RestaurantDto;
import com.swadExpress.entity.Address;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.entity.User;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.AddressRepository;
import com.swadExpress.repository.RestaurantRepository;
import com.swadExpress.repository.UserRepository;
import com.swadExpress.request.CreateRestaurantRequest;
import com.swadExpress.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {

        Address address =addressRepository.save(req.getAddress());
        Restaurant restaurant =new Restaurant();
        restaurant.setName(req.getName());
        restaurant.setDescription(req.getDescription());
        restaurant.setCuisineType(req.getCuisineType());
        restaurant.setAddress(address);
        restaurant.setContactInformation(req.getContactInformation());
        restaurant.setOpeningHours(req.getOpeningHours());
        restaurant.setImages(req.getImages());
        restaurant.setRegistrationDate(LocalDateTime.now());
        restaurant.setOpen(true);
        restaurant.setOwner(user);
        return restaurantRepository.save(restaurant);

    }

    @Override
    public Restaurant updateRestaurant(
            Long restaurantId,
            CreateRestaurantRequest updateRestaurant
    ) throws Exception {

        Restaurant restaurant = findRestaurantById(restaurantId);

        if (updateRestaurant.getCuisineType() != null) {
            restaurant.setCuisineType(updateRestaurant.getCuisineType());
        }

        if (updateRestaurant.getDescription() != null) {
            restaurant.setDescription(updateRestaurant.getDescription());
        }

        if (updateRestaurant.getName() != null) {
            restaurant.setName(updateRestaurant.getName());
        }

        if (updateRestaurant.getOpeningHours() != null) {
            restaurant.setOpeningHours(updateRestaurant.getOpeningHours());
        }

        if (updateRestaurant.getAddress() != null) {
            Address currentAddress = restaurant.getAddress();
            Address updatedAddress = updateRestaurant.getAddress();
            if (currentAddress == null) {
                currentAddress = updatedAddress;
            } else {
                currentAddress.setStreetAddress(updatedAddress.getStreetAddress());
                currentAddress.setCity(updatedAddress.getCity());
                currentAddress.setStateProvince(updatedAddress.getStateProvince());
                currentAddress.setPostalCode(updatedAddress.getPostalCode());
                currentAddress.setCountry(updatedAddress.getCountry());
            }
            restaurant.setAddress(addressRepository.save(currentAddress));
        }

        if (updateRestaurant.getContactInformation() != null) {
            restaurant.setContactInformation(
                    updateRestaurant.getContactInformation()
            );
        }

        if (updateRestaurant.getImages() != null) {
            restaurant.setImages(updateRestaurant.getImages());
        }

        return restaurantRepository.save(restaurant);
    }
    @Override
    public void deleteRestaurant(Long restaurantId) throws Exception {
        Restaurant restaurant =findRestaurantById(restaurantId);
        restaurantRepository.delete(restaurant);
    }

    @Override
    public List<Restaurant> getAllRestaurants() throws Exception {
        return restaurantRepository.findAll();
    }

    @Override
    public List<Restaurant> searchRestaurant(String keyword) {
         return restaurantRepository.findBySearchQuery(keyword);
    }


    @Override
    public Restaurant findRestaurantById(Long restaurantId) throws Exception {

        Optional<Restaurant> restaurant =restaurantRepository.findById(restaurantId);

        if (restaurant.isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "The restaurant could not be found.");
        }

        return restaurant.get();
    }

    @Override
    public Restaurant getRestaurantByUserId(Long userId) throws Exception {

        Restaurant restaurant=restaurantRepository.findByOwnerId(userId);
        if (restaurant == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "You haven't created a restaurant yet.");
        }

        return restaurant;
    }

    @Override
    public RestaurantDto addToFavorites(Long restaurantId, User user) throws Exception {

        Restaurant restaurant = findRestaurantById(restaurantId);

        RestaurantDto restaurantDto = new RestaurantDto();
        restaurantDto.setDescription(restaurant.getDescription());
        restaurantDto.setImages(restaurant.getImages());
        restaurantDto.setTitle(restaurant.getName());
        restaurantDto.setId(restaurant.getId());

        List<RestaurantDto> favorites = user.getFavourites();

        boolean isFavourite = false;

        for (RestaurantDto favourite : favorites) {
            if (favourite.getId().equals(restaurantId)) {
                isFavourite = true;
                break;
            }
        }

        if (isFavourite) {
            // Remove this restaurant from favorites
            favorites.removeIf(
                    favourite -> favourite.getId().equals(restaurantId)
            );
        } else {
            // Add new restaurant to favorites
            favorites.add(restaurantDto);
        }

        user.setFavourites(favorites);
        userRepository.save(user);

        return restaurantDto;
    }
    @Override
    public Restaurant updateRestaurantStatus(Long id) throws Exception {

        Restaurant restaurant =findRestaurantById(id);
        restaurant.setOpen(!restaurant.isOpen());

        return restaurantRepository.save(restaurant);

    }

}
