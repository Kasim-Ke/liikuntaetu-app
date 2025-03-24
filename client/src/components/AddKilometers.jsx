import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddKilometers = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [kilometers, setKilometers] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/kilometers/${user.id}`
        );
        setEntries(res.data);
      } catch (err) {
        console.error("Tietojen lataus epäonnistui:", err);
      }
    };

    if (user) fetchEntries();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !date || !kilometers) {
      alert("Täytä kaikki kentät!");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/kilometers`, {
        userId: user.id,
        date,
        kilometers: parseFloat(kilometers),
      });

      alert("Kilometrit tallennettu!");
      navigate("/leaderboard");
    } catch (err) {
      console.error("Virhe tallennuksessa:", err);
      alert("Tallennus epäonnistui.");
    }
  };

  const handleDelete = async (entryId) => {
    if (!confirm("Haluatko varmasti poistaa tämän merkinnän?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/kilometers/${entryId}`
      );
      setEntries(entries.filter((entry) => entry._id !== entryId));
      alert("Merkintä poistettu!");
    } catch (err) {
      console.error("Virhe poistettaessa:", err);
      alert("Poisto epäonnistui.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-[40%]  bg-white p-6 rounded-xl shadow-md space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Aiemmat merkinnät</h3>
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry._id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>
                {entry.date}: {entry.kilometers} km
              </span>
              <button
                onClick={() => handleDelete(entry._id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                Poista
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddKilometers;
