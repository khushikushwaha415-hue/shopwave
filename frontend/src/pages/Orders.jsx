import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const statusColors = {
  placed: "bg-blue-50 text-blue-600",
  shipped: "bg-amber-50 text-amber-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

const Orders = () => {
  const location = useLocation();
  const placedOrderId = location.state?.placedOrderId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/myorders");
        setOrders(res.data);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-xl font-medium text-gray-900 mb-6">My orders</h1>

        {placedOrderId && (
          <div className="text-sm px-4 py-3 rounded-lg mb-5 bg-green-50 text-green-700">
            Order placed successfully! Your payment was confirmed.
          </div>
        )}

        {error && (
          <div className="text-sm px-4 py-3 rounded-lg mb-5 bg-red-50 text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="text-xs text-gray-700 font-mono">{order._id}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.orderStatus] || "bg-gray-50 text-gray-600"}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;