import { useEffect, useState, useTransition } from "react";
import { Product, ProductInput } from "../types/product";
import { getProducts, postProduct, deleteProduct } from "../api/product";
import { isResponseError } from "../utils/error";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants";
import { getPaginationRange } from "../utils/paginationRange";
import ProductSearch from "../utils/ProductSeach";

export default function ProductSection() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanged, setHasChanged] = useState(true);
  const [formData, setFormData] = useState<ProductInput>({
    title: "",
    photoSrc: "",
  });

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    startTransition(async () => {
      let all: Product[] = [];
      let pageNum = 1;
      let keepFetching = true;
      while (keepFetching) {
        const response = await getProducts(pageNum, 50);
        if (isResponseError(response)) {
          setErrorMessage(response.error.message);
          break;
        }
        all = all.concat(response.data.products);
        if (
          response.data.pagination.currentPage >=
          response.data.pagination.totalPages
        ) {
          keepFetching = false;
        } else {
          pageNum++;
        }
      }
      setAllProducts(all);
      setHasChanged(false);
    });
  };

  useEffect(() => {
    fetchAllProducts();
  }, [hasChanged]);

  const filteredProducts = searchQuery
    ? allProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allProducts;

  const filteredTotalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / pageSize),
  );
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    if (page > filteredTotalPages) setPage(1);
  }, [searchQuery, filteredTotalPages]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= filteredTotalPages) {
      setPage(newPage);
    }
  };

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

  const renderProductSectionContent = () => {
    if (isPending) return <p>Loading...</p>;
    if (errorMessage) return <p>{errorMessage}</p>;

    if (paginatedProducts.length === 0) {
      return <p>No products found.</p>;
    }

    return paginatedProducts.map((product) => (
      <div
        key={product._id}
        className="flex w-48 flex-col items-center overflow-hidden rounded-lg border border-slate-200 shadow-md"
      >
        <div className="h-64 w-full">
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
          <p className="text-center font-medium">{product.title}</p>
        </div>
        <div className="mt-auto flex gap-4 pb-4">
          <button
            className="rounded-md bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
            onClick={() => navigate(`/update-product/${product._id}`)}
          >
            Update
          </button>
          <button
            className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
            onClick={() => handleDeleteProduct(product._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const renderPagination = () => {
    const paginationRange = getPaginationRange(page, filteredTotalPages);

    return (
      <div className="flex items-center gap-2">
        {paginationRange.map((item, index) => {
          if (typeof item === "string") {
            return (
              <span key={index} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={index}
              onClick={() => handlePageChange(item)}
              className={`rounded-lg px-3 py-1 font-medium transition-all ${
                page === item
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <section className="flex flex-col items-center gap-8">
      <h1 className="text-4xl font-bold">List of Products from the Backend</h1>
      <p>Search is work in progress need to be compatible with backend</p>
      <ProductSearch
        value={search}
        onSearch={(query) => {
          setSearch(query);
          setSearchQuery(query);
          setPage(1);
        }}
        onClear={() => {
          setSearch("");
          setSearchQuery("");
          setPage(1);
        }}
      />
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
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`rounded-lg px-4 py-2 font-medium transition-all ${
            page === 1
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Prev
        </button>
        {renderPagination()}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === filteredTotalPages}
          className={`rounded-lg px-4 py-2 font-medium transition-all ${
            page === filteredTotalPages
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
