export interface ProductRequest {
    productId: number;
    quantity: number;
  }
  
  export interface DispenseRequest {
    productos: ProductRequest[];
    estado: 'pendiente' | 'completado';
    timestamp: number;
    completadoEn?: number;
  }