import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";

const MyEntries = () => {
  const { user } = useUser();
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ date: "", kilometers: "" });

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/my-kilometers`,
          {
            params: { userId: user.id },
          }
        );
        setEntries(res.data);
      } catch (err) {
        console.error("Virhe haettaessa merkintöjä:", err);
      }
    };

    fetchEntries();
  }, [user]);

  const startEditing = (entry) => {
    setEditingId(entry._id);
    setEditData({
      date: entry.date.split("T")[0],
      kilometers: entry.kilometers,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/kilometers/${editingId}`,
        {
          userId: user.id,
          date: editData.date,
          kilometers: parseFloat(editData.kilometers),
        }
      );

      const updated = entries.map((entry) =>
        entry._id === editingId
          ? {
              ...entry,
              date: editData.date,
              kilometers: parseFloat(editData.kilometers),
            }
          : entry
      );

      setEntries(updated);
      setEditingId(null);
    } catch (err) {
      console.error("Virhe päivityksessä:", err);
      alert("Päivitys epäonnistui.");
    }
  };

  const deleteEntry = async (id) => {
    if (!confirm("Haluatko varmasti poistaa tämän merkinnän?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/kilometers/${id}`
      );
      setEntries(entries.filter((entry) => entry._id !== id));
      setEditingId(null);
    } catch (err) {
      console.error("Virhe poistettaessa:", err);
      alert("Poisto epäonnistui.");
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
        Omat merkinnät
      </h1>

      {entries.map((entry) => (
        <div
          key={entry._id}
          className="mb-4 p-4 border rounded-lg bg-white shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
        >
          {editingId === entry._id ? (
            <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
              <input
                type="date"
                name="date"
                value={editData.date}
                onChange={handleEditChange}
                className="border p-2 rounded w-full sm:w-[150px]"
              />
              <input
                type="number"
                step="0.1"
                name="kilometers"
                value={editData.kilometers}
                onChange={handleEditChange}
                className="border p-2 rounded w-full sm:w-[100px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Tallenna
                </button>
                <button
                  onClick={() => deleteEntry(editingId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Poista
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0 sm:items-center">
              <span>{new Date(entry.date).toLocaleDateString("fi-FI")}</span>
              <span>{entry.kilometers} km</span>
              <button
                onClick={() => startEditing(entry)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Muokkaa
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyEntries;
