import { Product } from '../../model/product.model';

export class ProductUtils {
    static findProductById(productId: number, products: Product[]): Product | undefined {
        return products.find(product => product.getProductId() === productId);
    }
} 