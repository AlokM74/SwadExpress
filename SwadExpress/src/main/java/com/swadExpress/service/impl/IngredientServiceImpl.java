package com.swadExpress.service.impl;

import com.swadExpress.entity.IngredientCategory;
import com.swadExpress.entity.IngredientsItem;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.IngredientCategoryRepository;
import com.swadExpress.repository.IngredientItemRepository;
import com.swadExpress.service.IngredientService;
import com.swadExpress.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientServiceImpl implements IngredientService {

    @Autowired
    private IngredientItemRepository ingredientItemRepository;

    @Autowired
    private IngredientCategoryRepository ingredientCategoryRepository;

    @Autowired
    private RestaurantService  restaurantService;


    @Override
    public IngredientCategory createIngredientCategory(String name, Long restaurantId) throws Exception {

        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
        IngredientCategory ingredientCategory = new IngredientCategory();
        ingredientCategory.setName(name);
        ingredientCategory.setRestaurant(restaurant);

        return ingredientCategoryRepository.save(ingredientCategory);

    }

    @Override
    public IngredientCategory findIngredientCategoryById(Long id) throws Exception {

        Optional<IngredientCategory> ingredientCategory = ingredientCategoryRepository.findById(id);
        if (ingredientCategory.isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "The ingredient category could not be found.");
        }

        return ingredientCategory.get();
    }

    @Override
    public List<IngredientCategory> findIngredientCategoryByRestaurantId(Long restaurantId) throws Exception {

        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
        return ingredientCategoryRepository.findByRestaurantId(restaurant.getId());
    }

    @Override
    public IngredientsItem createIngredientsItem(Long restaurantId,
                                                 String ingredientName,
                                                 Long categoryId) throws Exception {

        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
        IngredientCategory ingredientCategory = findIngredientCategoryById(categoryId);


        IngredientsItem ingredientsItem = new IngredientsItem();
        ingredientsItem.setRestaurant(restaurant);
        ingredientsItem.setName(ingredientName);
        ingredientsItem.setCategory(ingredientCategory);

        IngredientsItem savedIngredientsItem =ingredientItemRepository.save(ingredientsItem);
        ingredientCategory.getIngredientsItem().add(savedIngredientsItem);

        return savedIngredientsItem;
    }

    @Override
    public List<IngredientsItem> findRestaurantIngredients(Long restaurantId) throws Exception {
        return ingredientItemRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public IngredientsItem findIngredientItemById(Long id) throws Exception {
        return ingredientItemRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "The ingredient item could not be found."
                ));
    }

    @Override
    public IngredientsItem updateIngredientsItem(Long id, Long restaurantId, String name, Long categoryId) throws Exception {
        IngredientsItem ingredientsItem = findIngredientItem(id, restaurantId);
        IngredientCategory ingredientCategory = ingredientCategoryRepository
                .findByIdAndRestaurantId(categoryId, restaurantId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "The ingredient category could not be found."
                ));

        ingredientsItem.setName(name);
        ingredientsItem.setCategory(ingredientCategory);
        return ingredientItemRepository.save(ingredientsItem);
    }

    @Override
    public void deleteIngredientsItem(Long id, Long restaurantId) throws Exception {
        ingredientItemRepository.delete(findIngredientItem(id, restaurantId));
    }

    @Override
    public void deleteIngredientCategory(Long id, Long restaurantId) throws Exception {
        IngredientCategory ingredientCategory = ingredientCategoryRepository
                .findByIdAndRestaurantId(id, restaurantId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "The ingredient category could not be found."
                ));
        if (ingredientItemRepository.countByCategory_Id(id) > 0) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Remove the ingredients in this category before deleting it."
            );
        }
        ingredientCategoryRepository.delete(ingredientCategory);
    }

    @Override
    public IngredientsItem updateStock(Long id) throws Exception {

        IngredientsItem ingredientsItem = findIngredientItemById(id);
        ingredientsItem.setStoke(!ingredientsItem.isStoke());

        return  ingredientItemRepository.save(ingredientsItem);
    }

    private IngredientsItem findIngredientItem(Long id, Long restaurantId) throws Exception {
        return ingredientItemRepository.findByIdAndRestaurantId(id, restaurantId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "The ingredient item could not be found."
                ));
    }
}
