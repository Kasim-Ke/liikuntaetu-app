import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  department: { type: String }, // <-- tämä lisätään
});

export default mongoose.model("User", userSchema);
