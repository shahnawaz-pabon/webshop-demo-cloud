package com.cloud.webshop.response;

import com.cloud.webshop.model.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierResponse {
    private Long supplierId;
    private String name;
    private String contactInfo;

    public static SupplierResponse toSupplierResponse(Supplier supplier) {
        SupplierResponse response = new SupplierResponse();
        response.setSupplierId(supplier.getSupplierId());
        response.setName(supplier.getName());
        response.setContactInfo(supplier.getContactInfo());
        return response;
    }
}
