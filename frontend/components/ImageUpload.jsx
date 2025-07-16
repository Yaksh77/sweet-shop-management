import { useState } from "react";
import axios from "axios";

export default function ImageUpload({ sweetId, onUploaded }) {
  const [file, setFile] = useState(null);

  const uploadImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    await axios.post(
      `http://localhost:5000/api/sweets/${sweetId}/image`,
      formData
    );
    setFile(null);
    onUploaded();
  };

  return (
    <form onSubmit={uploadImage}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
      />
      <button type="submit">📤 Upload Image</button>
    </form>
  );
}
