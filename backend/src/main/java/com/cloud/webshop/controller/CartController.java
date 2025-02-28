package com.cloud.webshop.controller;

import com.cloud.webshop.request.AddToCartRequest;
import com.cloud.webshop.response.ApiResponse;
import com.cloud.webshop.response.CartItemResponse;
import com.cloud.webshop.response.CartListResponse;
import com.cloud.webshop.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@Tag(name = "Cart Operation", description = "APIs for managing carts")
public class CartController {
    @Autowired
    private CartService cartService;

    @CrossOrigin
    @PostMapping("/add")
    @Operation(
            summary = "Add an item to the cart",
            description = "It will create an item to the cart."
    )
    public ResponseEntity<ApiResponse<CartItemResponse>> addToCart(@RequestBody AddToCartRequest request) {
        CartItemResponse cartItemResponse = cartService.addToCart(request);

        ApiResponse<CartItemResponse> response = new ApiResponse<>(
                "success",
                "Product added successfully to the cart",
                cartItemResponse
        );
        return ResponseEntity.ok(response);
    }

    @CrossOrigin
    @GetMapping("/list")
    @Operation(
            summary = "Get cart list by user",
            description = "Getting cart list added by a specific user"
    )
    public ResponseEntity<ApiResponse<CartListResponse>> getCartList(@RequestParam Long userId) {
        CartListResponse cartListResponse = cartService.getCartList(userId);

        ApiResponse<CartListResponse> response = new ApiResponse<>(
                "success",
                "Cart List",
                cartListResponse
        );
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{cartId}")
    public ResponseEntity<ApiResponse<Void>> deleteCartItem(@PathVariable Long cartId) {
        cartService.deleteCartItem(cartId);
        ApiResponse<Void> response = new ApiResponse<>(
                "Success",
                "Cart item deleted successfully",
                null
        );
        return ResponseEntity.ok(response);
      }
}