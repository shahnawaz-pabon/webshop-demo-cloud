import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductUtils } from '../../../shared/utils/product.utils';
import { AppStateService } from '../../../services/app-state.service';
import { ProductService } from '../../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  isEditMode = false;
  product: any = {
    title: '',
    summary: '',
    price: 0,
    description: '',
    imageUrl: '',
    category: ''
  };

  categories: string[] = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Other'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appState: AppStateService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Get productId from route params
    const productId = this.route.snapshot.params['productId'];
    if (productId) {
      this.isEditMode = true;
      this.loadProductDetails(+productId);
    }
  }

  loadProductDetails(id: number) {
    const product = ProductUtils.findProductById(id, this.appState.getProductList());
    if (product) {
      this.product = {
        title: product.getTitle(),
        summary: product.getSummary(),
        price: product.getPrice(),
        description: product.getDescription(),
        imageUrl: product.getImageUrl(),
        category: product.getCategory()
      };
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    // Handle form submission based on mode
    if (this.isEditMode) {
      console.log('Updating product:', this.product);

      // Add your update logic here
    } else {
      console.log('Adding new product:', this.product);

      this.productService.createProduct(this.product).subscribe((response) => {
        this.snackBar.open('Product created successfully', 'Close', {
          duration: 2000
        });
        this.router.navigate(['/products']);
      });
    }
  }
} 