import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, loading, fetchCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    setUpdatingId(productId);
    try {
      await updateQuantity(productId, quantity);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    try {
      await removeFromCart(productId);
    } finally {
      setUpdatingId(null);
    }
  };

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Your cart</h1>

        {loading ? (
          <p className="text-sm text-gray-500">Loading cart...</p>
        ) : cart.items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-gray-500 mb-4">Your cart is empty.</p>
            <Link to="/" className="text-sm font-medium text-indigo-600">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-[10px]">No image</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">₹{item.product.price}</p>
                  </div>

                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      disabled={updatingId === item.product._id}
                      className="px-2.5 py-1 text-gray-600"
                    >
                      −
                    </button>
                    <span className="px-2.5 text-sm text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      disabled={updatingId === item.product._id}
                      className="px-2.5 py-1 text-gray-600"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.product._id)}
                    disabled={updatingId === item.product._id}
                    className="text-xs text-red-600 flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg font-medium text-gray-900">₹{total}</p>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-gray-900"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;