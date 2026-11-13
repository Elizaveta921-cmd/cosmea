export type CategoryId = 'face' | 'makeup' | 'hair' | 'body' | 'fragrance';

export interface Category {
  id: CategoryId;
  label: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: CategoryId;
  price: number;
  oldPrice?: number;     
  rating: number;
  reviews: number;      //популярность 
  volume: string;
  description: string;
  images: string[];      // если фото больше одного, показываем карусель
  isNew: boolean;
}