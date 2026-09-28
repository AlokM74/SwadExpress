package com.swadExpress.service.impl;

import com.swadExpress.entity.Category;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.entity.User;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.CategoryRepository;
import com.swadExpress.service.CategoryService;
import com.swadExpress.service.RestaurantService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @Override
    public Category createCategory(String name, Long userId) throws Exception {

        Restaurant restaurant=restaurantService.getRestaurantByUserId(userId);
        Category category=new Category();
        category.setName(name);
        category.setRestaurant(restaurant);
        return categoryRepository.save(category);

    }

    @Override
    public List<Category> findCategoryByRestaurantId(Long restaurantId) throws Exception {
        Restaurant restaurant=restaurantService.findRestaurantById(restaurantId);
        return categoryRepository.findByRestaurantId(restaurant.getId());
    }

    @Override
    public Category findCategoryById(Long id) throws Exception {

        Optional<Category> category=categoryRepository.findById(id);
        if(category.isEmpty()){
            throw new ApiException(HttpStatus.NOT_FOUND, "The food category could not be found.");
        }
        return category.get();
    }

    @Override
    public void deleteCategory(Long categoryId, String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());

        Optional<Category> category = categoryRepository.findById(categoryId);

        if (category.isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "The food category could not be found.");
        }

        Category existingCategory = category.get();

        if (!existingCategory.getRestaurant().getId().equals(restaurant.getId())) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You don't have permission to delete this food category."
            );
        }

        categoryRepository.delete(existingCategory);
    }

    @Override
    public Category updateCategory(Long categoryId, String name, Long userId) throws Exception {
        if (name == null || name.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "A food category name is required.");
        }

        Restaurant restaurant = restaurantService.getRestaurantByUserId(userId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "The food category could not be found."
                ));
        if (category.getRestaurant() == null
                || !category.getRestaurant().getId().equals(restaurant.getId())) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You don't have permission to update this food category."
            );
        }

        category.setName(name.trim());
        return categoryRepository.save(category);
    }
}
