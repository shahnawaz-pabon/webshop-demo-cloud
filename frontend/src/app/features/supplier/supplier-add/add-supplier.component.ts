import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Supplier added successfully: ', this.supplier);
    }
  }
} 