package com.swadExpress.service.impl;

import com.swadExpress.entity.Cart;
import com.swadExpress.entity.CartItem;
import com.swadExpress.entity.Food;
import com.swadExpress.entity.User;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.CartItemRepository;
import com.swadExpress.repository.CartRepository;
import com.swadExpress.request.CartItemRequest;
import com.swadExpress.service.CartService;
import com.swadExpress.service.FoodService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FoodService foodService;



    @Override
    public CartItem addItemToCart(CartItemRequest req, String jwt) throws Exception {

        User user=userService.findUserByJwtToken(jwt);

        Food food=foodService.findFoodById(req.getFoodId());

        Cart cart=cartRepository.findByCustomerId(user.getId());

        for(CartItem cartItem:cart.getCartItem()) {

            if(cartItem.getFood().equals(food)){
                int newQuantity=cartItem.getQuantity()+req.getQuantity();
                return updateCartItemQuantity(cartItem.getId(),newQuantity);
            }
        }

        CartItem newCartItem=new CartItem();
        newCartItem.setFood(food);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(req.getQuantity());
        newCartItem.setIngredients(req.getIngredients());
        newCartItem.setTotalPrice(req.getQuantity()*food.getPrice());
        CartItem savedCartItem= cartItemRepository.save(newCartItem);

        cart.getCartItem().add(savedCartItem);

        return savedCartItem;
    }

    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) throws Exception {

        Optional<CartItem> cartItemOptional=cartItemRepository.findById(cartItemId);

        if(cartItemOptional.isEmpty()){
            throw new ApiException(HttpStatus.NOT_FOUND, "The cart item could not be found.");
        }
        CartItem cartItem=cartItemOptional.get();
        cartItem.setQuantity(quantity);

        cartItem.setTotalPrice(cartItem.getFood().getPrice()*quantity);

        return cartItemRepository.save(cartItem);
    }

    @Override
    public Cart removeItemFromCart(Long cartItemId, String jwt) throws Exception {

        User  user=userService.findUserByJwtToken(jwt);

        Cart  cart=cartRepository.findByCustomerId(user.getId());

        Optional<CartItem> cartItemOptional=cartItemRepository.findById(cartItemId);
        if(cartItemOptional.isEmpty()){
            throw new ApiException(HttpStatus.NOT_FOUND, "The cart item could not be found.");
        }
        CartItem cartItem=cartItemOptional.get();

        cart.getCartItem().remove(cartItem);


        return cartRepository.save(cart);
    }

    @Override
    public Long calculateCartTotal(Cart cart) throws Exception {

        Long total=0L;

        for(CartItem cartItem:cart.getCartItem()){
            total += (long) (cartItem.getFood().getPrice()*cartItem.getQuantity());
        }

        return total;
    }

    @Override
    public Cart findCartById(Long id) throws Exception {

        Optional<Cart> cart=cartRepository.findById(id);
        if(cart.isEmpty()){
            throw new ApiException(HttpStatus.NOT_FOUND, "The cart could not be found.");
        }
        return cart.get();

    }

    @Override
    public Cart findCartByUserId(Long userId) throws Exception {

        return  cartRepository.findByCustomerId(userId);
    }

    @Override
    public Cart clearCart(Long userId) throws Exception {

        Cart cart=cartRepository.findByCustomerId(userId);

        cart.getCartItem().clear();
        return cartRepository.save(cart);

    }



}
