import { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/leaderboard`
        );
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Virhe leaderboard-haussa:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-amber-500">Leaderboard</h1>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2">#</th>
            <th className="p-2">Nimi</th>
            <th className="p-2">Osasto</th>
            <th className="p-2">Kilometrit</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-100">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="p-2">{user.department || "–"}</td>
              <td className="p-2">{user.totalKilometers.toFixed(1)} km</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
