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
        entry._id === editingId ? { ...entry, ...editData } : entry
      );

      setEntries(updated);
      setEditingId(null);
    } catch (err) {
      console.error("Virhe päivityksessä:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Omat merkinnät</h1>

      {entries.map((entry) => (
        <div
          key={entry._id}
          className="mb-4 p-4 border rounded-lg bg-white shadow flex justify-between items-center"
        >
          {editingId === entry._id ? (
            <div className="flex gap-4 w-full items-center">
              <input
                type="date"
                name="date"
                value={editData.date}
                onChange={handleEditChange}
                className="border p-2 rounded w-[150px]"
              />
              <input
                type="number"
                step="0.1"
                name="kilometers"
                value={editData.kilometers}
                onChange={handleEditChange}
                className="border p-2 rounded w-[100px]"
              />
              <button
                onClick={saveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Tallenna
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-600 underline"
              >
                Peruuta
              </button>
            </div>
          ) : (
            <div className="flex justify-between w-full items-center">
              <span>{new Date(entry.date).toLocaleDateString("fi-FI")}</span>
              <span>{entry.kilometers} km</span>
              <button
                onClick={() => startEditing(entry)}
                className="text-blue-600 underline"
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
