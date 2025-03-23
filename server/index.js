import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/user.js";
import Kilometer from "./models/kilometers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB yhteys (ilman deprecated-optioneita)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Yhdistetty MongoDB:hen"))
  .catch((err) => console.error("❌ Mongo-yhteysvirhe:", err));

// Testireitti
app.get("/", (req, res) => {
  res.send("Serveri toimii!");
});

app.post("/api/register", async (req, res) => {
  try {
    const { clerkId, firstName, lastName, email, department } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ error: "Vaadittavat kentät puuttuvat" });
    }

    // Tarkista löytyykö jo
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.status(200).json({
        message: "Käyttäjä löytyy jo",
        department: existingUser.department || null,
      });
    }

    // Luo uusi käyttäjä
    const newUser = new User({
      clerkId,
      firstName,
      lastName,
      email,
      department, // vaikka tämä olisikin undefined
    });
    await newUser.save();

    res.status(201).json({
      message: "Käyttäjä tallennettu MongoDB:hen",
      department: newUser.department || null,
    });
  } catch (err) {
    console.error("Käyttäjän tallennusvirhe:", err);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

app.post("/api/set-department", async (req, res) => {
  const { clerkId, department } = req.body;

  if (!clerkId || !department) {
    return res.status(400).json({ error: "Tiedot puuttuvat" });
  }

  try {
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: "Käyttäjää ei löydy" });

    user.department = department;
    await user.save();

    res.status(200).json({ message: "Osasto tallennettu" });
  } catch (err) {
    console.error("Virhe osaston tallennuksessa:", err);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

// GET: leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const data = await Kilometer.aggregate([
      {
        $group: {
          _id: "$userId",
          totalKilometers: { $sum: "$kilometers" },
        },
      },
      {
        $lookup: {
          from: "users", // HUOM: Mongo käyttää pienellä kokoelman nimeä
          localField: "_id",
          foreignField: "clerkId",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          totalKilometers: 1,
          firstName: "$userInfo.firstName",
          lastName: "$userInfo.lastName",
          department: "$userInfo.department",
        },
      },
      { $sort: { totalKilometers: -1 } },
      { $limit: 10 },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Virhe leaderboardissa:", err);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

// GET: omat kilometrit
app.get("/api/my-kilometers", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId puuttuu" });
  }

  try {
    const entries = await Kilometer.find({ userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error("Virhe haettaessa omia kilometrejä:", err);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

// PUT: muokkaa olemassa olevaa merkintää
app.put("/api/kilometers/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, date, kilometers } = req.body;

  try {
    const entry = await Kilometer.findById(id);

    if (!entry) {
      return res.status(404).json({ error: "Merkintää ei löydy" });
    }

    if (entry.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Ei oikeuksia muokata tätä merkintää" });
    }

    entry.date = date;
    entry.kilometers = kilometers;
    await entry.save();

    res.json({ message: "Päivitetty onnistuneesti" });
  } catch (err) {
    console.error("Virhe päivityksessä:", err);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

// POST: kilometrien tallennus
app.post("/api/kilometers", async (req, res) => {
  try {
    const { userId, date, kilometers } = req.body;

    if (!userId || !date || !kilometers) {
      return res.status(400).json({ error: "Kaikki kentät vaaditaan." });
    }

    const newEntry = new Kilometer({ userId, date, kilometers });
    await newEntry.save();

    res.status(201).json({ message: "Kilometri tallennettu!" });
  } catch (err) {
    console.error("Virhe kilometrin tallennuksessa:", err);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

// Serverin käynnistys
app.listen(PORT, () => {
  console.log(`🚀 Serveri käynnissä portissa ${PORT}`);
});
