package com.swadExpress.request;

import lombok.Data;

@Data
public class IngredientItemRequest {

    private Long restaurantId;
    private String name;
    private Long categoryId;
}
