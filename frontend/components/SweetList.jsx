import { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import ImageUpload from "./ImageUpload";
import SweetModal from "./SweetModal";

export default function SweetList() {
  const [sweets, setSweets] = useState([]);
  const [filters, setFilters] = useState({ category: "", sort: "" });
  const [categories, setCategories] = useState([]);
  const [editSweet, setEditSweet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSweets = async () => {
    try {
      const queryParams = [];

      if (filters.category) queryParams.push(`category=${filters.category}`);
      if (filters.sort) queryParams.push(`sort=${filters.sort}`);

      const queryString = queryParams.length ? "?" + queryParams.join("&") : "";

      const res = await axios.get(
        `http://localhost:5000/api/sweets${queryString}`
      );
      setSweets(res.data.data);
    } catch (error) {
      console.error("Error fetching sweets:", error);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/sweets/${id}`);
    fetchSweets();
  };

  const handlePurchase = async (id, amount) => {
    await axios.patch(`http://localhost:5000/api/sweets/${id}/purchase`, {
      quantity: amount,
    });
    fetchSweets();
  };

  const getCategoryOptions = () => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error("Category load failed:", err));
  };

  useEffect(() => {
    fetchSweets();
    getCategoryOptions();
  }, [filters]);

  return (
    <div>
      <h1 className="text-2xl mt-2 mb-3"> 📝Select Category To Sort Sweets</h1>
      <select
        value={filters.category}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, category: e.target.value }))
        }
        className="mb-4 ml-2 mr-2 p-1"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, sort: e.target.value }))
        }
        className="p-1"
      >
        <option value="">Sort By</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="quantity_desc">Quantity: High to Low</option>
      </select>

      <h2 className="text-2xl mt-1 mb-3">🍬 All Sweets</h2>
      {sweets.map((sweet) => (
        <div key={sweet.id} className="card">
          <h3 className="text-xl font-bold">
            {sweet.name} {sweet.greenScore && <span>🌿</span>}
          </h3>
          {/* {sweet.imagePath && (
            <img
              src={`http://localhost:5000/${sweet.imagePath}`}
              alt={sweet.name}
              width="150"
            />
          )} */}
          <p>Category: {sweet.category}</p>
          <p>Price: ₹{sweet.price}</p>
          <p>Qty: {sweet.quantity}</p>
          <p>Points: 🎖 {sweet.loyaltyPoints}</p>
          <button onClick={() => handleDelete(sweet.id)}>❌ Delete</button>
          <button
            onClick={() => {
              setEditSweet(sweet);
              setIsModalOpen(true);
            }}
          >
            ✏️ Edit
          </button>
          <button onClick={() => handlePurchase(sweet.id, 1)}>
            🛒 Purchase 1
          </button>
          <span className="text-sm">
            *(This will Decrease Stock (Quantity) By 1)
          </span>
          <ReviewForm sweetId={sweet.id} onAdded={fetchSweets} />
          <ImageUpload sweetId={sweet.id} onUploaded={fetchSweets} />
          <details>
            <summary>Reviews ({sweet.reviews?.length || 0})</summary>
            <ul>
              {sweet.reviews?.map((r, i) => (
                <li key={i}>
                  <strong>{r.name}:</strong> {r.message} ✨{r.rating}
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}

      <SweetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sweet={editSweet}
        onSubmit={async (formData) => {
          if (editSweet) {
            await axios.post(
              `http://localhost:5000/api/sweets/${editSweet.id}`,
              formData
            );
          }
          fetchSweets();
        }}
      />
    </div>
  );
}
