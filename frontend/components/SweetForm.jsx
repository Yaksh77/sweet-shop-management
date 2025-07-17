import { useState } from "react";
import axios from "axios";
import SweetModal from "./SweetModal";

export default function SweetForm({ onAdd }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addSweet, setAddSweet] = useState(null);

  return (
    <>
      <button
        onClick={() => {
          setAddSweet(null); // used to indicate this is an ADD, not an edit
          setIsModalOpen(true);
        }}
      >
        ➕ Add Sweet
      </button>

      <SweetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sweet={addSweet}
        onSubmit={async (formData) => {
          // Always call this for new sweet
          await axios.post("http://localhost:5000/api/sweets", formData);
          onAdd();
        }}
      />
    </>
  );
}
