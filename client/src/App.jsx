import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import AddKilometers from "./components/AddKilometers";
import MyEntries from "./components/MyEntries";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<AddKilometers />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/my" element={<MyEntries />} />
      </Routes>
    </>
  );
}

export default App;
