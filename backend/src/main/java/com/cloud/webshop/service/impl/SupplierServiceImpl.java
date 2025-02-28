package com.cloud.webshop.service.impl;

import com.cloud.webshop.model.Supplier;
import com.cloud.webshop.repository.SupplierRepository;
import com.cloud.webshop.request.SupplierRequest;
import com.cloud.webshop.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.cloud.webshop.response.SupplierResponse;
@Service
public class SupplierServiceImpl implements SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public Page<Supplier> getAllSuppliers(Pageable pageable) {
        return supplierRepository.findAll(pageable);
    }

    @Override
    public SupplierResponse addSupplier(SupplierRequest request) {
        // Create a new supplier
        Supplier supplier = new Supplier();
        supplier.setName(request.getName());
        supplier.setContactInfo(request.getContactInfo());

        // Save the supplier
        Supplier savedSupplier = supplierRepository.save(supplier);

        // Map the saved supplier to SupplierResponse
        return SupplierResponse.toSupplierResponse(savedSupplier);
    }
}
