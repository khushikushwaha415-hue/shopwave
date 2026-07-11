import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    return [];
  }
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const wishlist = getWishlist();
    setWishlisted(wishlist.includes(product._id));
  }, [product._id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = getWishlist();
    let updated;

    if (wishlist.includes(product._id)) {
      updated = wishlist.filter((id) => id !== product._id);
      setWishlisted(false);
    } else {
      updated = [...wishlist, product._id];
      setWishlisted(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      // silently ignore for now
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition relative"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}

        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-sm"
          aria-label="Toggle wishlist"
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="p-3">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-amber-500">★★★★☆</span>
          <span className="text-xs text-gray-400">(4.2)</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
          <button
            onClick={handleQuickAdd}
            disabled={adding}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg text-white bg-gray-900 disabled:opacity-50"
          >
            {adding ? "..." : "+ Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;