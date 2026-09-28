package com.swadExpress.controller;

import com.swadExpress.entity.Cart;
import com.swadExpress.entity.CartItem;
import com.swadExpress.entity.User;
import com.swadExpress.repository.CartRepository;
import com.swadExpress.repository.UserRepository;
import com.swadExpress.request.CartItemRequest;
import com.swadExpress.request.UpdateCartItemRequest;
import com.swadExpress.service.CartService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService  userService;

    @PostMapping("/cart/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestHeader("Authorization") String jwt,
                                              @RequestBody CartItemRequest req)  throws Exception{

        CartItem cartItem=cartService.addItemToCart(req,jwt);
        return new ResponseEntity<>(cartItem, HttpStatus.CREATED);
    }

    @PutMapping("/cart-item/update")
    public ResponseEntity<CartItem> updateCartItemQuantity(@RequestBody UpdateCartItemRequest req)  throws Exception{

        CartItem cartItem=cartService.updateCartItemQuantity(req.getCartItemId(), req.getQuantity());
        return new ResponseEntity<>(cartItem, HttpStatus.OK);
    }

    @DeleteMapping("/cart-item/{id}/remove")
    public ResponseEntity<Cart> removeCartItem(@RequestHeader("Authorization") String jwt,
                                               @PathVariable Long id)  throws Exception{

        Cart cart= cartService.removeItemFromCart(id,jwt);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PutMapping("/cart/clear")
    public ResponseEntity<Cart> clearCart(@RequestHeader("Authorization") String jwt)  throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        Cart cart=cartService.clearCart(user.getId());
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @GetMapping("/cart")
    public ResponseEntity<Cart> findUserCart(@RequestHeader("Authorization") String jwt)  throws Exception{

        User user=userService.findUserByJwtToken(jwt);

        Cart cart=cartService.findCartByUserId(user.getId());
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }





}
