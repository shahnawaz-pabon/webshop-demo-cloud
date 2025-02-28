package com.cloud.webshop.service;

import com.cloud.webshop.model.Supplier;
import com.cloud.webshop.request.SupplierRequest;
import com.cloud.webshop.response.SupplierResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SupplierService {
    Page<Supplier> getAllSuppliers(Pageable pageable);
    SupplierResponse addSupplier(SupplierRequest request);
}
