package com.swadExpress.service;

import com.swadExpress.entity.Category;

import java.util.List;

public interface CategoryService {

    public Category createCategory(String name,Long userId) throws Exception;

    public List<Category> findCategoryByRestaurantId(Long restaurantId) throws Exception;

    public Category findCategoryById(Long id)  throws Exception;

    void deleteCategory(Long categoryId, String jwt) throws Exception;

    Category updateCategory(Long categoryId, String name, Long userId) throws Exception;
}
