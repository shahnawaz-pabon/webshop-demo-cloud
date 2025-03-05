import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { RestService } from '../../../services/rest.service';
import { Supplier } from '../../../model/interfaces/supplier.interface';
import { Product } from '../../../model/interfaces/product.interface';


@Component({
    selector: 'app-add-inventory',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-inventory.component.html',
    styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit {
    inventory = {
        productId: '',
        quantity: 0,
        supplierId: '',
        inventoryId: undefined as number | undefined
    };

    suppliers: Supplier[] = [];
    products: Product[] = [];
    isLoading = false;
    isLoadingProducts = false;
    isSubmitting = false;
    isEditMode = false;

    constructor(
        private inventoryService: InventoryService,
        private router: Router,
        private restService: RestService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.loadSuppliers();  // Load suppliers first
        this.loadProducts();   // Load products

        this.route.queryParams.subscribe(params => {
            if (params['productId']) {
                this.isEditMode = true;
                this.inventory = {
                    productId: params['productId'],
                    quantity: Number(params['quantity']) || 0,
                    supplierId: '',
                    inventoryId: params['inventoryId'] ? Number(params['inventoryId']) : undefined
                };
            }
        });
    }

    loadSuppliers(callback?: () => void) {
        this.isLoading = true;
        this.restService.getSupplierList(0, 10).subscribe({
            next: (response) => {
                if (response.body) {
                    this.suppliers = response.body.data || [];
                }
                this.isLoading = false;
                if (callback) callback();
            },
            error: (error) => {
                console.error('Error loading suppliers:', error);
                this.isLoading = false;
            }
        });
    }

    loadProducts(callback?: () => void) {
        this.isLoadingProducts = true;
        this.restService.getAllProducts().subscribe({
            next: (response) => {
                if (response.body?.data) {
                    this.products = response.body.data;
                }
                this.isLoadingProducts = false;
                if (callback) callback();
            },
            error: (error) => {
                console.error('Error loading products:', error);
                this.isLoadingProducts = false;
            }
        });
    }

    onSubmit() {
        if (this.isSubmitting) return;

        this.isSubmitting = true;
        console.log('Submitting inventory:', this.inventory);

        this.inventoryService.upsertInventory(this.inventory)
            .subscribe({
                next: (response) => {
                    console.log('Inventory added successfully:', response);
                    this.router.navigate(['/inventory']);
                },
                error: (error) => {
                    console.error('Error adding inventory:', error);
                    this.isSubmitting = false;
                },
                complete: () => {
                    this.isSubmitting = false;
                }
            });
    }

    get formTitle(): string {
        return this.isEditMode ? 'Edit Inventory' : 'Add Inventory';
    }
} 