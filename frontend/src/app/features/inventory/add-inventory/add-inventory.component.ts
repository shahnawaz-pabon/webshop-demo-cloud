import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { RestService } from '../../../services/rest.service';
import { Supplier } from '../../../model/interfaces/supplier.interface';

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
        supplier: ''
    };

    suppliers: Supplier[] = [];
    isLoading = false;
    isSubmitting = false;

    constructor(
        private inventoryService: InventoryService,
        private router: Router,
        private restService: RestService
    ) { }

    ngOnInit(): void {
        this.loadSuppliers();
    }

    loadSuppliers() {
        this.isLoading = true;
        this.restService.getSupplierList(0, 10).subscribe({
            next: (response) => {
                if (response.body) {
                    this.suppliers = response.body.data || [];
                }
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading suppliers:', error);
                this.isLoading = false;
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
                    //  this.router.navigate(['/inventory']);
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
} 