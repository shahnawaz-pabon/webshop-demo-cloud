package com.cloud.webshop.repository;

import com.cloud.webshop.model.OrderProduct;
import com.cloud.webshop.model.OrderProductId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderProductRepository extends JpaRepository<OrderProduct, OrderProductId> {
}
