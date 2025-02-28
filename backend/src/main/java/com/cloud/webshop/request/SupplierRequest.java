package com.cloud.webshop.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SupplierRequest {
    private String name;
    private String contactInfo;
}