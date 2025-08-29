const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  courseCode: String,
  conducted: Number,
  absent: Number,
});

const AttendanceSchema = new mongoose.Schema({
  subjects: [SubjectSchema],
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
