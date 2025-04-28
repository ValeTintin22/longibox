import { Product } from "./product.model";

export interface Purchase {
    id: number;
    userId: number;
    products: { productId: string; quantity: number }[];
    date: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}