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

  const getMedal = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return index + 1;
    }
  };

  return (
    <div className="pt-24 px-4 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-amber-500 text-center">
        Leaderboard
      </h1>

      {/* Responsive Scroll Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-gray-800 text-white text-sm sm:text-base">
              <th className="p-2">#</th>
              <th className="p-2">Nimi</th>
              <th className="p-2">Osasto</th>
              <th className="p-2">Kilometrit</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={index}
                className="odd:bg-white even:bg-gray-100 text-sm sm:text-base"
              >
                <td className="p-2 font-bold">{getMedal(index)}</td>
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
    </div>
  );
};

export default Leaderboard;
