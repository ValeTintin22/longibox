export interface Product {
    id: Number;
    name: string;
    tipo: string;
    image: string;
}

export interface Cart {
    product: Product;    
    quantity: number;
  }