package com.cloud.webshop.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "Supplier")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id", nullable = false)
    private Long supplierId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "contact_info", length = 255)
    private String contactInfo;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Inventory> inventories;
}
