import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product = {
    title: '',
    imageUrl: '',
    summary: '',
    price: '',
    description: ''
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    // Handle file upload logic here
  }

  onSubmit() {
    // Handle form submission
    console.log('Product to add:', this.product);
  }
} 