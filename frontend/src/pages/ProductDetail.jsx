import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

  const [related, setRelated] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);

        const relatedRes = await API.get("/products", {
          params: { category: res.data.category },
        });
        setRelated(relatedRes.data.filter((p) => p._id !== id).slice(0, 4));
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data.reviews);
      setReviewCount(res.data.count);
      setAverageRating(res.data.averageRating);
    } catch (err) {
      // ignore
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setSubmittingReview(true);
    try {
      await API.post(`/reviews/${id}`, { rating: newRating, comment: newComment });
      setNewComment("");
      setNewRating(5);
      fetchReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
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
        <button onClick={() => navigate("/")} className="text-sm text-gray-500 mb-6">
          ← Back to products
        </button>

        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">No image</span>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">{product.category}</p>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-sm text-amber-500">
                {"★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating))}
              </span>
              <span className="text-xs text-gray-500">
                {averageRating > 0 ? `${averageRating} (${reviewCount} review${reviewCount !== 1 ? "s" : ""})` : "No reviews yet"}
              </span>
            </div>

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

                {message && <p className="text-sm text-green-600 mt-3">{message}</p>}
              </>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Related products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p._id}
                  to={`/products/${p._id}`}
                  className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs">No image</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{p.name}</h3>
                    <p className="text-sm text-gray-900 mt-1">₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Reviews {reviewCount > 0 && `(${reviewCount})`}
          </h2>

          <form
            onSubmit={handleReviewSubmit}
            className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3"
          >
            {reviewError && (
              <div className="text-sm px-4 py-3 rounded-lg bg-red-50 text-red-600">{reviewError}</div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-700">Your rating</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="px-3.5 py-2 rounded-lg outline-none border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
                style={{ fontSize: "16px" }}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              rows={2}
              placeholder="Share your thoughts about this product..."
              className="w-full px-3.5 py-2.5 rounded-lg outline-none border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
              style={{ fontSize: "16px" }}
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 bg-gray-900"
            >
              {submittingReview ? "Submitting..." : "Submit review"}
            </button>
          </form>

          {reviewsLoading ? (
            <p className="text-sm text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{r.user?.name || "Anonymous"}</p>
                    <span className="text-xs text-amber-500">
                      {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;