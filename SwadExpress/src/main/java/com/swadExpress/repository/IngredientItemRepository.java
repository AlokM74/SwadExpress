package com.swadExpress.repository;

import com.swadExpress.entity.IngredientsItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngredientItemRepository extends JpaRepository<IngredientsItem, Long> {

    List<IngredientsItem> findByRestaurantId(Long restaurantId);

    Optional<IngredientsItem> findByIdAndRestaurantId(Long id, Long restaurantId);

    long countByCategory_Id(Long categoryId);

}
