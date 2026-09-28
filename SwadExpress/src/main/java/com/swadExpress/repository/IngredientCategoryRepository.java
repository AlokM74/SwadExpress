package com.swadExpress.repository;

import com.swadExpress.entity.IngredientCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngredientCategoryRepository extends JpaRepository<IngredientCategory, Long> {

    List<IngredientCategory> findByRestaurantId(Long restaurantId);

    Optional<IngredientCategory> findByIdAndRestaurantId(Long id, Long restaurantId);

    Optional<IngredientCategory> findByNameIgnoreCaseAndRestaurantId(String name, Long restaurantId);

}
