import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const statusColors = {
  placed: "bg-blue-50 text-blue-600",
  shipped: "bg-amber-50 text-amber-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

const statusOptions = ["placed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      setError("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-gray-900">All orders</h1>
          <Link to="/admin" className="text-sm font-medium text-indigo-600">
            ← Manage products
          </Link>
        </div>

        {error && (
          <div className="text-sm px-4 py-3 rounded-lg mb-5 bg-red-50 text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="text-xs text-gray-700 font-mono">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="text-xs text-gray-700">
                      {order.user?.name} ({order.user?.email})
                    </p>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Shipping: {order.shippingAddress}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    Total: ₹{order.totalAmount}
                  </p>

                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border-0 outline-none ${statusColors[order.orderStatus] || "bg-gray-50 text-gray-600"}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;