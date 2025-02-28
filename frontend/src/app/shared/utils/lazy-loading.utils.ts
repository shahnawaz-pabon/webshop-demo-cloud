export const loadProductListComponentLazily = () => import('../../features/products/product-list/product-list.component').then(m => m.ProductListComponent);
export const loadProductAddComponentLazily = () => import('../../features/products/product-add/add-product.component').then(m => m.AddProductComponent);
export const loadProductDetailComponentLazily = () => import('../../features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent);
export const loadCartComponentLazily = () => import('../../features/cart/cart.component').then(m => m.CartComponent);
export const loadOrdersComponentLazily = () => import('../../features/orders/orders.component').then(m => m.OrdersComponent);
export const loadSignupComponentLazily = () => import('../../features/auth/signup/signup.component').then(m => m.SignupComponent);
export const loadLoginComponentLazily = () => import('../../features/auth/login/login.component').then(m => m.LoginComponent);
export const loadAccountComponentLazily = () => import('../../features/account/account.component').then(m => m.AccountComponent);
export const loadGeneralErrorComponentLazily = () => import('../../shared/components/general-error/general-error.component').then(m => m.GeneralErrorComponent);
export const loadPaymentResultComponentLazily = () => import('../../features/payment/payment-result/payment-result.component').then(m => m.PaymentResultComponent);
export const loadAddInventoryComponentLazily = () => 
  import('../../features/inventory/add-inventory/add-inventory.component')
    .then(m => m.AddInventoryComponent); 
export const loadAddSupplierComponentLazily = () => 
    import('../../features/supplier/supplier-add/add-supplier.component')
      .then(m => m.AddSupplierComponent);  

