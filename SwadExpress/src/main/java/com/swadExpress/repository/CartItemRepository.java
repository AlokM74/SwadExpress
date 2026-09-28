package com.swadExpress.repository;

import com.swadExpress.entity.Cart;
import com.swadExpress.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {


}
