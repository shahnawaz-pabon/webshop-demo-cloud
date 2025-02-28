package com.cloud.webshop.service;

import com.cloud.webshop.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SupplierService {
    Page<Supplier> getAllSuppliers(Pageable pageable);
}
