import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-add-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent {
  supplier = {
    name: '',
    email: ''
  };

  constructor(
    private supplierService: SupplierService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
        this.supplierService.addSupplier(this.supplier).subscribe({
          next: (response) => {
            console.log('Supplier added successfully:', response);
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Error adding supplier:', error);
            alert('Failed to add supplier. Please try again.');
          }
        });
      }
  }
} 