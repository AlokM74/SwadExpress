package com.swadExpress.request;

import com.swadExpress.entity.Category;
import lombok.Data;

import java.util.List;

@Data
public class CreateFoodRequest {

    private String name;
    private String description;
    private double price;
    private Category category;
    private List<String> images;

    private Long restaurantId;
    private Boolean vegetarian;
    private Boolean seasonal;
    private List<FoodIngredientRequest> ingredients;

}
