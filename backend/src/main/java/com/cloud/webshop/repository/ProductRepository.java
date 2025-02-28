package com.cloud.webshop.repository;

import com.cloud.webshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.title LIKE %:keyword% OR p.summary LIKE %:keyword%")
    Page<Product> findByTitleContainingOrCategoryContaining(
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
