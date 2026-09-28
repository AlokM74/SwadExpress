package com.swadExpress.repository;

import com.swadExpress.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food,Long> {

    List<Food> findByRestaurantId(Long restaurantId);

    java.util.Optional<Food> findByIdAndRestaurantId(Long id, Long restaurantId);

//    @Query("SELECT f FROM Food f WHERE f.name LIKE %:keyword% OR f.foodCategory.name LIKE %:keyword%")
//    List<Food> searchFood(@Param("keyword") String keyword);

    @Query("""
            SELECT f FROM Food f
            WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR (f.foodCategory IS NOT NULL
                   AND LOWER(f.foodCategory.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    List<Food> searchFood(@Param("keyword") String keyword);

    @Query("""
            SELECT f FROM Food f
            WHERE LOWER(f.name) LIKE '%biry%'
               OR LOWER(f.name) LIKE '%biriyani%'
               OR LOWER(f.name) LIKE '%biriani%'
               OR (f.foodCategory IS NOT NULL
                   AND (
                       LOWER(f.foodCategory.name) LIKE '%biry%'
                       OR LOWER(f.foodCategory.name) LIKE '%biriyani%'
                       OR LOWER(f.foodCategory.name) LIKE '%biriani%'
                   ))
            """)
    List<Food> searchBiryaniVariants();



}
