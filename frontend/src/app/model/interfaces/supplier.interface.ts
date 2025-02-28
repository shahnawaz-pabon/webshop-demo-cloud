export interface SupplierRequest {
    name: string;
    contactInfo: string;
  }
  
  export interface Supplier extends SupplierRequest {
    supplierId: number;
  }
  
  export interface SupplierResponse {
    data: Supplier;
    status: string;
    message: string;
  } 