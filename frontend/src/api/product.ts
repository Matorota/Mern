import { Product, ProductInput } from "../types/product";
import { GetProductsResponse, PostProductResponse } from "../types/response";
import { apiClient, ApiResponse } from "./api-client";

// doing this to test how to do pull requestus
export const getProducts = async (): Promise<
  ApiResponse<GetProductsResponse>
> => await apiClient.get("/api/products");

export const postProduct = async (
  product: ProductInput,
): Promise<ApiResponse<PostProductResponse>> =>
  await apiClient.post("/api/products", product);

export const updateProduct = async (
  _id: string,
  data: { title: string; photoSrc: string },
): Promise<ApiResponse<PostProductResponse>> =>
  await apiClient.put(`/api/products/${_id}`, {
    title: data.title,
    photoSrc: data.photoSrc,
  });

export const deleteProduct = async (
  id: string,
): Promise<ApiResponse<{ message: string }>> =>
  await apiClient.delete(`/api/products/${id}`);
