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
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN p.inventories i " +
            "WHERE (:keyword IS NULL OR p.title LIKE %:keyword% OR p.summary LIKE %:keyword%) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "GROUP BY p.productId " +
            "HAVING (:isAvailable = false OR COALESCE(SUM(i.stockLevel), 0) > 0)")
    Page<Product> findByFilters(
            @Param("keyword") String keyword,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("isAvailable") boolean isAvailable,
            Pageable pageable
    );

    @Query("SELECT MIN(p.price) FROM Product p")
    Double findMinPrice();

    @Query("SELECT MAX(p.price) FROM Product p")
    Double findMaxPrice();
}
