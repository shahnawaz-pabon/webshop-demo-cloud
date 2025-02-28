import { ActivatedRouteSnapshot, Routes } from "@angular/router";
import { GuardService } from "./services/guard.service";
import { RouteEnum } from "./enum/route.enum";
import { inject } from "@angular/core";
import {
    loadAccountComponentLazily,
    loadCartComponentLazily,
    loadGeneralErrorComponentLazily,
    loadProductAddComponentLazily,
    loadLoginComponentLazily,
    loadPaymentResultComponentLazily,
    loadProductDetailComponentLazily,
    loadProductListComponentLazily,
    loadSignupComponentLazily,
    loadAddSupplierComponentLazily,
    loadManageOrdersComponentLazily
} from "./shared/utils/lazy-loading.utils";

//function guards
const canActivateGuard = (route: ActivatedRouteSnapshot) => inject(GuardService).canActivate(route);

//config routes
export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/products?page=1',
        pathMatch: "full",
    },

    {
        path: 'products',
        children: [
            {
                path: '',
                loadComponent: loadProductListComponentLazily,
                canActivate: [canActivateGuard],
                data: { id: RouteEnum.getProducts }
            },

            {
                path: 'new',
                loadComponent: loadProductAddComponentLazily,
                canActivate: [canActivateGuard],
                data: { id: RouteEnum.addNewProduct }
            },

            {
                path: ':productId',
                children: [
                    {
                        path: '',
                        loadComponent: loadProductDetailComponentLazily,
                        canActivate: [canActivateGuard],
                        data: { id: RouteEnum.getOneProduct }
                    },

                    {
                        path: 'edit',
                        loadComponent: loadProductAddComponentLazily,
                        canActivate: [canActivateGuard],
                        data: { id: RouteEnum.editOneProduct }
                    }
                ]
            },

        ]
    },

    {
        path: 'add-supplier',
        loadComponent: loadAddSupplierComponentLazily,
        canActivate: [canActivateGuard],
        data: { id: RouteEnum.addSupplier }
    },

    {
        path: 'cart',
        loadComponent: loadCartComponentLazily,
        canActivate: [canActivateGuard],
        data: { id: RouteEnum.getCart }
    },

    {
        path: 'manage-orders',
        loadComponent: loadManageOrdersComponentLazily,
        canActivate: [canActivateGuard],
        data: { id: RouteEnum.manageOrders }
    },

    {
        path: 'signup',
        loadComponent: loadSignupComponentLazily,
        canActivate: [canActivateGuard],
    },

    {
        path: 'login',
        loadComponent: loadLoginComponentLazily,
        canActivate: [canActivateGuard],
    },

    {
        path: 'account',
        loadComponent: loadAccountComponentLazily,
        canActivate: [canActivateGuard],
        data: { id: RouteEnum.getAccount }
    },

    {
        path: 'error/:errorCode',
        loadComponent: loadGeneralErrorComponentLazily,
        canActivate: [canActivateGuard],
    },

    {
        path: 'payment/:paymentResult',
        loadComponent: loadPaymentResultComponentLazily,
        canActivate: [canActivateGuard],
    },

    {
        path: '**',
        redirectTo: '/error/404'
    }
]