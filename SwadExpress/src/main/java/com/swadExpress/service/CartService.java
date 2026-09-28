package com.swadExpress.service;

import com.swadExpress.entity.Cart;
import com.swadExpress.entity.CartItem;
import com.swadExpress.request.CartItemRequest;

public interface CartService {

    public CartItem addItemToCart(CartItemRequest req, String jwt) throws Exception;

    public CartItem updateCartItemQuantity(Long cartItemId,int quantity) throws Exception;

    public Cart removeItemFromCart(Long cartItemId, String jwt) throws Exception;

    public Long calculateCartTotal(Cart cart) throws Exception;

    public Cart findCartById(Long id)  throws Exception;

    public Cart findCartByUserId(Long userId)  throws Exception;

    public Cart clearCart(Long userId)  throws Exception;




}
