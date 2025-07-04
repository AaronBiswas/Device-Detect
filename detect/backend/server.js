import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://savybiswas15:MIF7ahLS2kPQRXug@cluster0.wwywkvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/school_dashboard"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose Schema
const interactionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  deviceType: { type: String, required: true },
  ipv4: { type: String },
  ipv6: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Interaction = mongoose.model("Interaction", interactionSchema);

// API Endpoint
app.post("/api/v1/detector", async (req, res) => {
  const { deviceType } = req.body;
  const sessionId = req.headers["x-session-id"];
  const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const ipv6 = rawIp;
  const ipv4 = rawIp?.replace(/^::ffff:/, "");

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required." });
  }

  try {
    const existingInteraction = await Interaction.findOne({ sessionId });
    if (existingInteraction) {
      return res.status(200).json({ message: "Interaction already recorded." });
    }

    const newInteraction = await Interaction.create({
      sessionId,
      deviceType,
      ipv4,
      ipv6,
    });
    res
      .status(201)
      .json({ message: "Interaction stored.", interaction: newInteraction });
  } catch (error) {
    console.error("Storage error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
