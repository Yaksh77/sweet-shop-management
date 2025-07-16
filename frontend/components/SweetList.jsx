import { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import ImageUpload from "./ImageUpload";

export default function SweetList() {
  const [sweets, setSweets] = useState([]);

  const fetchSweets = async () => {
    const res = await axios.get("http://localhost:5000/api/sweets");
    console.log("Fetched sweets:", res.data.data); // Debug log
    setSweets(res.data.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

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

  return (
    <div>
      <h2>🍬 All Sweets</h2>
      {sweets.map((sweet) => (
        <div key={sweet.id} className="card">
          <h3>
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
          <button onClick={() => handlePurchase(sweet.id, 1)}>
            🛒 Purchase 1
          </button>
          <ReviewForm sweetId={sweet.id} onAdded={fetchSweets} />
          <ImageUpload sweetId={sweet.id} onUploaded={fetchSweets} />
          <details>
            <summary>Reviews ({sweet.reviews?.length || 0})</summary>
            <ul>
              {sweet.reviews?.map((r, i) => (
                <li key={i}>
                  <strong>{r.name}:</strong> {r.message} ⭐{r.rating}
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}
