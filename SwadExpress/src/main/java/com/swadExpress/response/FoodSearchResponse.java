package com.swadExpress.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.swadExpress.entity.IngredientsItem;

import java.util.List;

@Data
@AllArgsConstructor
public class FoodSearchResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private List<String> images;
    private boolean available;
    private boolean vegetarian;
    private List<IngredientsItem> ingredients;
    private String restaurantName;
    private String streetAddress;
    private String city;
}
