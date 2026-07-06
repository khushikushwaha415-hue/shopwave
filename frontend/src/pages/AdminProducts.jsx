import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || "",
      stock: product.stock,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
      } else {
        await API.post("/products", payload);
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-gray-900">Manage products</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900"
          >
            {showForm ? "Cancel" : "+ Add product"}
          </button>
        </div>

        {error && (
          <div className="text-sm px-4 py-3 rounded-lg mb-5 bg-red-50 text-red-600">
            {error}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-3"
          >
            <h2 className="text-sm font-medium text-gray-900 mb-2">
              {editingId ? "Edit product" : "New product"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                required
                className="px-3.5 py-2.5 rounded-lg outline-none border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
                style={{ fontSize: "16px" }}
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                required
                className="px-3.5 py-2.5 rounded-lg outline-none border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
                style={{ fontSize: "16px" }}
              />
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
                min="0"
                className="px-3.5 py-2.5 rounded-lg outline-none border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
                style={{ fontSize: "16px" }}
              />
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
                min="0"
                className="px-3.5 py-2.5 rounded-lg outline-none border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
                style={{ fontSize: "16px" }}
              />
            </div>

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL (optional)"
              className="w-full px-3.5 py-2.5 rounded-lg outline-none border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
              style={{ fontSize: "16px" }}
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg outline-none border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
              style={{ fontSize: "16px" }}
            />

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 bg-gray-900"
            >
              {saving ? "Saving..." : editingId ? "Update product" : "Create product"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading products...</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-[10px]">No image</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {product.category} · ₹{product.price} · {product.stock} in stock
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(product)}
                  className="text-xs font-medium text-indigo-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-xs font-medium text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <Link
          to="/admin/orders"
          className="inline-block mt-8 text-sm font-medium text-indigo-600"
        >
          View all orders →
        </Link>
      </div>
    </div>
  );
};

export default AdminProducts;