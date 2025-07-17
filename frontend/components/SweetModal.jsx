import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SweetModal({ isOpen, onClose, onSubmit, sweet }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    quantity: "",
    category: "",
    ecoFriendly: false,
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // If `sweet` is passed (editing), populate form
  useEffect(() => {
    if (sweet) {
      setForm({ ...sweet });
    } else {
      setForm({
        id: "",
        name: "",
        price: "",
        quantity: "",
        category: "",
        ecoFriendly: false,
      });
    }
  }, [sweet]);

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.price || !form.quantity) return;
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {sweet ? "Edit Sweet" : "Add New Sweet"}
        </h2>

        {["id", "name", "price", "quantity"].map((field) => (
          <input
            key={field}
            placeholder={field.toUpperCase()}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
        ))}

        <select
          className="w-full p-2 mb-2 border rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className="flex items-center mb-4 gap-2">
          <input
            type="checkbox"
            checked={form.ecoFriendly}
            onChange={(e) =>
              setForm({ ...form, ecoFriendly: e.target.checked })
            }
          />
          Eco-Friendly 🌿
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-green-600 text-white rounded"
          >
            {sweet ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
