import { useEffect, useState, useTransition } from "react";
import { Product, ProductInput } from "../types/product";
import { getProducts, postProduct, deleteProduct } from "../api/product";
import { isResponseError } from "../utils/error";
import { useNavigate } from "react-router-dom";

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  //nzn negalejo man skaityti nustatymu nuo api/products tai padariau pokolkas taip
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 2,
    totalItems: 0,
  });
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanged, setHasChanged] = useState(true);
  const [formData, setFormData] = useState<ProductInput>({
    title: "",
    photoSrc: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    if (!formData.title || !formData.photoSrc) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await postProduct({
        title: formData.title,
        photoSrc: formData.photoSrc,
      });
      if (isResponseError(response)) {
        alert(response.error.message);
        return;
      }
      alert("Product added successfully!");
      setFormData({ title: "", photoSrc: "" });
      setHasChanged(true);
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await deleteProduct(id);
      if (isResponseError(response)) {
        alert(response.error.message || "Failed to delete product.");
        return;
      }
      setHasChanged(true);
    } catch (error) {
      alert("Failed to delete product.");
    }
  };

  const fetchProducts = async (page: number = 1, pageSize: number = 10) => {
    try {
      const response = await getProducts(page, pageSize);
      if (isResponseError(response)) {
        setErrorMessage(response.error.message);
        return;
      }
      startTransition(() => {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
        setHasChanged(false);
      });
    } catch (error) {
      setErrorMessage("Failed to fetch products. Please try again.");
    }
  };

  useEffect(() => {
    if (hasChanged) fetchProducts(pagination.currentPage, pagination.pageSize);
  }, [hasChanged, pagination.currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
      setHasChanged(true);
    }
  };

  const renderProductSectionContent = () => {
    if (isPending) return <p>Loading...</p>;
    if (errorMessage) return <p>{errorMessage}</p>;

    return products.map((product) => (
      <div
        key={product._id}
        className="flex w-48 flex-col items-center overflow-hidden rounded-lg border border-slate-200 shadow-md"
      >
        <div className="w-full">
          <img
            src={product.photoSrc}
            alt={product.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081";
            }}
          />
        </div>
        <div className="p-2">
          <p className="font-medium">{product.title}</p>
        </div>
        <div>
          <button
            className="mr-4 mb-4 rounded-md bg-blue-300 px-2 py-1 font-medium text-white"
            onClick={() => navigate(`/update-product/${product._id}`)}
          >
            Update
          </button>
          <button
            className="mb-4 rounded-md bg-red-400 px-2 py-1 font-medium text-white"
            onClick={() => handleDeleteProduct(product._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  return (
    <section className="flex flex-col items-center gap-8">
      <h1 className="text-4xl font-bold">List of Products from the Backend</h1>
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleInputChange}
          className="rounded-md border border-slate-300 px-2 py-1"
        />
        <input
          type="text"
          name="photoSrc"
          placeholder="Photo URL"
          value={formData.photoSrc}
          onChange={handleInputChange}
          className="rounded-md border border-slate-300 px-2 py-1"
        />
        <button
          onClick={handleAddProduct}
          className="rounded-md bg-blue-300 px-2 py-1 font-medium text-white"
        >
          Add Product
        </button>
      </div>
      <div className="flex gap-4">{renderProductSectionContent()}</div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={`rounded-lg px-4 py-2 font-medium transition-all ${
            pagination.currentPage === 1
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`rounded-lg px-3 py-1 font-medium transition-all ${
                pagination.currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className={`rounded-lg px-4 py-2 font-medium transition-all ${
            pagination.currentPage === pagination.totalPages
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </section>
  );
}
