package com.cloud.webshop.repository;

import com.cloud.webshop.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserIdAndProduct_ProductId(Long userId, Long productId);
    List<Cart> findByUserId(Long userId);
}
