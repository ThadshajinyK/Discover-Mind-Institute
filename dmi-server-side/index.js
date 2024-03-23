const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/dmiDb");

// Define a separate schema for your counter collection
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1 },
});

// Create a model for the counter collection
const Counter = mongoose.model("Counter", counterSchema);

const courseSchema = new mongoose.Schema({
  courseID: {
    type: Number,
    unique: true, // Generating default value
  },
  courseName: {
    type: String,
    required: true,
  },
  courseFee: {
    type: Number,
    required: true,
  },
});

// Define pre-save middleware to auto-increment the courseID field
courseSchema.pre("save", async function (next) {
  const doc = this;
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "courseID" }, // Counter document ID
      { $inc: { sequence_value: 1 } }, // Increment the sequence value
      { new: true, upsert: true }
    );
    doc.courseID = counter.sequence_value; // Assign the incremented value to courseID
    next();
  } catch (error) {
    next(error);
  }
});

const courseModel = new mongoose.model("courses", courseSchema);

app.get("/getCourses", (req, res) => {
  try {
    courseModel.find({}).then(function (courses) {
      res.json(courses);
    });
  } catch (error) {
    console.error("Error fetching Courses", error);
  }
});

app.get("/getCourseById/:index", (req, res) => {
  try {
    courseModel.find({ _id: index }).then(function (courses) {
      res.json(courses);
    });
  } catch (error) {
    console.log("error fetching courses by courseID", error);
  }
});

app.post("/postCourse", async (req, res) => {
  const newCourse = new courseModel(req.body);
  try {
    await newCourse.save();
    res.json(newCourse);
  } catch (error) {
    console.error("Error posting course:", error);
  }
});

app.delete("/deleteCourse/:courseID", async (req, res) => {
  const indexToDelete = req.params.courseID;
  try {
    await courseModel.findOneAndDelete({ courseID: indexToDelete });
    res.json({ message: "Course is deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
  }
});

app.listen("3001", () => {
  console.log("server is running");
});
