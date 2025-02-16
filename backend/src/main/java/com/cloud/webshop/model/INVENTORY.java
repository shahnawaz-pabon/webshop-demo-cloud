package com.cloud.webshop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Inventory")
public class INVENTORY {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private int inventory_id;

    @Column(name = "stock_level")
    private int stock_level;

    // @OneToMany(cascade = CascadeType.ALL)
    //@JoinColumn(name = "supplier_id", nullable = false)
    //private SUPPLIER supplier;

    // @Column(name = "created_at", nullable = false, updatable = false)
    //private LocalDateTime createdAt = LocalDateTime.now();
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

}
