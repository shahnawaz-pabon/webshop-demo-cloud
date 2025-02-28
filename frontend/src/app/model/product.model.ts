export class Product {

    constructor(
        private productId: number,
        private title: string,
        private summary: string,
        private price: number,
        private description: string,
        private imageUrl: string,
        private quantity: number,
        private inventoryId?: number,
        private supplierId?: number
    ) { }

    static getClassName(): string {
        return 'Product';
    }

    getProductId(): number {
        return this.productId;
    }

    setProductId(productId: number) {
        this.productId = productId;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string) {
        this.title = title;
    }

    getSummary(): string {
        return this.summary;
    }

    setSummary(summary: string) {
        this.summary = summary;
    }

    getPrice(): number {
        return this.price;
    }

    setPrice(price: number) {
        this.price = price;
    }

    getDescription(): string {
        return this.description;
    }

    setDescription(description: string) {
        this.description = description;
    }

    getImageUrl(): string {
        return this.imageUrl;
    }

    setImageUrl(imageUrl: string) {
        this.imageUrl = imageUrl;
    }

    getQuantity(): number | undefined {
        return this.quantity;
    }

    getInventoryId(): number | undefined {
        return this.inventoryId;
    }

    getSupplierId(): number | undefined {
        return this.supplierId;
    }

    setSupplierId(supplierId: number) {
        this.supplierId = supplierId;
    }

}