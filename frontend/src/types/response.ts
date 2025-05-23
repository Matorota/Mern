import { Product } from "./product";

export interface GetProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

// pakeiciau GetProductsResponse nes neleido bei kazkodel nemate pagination interface tai perkeliau i cia
export type PostProductResponse = { addedProduct: Product };
