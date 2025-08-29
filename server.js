const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Attendance = require("./models/Attendance");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// GET attendance
app.get("/api/attendance", async (req, res) => {
  try {
    let data = await Attendance.findOne();
    if (!data) {
      // create default if none
      data = new Attendance({
        subjects: [
          { courseCode: "Service Oriented Architecture", conducted: 17, absent: 1 },
          { courseCode: "Full Stack Web Development", conducted: 15, absent: 1 },
          { courseCode: "Internet of Things", conducted: 15, absent: 3 },
          { courseCode: "Wireless Sensor Networks", conducted: 15, absent: 3 },
          { courseCode: "Semiconductor Packaging Technologies", conducted: 17, absent: 3 },
          { courseCode: "Behavioral Psychology", conducted: 15, absent: 0 },
        ],
      });
      await data.save();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST attendance
app.post("/api/attendance", async (req, res) => {
  try {
    let data = await Attendance.findOne();
    if (!data) {
      data = new Attendance({ subjects: req.body.subjects });
    } else {
      data.subjects = req.body.subjects;
    }
    await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
