import { useState } from "react";
import axios from "axios";

export default function ReviewForm({ sweetId, onAdded }) {
  const [form, setForm] = useState({ name: "", message: "", rating: 5 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/sweets/${sweetId}/review`, {
        name: form.name,
        message: form.message,
        rating: Number(form.rating),
      });
      setForm({ name: "", message: "", rating: 5 });
      onAdded();
    } catch (err) {
      console.error(
        "Review submit failed:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Your name"
        required
      />
      <input
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Your review"
        required
      />
      <input
        name="rating"
        type="number"
        min="1"
        max="5"
        value={form.rating}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Review</button>
      <span>*(By adding a review, (Sweet) will learn 10 loyalty points.) </span>
    </form>
  );
}
