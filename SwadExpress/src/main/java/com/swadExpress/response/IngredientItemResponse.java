package com.swadExpress.response;

import com.swadExpress.entity.IngredientsItem;
import lombok.Data;

@Data
public class IngredientItemResponse {

    private Long id;
    private String name;
    private boolean stoke;
    private Long categoryId;
    private String categoryName;

    public static IngredientItemResponse from(IngredientsItem item) {
        IngredientItemResponse response = new IngredientItemResponse();
        response.setId(item.getId());
        response.setName(item.getName());
        response.setStoke(item.isStoke());
        if (item.getCategory() != null) {
            response.setCategoryId(item.getCategory().getId());
            response.setCategoryName(item.getCategory().getName());
        }
        return response;
    }
}
