export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  gallery?: string[];
  features: string[];
  rating: number;
  reviews: number;
}
