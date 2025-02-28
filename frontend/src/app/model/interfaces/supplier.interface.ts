import { BaseResponse } from "./base-response.interface";

export interface SupplierRequest {
  name: string;
  contactInfo: string;
}

export interface Supplier extends SupplierRequest {
  supplierId: number;
}

// export interface SupplierResponse {
//   data: Supplier;
//   status: string;
//   message: string;
// } 

export interface SupplierResponse extends BaseResponse<Supplier> { }

export interface SupplierListResponse extends BaseResponse<Supplier[]> { }
