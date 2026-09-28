package com.swadExpress.controller;

import com.swadExpress.entity.IngredientCategory;
import com.swadExpress.entity.IngredientsItem;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.entity.User;
import com.swadExpress.exception.ApiException;
import com.swadExpress.request.IngredientCategoryRequest;
import com.swadExpress.request.IngredientItemRequest;
import com.swadExpress.response.IngredientItemResponse;
import com.swadExpress.response.MessageResponse;
import com.swadExpress.service.IngredientService;
import com.swadExpress.service.RestaurantService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/ingredients")
public class IngredientController {

    @Autowired
    private IngredientService ingredientService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping("/category")
    public ResponseEntity<?> createIngredientCategory(
            @RequestBody IngredientCategoryRequest req,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {

        Restaurant restaurant = restaurantService.findRestaurantById(req.getRestaurantId());
        if (isNotOwner(restaurant, jwt)) {
            throw forbidden();
        }
        IngredientCategory ingredientCategory =ingredientService.createIngredientCategory(req.getName(), req.getRestaurantId());
        return new ResponseEntity<>(ingredientCategory, HttpStatus.CREATED);
    }

    @PostMapping("/item")
    public ResponseEntity<?> createIngredientItem(
            @RequestBody IngredientItemRequest req,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {

        Restaurant restaurant = restaurantService.findRestaurantById(req.getRestaurantId());
        if (isNotOwner(restaurant, jwt)) {
            throw forbidden();
        }
        IngredientsItem ingredientsItem =ingredientService.createIngredientsItem(req.getRestaurantId(), req.getName(), req.getCategoryId());
        return new ResponseEntity<>(IngredientItemResponse.from(ingredientsItem), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<?> updateIngredientStock(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {

        IngredientsItem existingItem = ingredientService.findIngredientItemById(id);
        if (isNotOwner(existingItem.getRestaurant(), jwt)) {
            throw forbidden();
        }
        IngredientsItem ingredientsItem =ingredientService.updateStock(id);
        return new ResponseEntity<>(IngredientItemResponse.from(ingredientsItem), HttpStatus.OK);
    }

    @PutMapping("/item/{id}")
    public ResponseEntity<?> updateIngredientItem(
            @PathVariable Long id,
            @RequestBody IngredientItemRequest req,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {

        IngredientsItem existingItem = ingredientService.findIngredientItemById(id);
        Restaurant restaurant = existingItem.getRestaurant();
        if (isNotOwner(restaurant, jwt)) {
            throw forbidden();
        }
        if (req.getRestaurantId() != null && !req.getRestaurantId().equals(restaurant.getId())) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "The selected restaurant does not match this ingredient."
            );
        }

        IngredientsItem ingredientsItem = ingredientService.updateIngredientsItem(
                id, restaurant.getId(), req.getName(), req.getCategoryId());
        return ResponseEntity.ok(IngredientItemResponse.from(ingredientsItem));
    }

    @DeleteMapping("/item/{id}")
    public ResponseEntity<?> deleteIngredientItem(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {

        IngredientsItem existingItem = ingredientService.findIngredientItemById(id);
        Restaurant restaurant = existingItem.getRestaurant();
        if (isNotOwner(restaurant, jwt)) {
            throw forbidden();
        }

        ingredientService.deleteIngredientsItem(id, restaurant.getId());
        MessageResponse response = new MessageResponse();
        response.setMessage("Ingredient item deleted successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<?> deleteIngredientCategory(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {

        IngredientCategory category = ingredientService.findIngredientCategoryById(id);
        Restaurant restaurant = category.getRestaurant();
        if (isNotOwner(restaurant, jwt)) {
            throw forbidden();
        }

        ingredientService.deleteIngredientCategory(id, restaurant.getId());
        MessageResponse response = new MessageResponse();
        response.setMessage("Ingredient category deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/restaurant/{id}/item")
    public ResponseEntity<?> findRestaurantIngredient(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {

        Restaurant restaurant = restaurantService.findRestaurantById(id);
        if (isNotOwner(restaurant, jwt)) {
            throw forbidden();
        }
        List<IngredientItemResponse> ingredientsItems = ingredientService.findRestaurantIngredients(id)
                .stream()
                .map(IngredientItemResponse::from)
                .collect(Collectors.toList());
        return new ResponseEntity<>(ingredientsItems, HttpStatus.OK);
    }


    @GetMapping("/restaurant/{id}/category")
    public ResponseEntity<?> findIngredientCategoryByRestaurantId(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {

        Restaurant restaurant = restaurantService.findRestaurantById(id);
        if (isNotOwner(restaurant, jwt)) {
            throw forbidden();
        }
        List<IngredientCategory> ingredientCategories =ingredientService.findIngredientCategoryByRestaurantId(id);
        return new ResponseEntity<>(ingredientCategories, HttpStatus.OK);
    }

    private boolean isNotOwner(Restaurant restaurant, String jwt) throws Exception {
        if (restaurant == null || restaurant.getOwner() == null || jwt == null || jwt.isBlank()) {
            return true;
        }
        User user = userService.findUserByJwtToken(jwt);
        return user == null || !restaurant.getOwner().getId().equals(user.getId());
    }

    private ApiException forbidden() {
        return new ApiException(
                HttpStatus.FORBIDDEN,
                "You don't have permission to manage ingredients for this restaurant."
        );
    }

}