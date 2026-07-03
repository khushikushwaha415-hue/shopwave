import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    setMessage("");
    try {
      await addToCart(product._id, quantity);
      setMessage("Added to cart!");
    } catch (err) {
      setMessage("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <p className="text-sm text-gray-500 px-4 sm:px-8 py-8">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <p className="text-sm text-red-600 px-4 sm:px-8 py-8">{error || "Product not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 mb-6"
        >
          ← Back to products
        </button>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">No image</span>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">{product.category}</p>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1>
            <p className="text-xl font-medium text-gray-900 mb-4">₹{product.price}</p>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            <p className="text-xs text-gray-500 mb-4">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>

            {product.stock > 0 && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <label className="text-xs font-medium text-gray-700">Quantity</label>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-gray-600"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-3 py-1.5 text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 bg-gray-900"
                >
                  {adding ? "Adding..." : "Add to cart"}
                </button>

                {message && (
                  <p className="text-sm text-green-600 mt-3">{message}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;