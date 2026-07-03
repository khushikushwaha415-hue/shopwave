import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#111827",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#dc2626" },
  },
};

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const createIntent = async () => {
      try {
        const res = await API.post("/orders/create-payment-intent");
        setClientSecret(res.data.clientSecret);
        setTotalAmount(res.data.totalAmount);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to start checkout.");
      }
    };

    createIntent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      try {
        const res = await API.post("/orders", {
          shippingAddress,
          paymentIntentId: paymentIntent.id,
        });
        await fetchCart();
        navigate(`/orders`, { state: { placedOrderId: res.data._id } });
      } catch (err) {
        setError(err.response?.data?.message || "Payment succeeded but order failed to save.");
      }
    }

    setLoading(false);
  };

  if (!cart.items.length) {
    return (
      <div className="min-h-screen bg-[#fafaf8]">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 sm:px-8 py-16 text-center">
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-xl font-medium text-gray-900 mb-6">Checkout</h1>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="mb-5 pb-5 border-b border-gray-100">
            <p className="text-xs text-gray-500">Total amount</p>
            <p className="text-lg font-medium text-gray-900">₹{totalAmount}</p>
          </div>

          {error && (
            <div className="text-sm px-4 py-3 rounded-lg mb-5 bg-red-50 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-700">
                Shipping address
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg outline-none transition border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
                style={{ fontSize: "16px" }}
                placeholder="House no, street, city, state, pincode"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-700">
                Card details
              </label>
              <div className="w-full px-3.5 py-3 rounded-lg border border-gray-200 bg-white">
                <CardElement options={cardStyle} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Test card: 4242 4242 4242 4242, any future date, any CVC
              </p>
            </div>

            <button
              type="submit"
              disabled={!stripe || loading || !clientSecret}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 bg-gray-900"
            >
              {loading ? "Processing..." : `Pay ₹${totalAmount}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;