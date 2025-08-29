
import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import dotenv from "dotenv";
import Cors from "cors";

dotenv.config();

const cors = Cors({
  origin: "*", // allow only your frontend
  methods: ["GET", "POST"],
});

// Helper to run middleware in serverless
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      resolve(result);
    });
  });
}

// Connect to MongoDB
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    let data = await Attendance.findOne();
    if (!data) {
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
    res.status(200).json(data);
  } else if (req.method === "POST") {
    let data = await Attendance.findOne();
    if (!data) {
      data = new Attendance({ subjects: req.body.subjects });
    } else {
      data.subjects = req.body.subjects;
    }
    await data.save();
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
