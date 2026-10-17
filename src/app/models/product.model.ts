export type ProductCategory = 'proteina' | 'creatina' | 'aminoacidos' | 'energia' | 'salud' | 'accesorios';

export interface ProductVariant {
  code: string;
  size: string;
  flavor: string;
  price: number | null;
  originalName: string;
  image: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory | string;
  variants: ProductVariant[];
}
