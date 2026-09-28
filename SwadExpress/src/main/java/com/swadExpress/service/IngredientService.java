package com.swadExpress.service;

import com.swadExpress.entity.IngredientCategory;
import com.swadExpress.entity.IngredientsItem;

import java.util.List;

public interface IngredientService {

    public IngredientCategory createIngredientCategory(String name, Long restaurantId) throws Exception;

    public IngredientCategory findIngredientCategoryById(Long id) throws Exception;

    public List<IngredientCategory> findIngredientCategoryByRestaurantId(Long restaurantId) throws Exception;

    public IngredientsItem createIngredientsItem(Long restaurantId, String ingredientName, Long categoryId) throws Exception;

    public List<IngredientsItem> findRestaurantIngredients(Long restaurantId) throws Exception;

    public IngredientsItem findIngredientItemById(Long id) throws Exception;

    public IngredientsItem updateIngredientsItem(Long id, Long restaurantId, String name, Long categoryId) throws Exception;

    public void deleteIngredientsItem(Long id, Long restaurantId) throws Exception;

    public void deleteIngredientCategory(Long id, Long restaurantId) throws Exception;

    public IngredientsItem updateStock(Long id) throws Exception;
}
