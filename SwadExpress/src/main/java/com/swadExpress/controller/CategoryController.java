package com.swadExpress.controller;

import com.swadExpress.entity.Category;
import com.swadExpress.entity.User;
import com.swadExpress.service.CategoryService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @PostMapping("/admin/category")
    public ResponseEntity<Category> createCategory(@RequestHeader("Authorization") String jwt,
                                                   @RequestBody Category category) throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        Category createdCategory =categoryService.createCategory(category.getName(),user.getId());

        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);

    }

    @GetMapping("/category/restaurant/{restaurantId}")
    public ResponseEntity<List<Category>> getRestaurantCategory(
            @PathVariable Long restaurantId) throws Exception {
        List<Category> categories=categoryService.findCategoryByRestaurantId(restaurantId);
        return ResponseEntity.ok(categories);

    }

    @DeleteMapping("/admin/category/{categoryId}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long categoryId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        categoryService.deleteCategory(categoryId, jwt);

        return new ResponseEntity<>(
                "Category deleted successfully",
                HttpStatus.OK
        );
    }

    @PutMapping("/admin/category/{categoryId}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long categoryId,
            @RequestHeader("Authorization") String jwt,
            @RequestBody Category category
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Category updatedCategory = categoryService.updateCategory(
                categoryId,
                category.getName(),
                user.getId()
        );
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }
}
