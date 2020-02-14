export interface ProductInventory {
  productId: number;
  price: number;
  salePrice: number;
  quantity: number;
  promo: string;
}

export interface Product {
  id: number;
  image: string;
  name: string;
  color: string;
  year: number;
  description: string;
  category: string;
  // cached values
  price: number;
  salePrice?: number;
  quantity: number;
  promo?: string;
}
