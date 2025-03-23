import { useState } from "react";
import axios from "axios";

const DepartmentModal = ({ clerkId, onDepartmentSaved }) => {
  const [department, setDepartment] = useState("");

  const handleSubmit = async () => {
    if (!department) return alert("Valitse osasto!");

    try {
      await axios.post("http://localhost:5000/api/set-department", {
        clerkId,
        department,
      });

      onDepartmentSaved(department); // sulje modal
    } catch (err) {
      console.error("Osaston tallennus epäonnistui:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Valitse osasto</h2>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-3 border rounded-md mb-4"
        >
          <option value="">-- Valitse osasto --</option>
          <option value="Huolto">Huolto</option>
          <option value="Varasto">Varasto</option>
          <option value="Johto">Johto</option>
          <option value="Tuotanto">Tuotanto</option>
          <option value="Muu">Muu</option>
        </select>

        <button
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Tallenna osasto
        </button>
      </div>
    </div>
  );
};

export default DepartmentModal;
