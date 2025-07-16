import { useState, useEffect } from "react";
import axios from "axios";

export default function SweetForm({ onAdd }) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    quantity: "",
    greenScore: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/sweets", form);
    onAdd();
    setForm({
      id: "",
      name: "",
      category: "",
      price: "",
      quantity: "",
      greenScore: false,
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error("Category load failed:", err));
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <h2>➕ Add New Sweet</h2>
      <input
        name="id"
        value={form.id}
        onChange={handleChange}
        placeholder="ID"
        required
      />
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <select
        className="p-2 rounded bg-zinc-800 text-white"
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
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
      />
      <input
        name="quantity"
        type="number"
        value={form.quantity}
        onChange={handleChange}
        placeholder="Qty"
      />
      <label>
        <input
          type="checkbox"
          name="greenScore"
          checked={form.greenScore}
          onChange={handleChange}
        />{" "}
        🌿 Eco-Friendly
      </label>
      <button type="submit">Add Sweet</button>
    </form>
  );
}
