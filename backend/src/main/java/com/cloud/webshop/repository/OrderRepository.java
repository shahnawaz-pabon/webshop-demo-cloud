package com.cloud.webshop.repository;

import com.cloud.webshop.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o JOIN FETCH o.orderProducts op JOIN FETCH op.product WHERE o.userId = :userId")
    List<Order> findByUserId(@Param("userId") Long userId);
}
