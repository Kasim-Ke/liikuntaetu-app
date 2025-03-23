import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddKilometers = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [kilometers, setKilometers] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !date || !kilometers) {
      alert("Täytä kaikki kentät!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/kilometers", {
        userId: user.id,
        date,
        kilometers: parseFloat(kilometers),
      });

      alert("Kilometrit tallennettu!");
      navigate("/leaderboard"); // ohjaa takaisin
    } catch (err) {
      console.error("Virhe tallennuksessa:", err);
      alert("Tallennus epäonnistui.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto my-8 bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold mb-2">Lisää päivän kilometrit</h2>

      <div>
        <label className="block mb-1 font-medium">Päivämäärä</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Kilometrit (yhteensä meno + paluu)
        </label>
        <input
          type="number"
          step="0.1"
          value={kilometers}
          onChange={(e) => setKilometers(e.target.value)}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Tallenna
      </button>
    </form>
  );
};

export default AddKilometers;
