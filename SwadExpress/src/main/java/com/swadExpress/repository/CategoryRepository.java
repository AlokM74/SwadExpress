package com.swadExpress.repository;

import com.swadExpress.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    public List<Category> findByRestaurantId(Long restaurantId);

    java.util.Optional<Category> findByNameIgnoreCaseAndRestaurantId(String name, Long restaurantId);

}
