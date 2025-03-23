import mongoose from "mongoose";

const kilometerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  kilometers: { type: Number, required: true },
});

export default mongoose.model("Kilometer", kilometerSchema);
