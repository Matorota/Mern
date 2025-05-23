export interface Product {
  _id: string;
  title: string;
  photoSrc: string;
}

export interface ProductInput {
  title: string;
  photoSrc: string;
}

// pakeiciau GetProductsResponse nes neleido bei kazkodel nemate pagination interface tai parasiau i response
export interface GetProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}
