package com.cloud.webshop.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Supplier")

public class SUPPLIER {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "contact_info")
    private String contactInfo;

    @ManyToOne(optional = false)
    private INVENTORY inventories;
}
