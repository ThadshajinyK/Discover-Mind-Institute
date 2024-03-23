import axios from "axios";
import { useState } from "react";

const DisplayDetails = () => {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState([]);
  const [courseFee, setCourseFee] = useState([]);

  const getAllCourses = () => {
    axios
      .get("http://localhost:3001/getCourses")
      .then((response) => {
        setCourses(response.data); // dont forget to put data
      })
      .catch((error) => {
        console.error("Error fetching courses", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); //prevent deafult form submission behavior
    axios
      .post("http://localhost:3001/postCourse/", { courseName: courseTitle, courseFee: courseFee })
      .then((response) => {
        console.log("course Added successfully:", response.data);
        setCourseTitle(""); //clear form fields
        setCourseFee(""); //clear form fields
        getAllCourses();
      })
      .catch((error) => {
        console.error("error adding course", error);
      });
  };

  const deleteData = (index) => {
    axios
      .delete(`http://localhost:3001/deleteCourse/${index}`)
      .then((response) => {
        console.log("course deleted successfully:", response.data);
        getAllCourses(); //fetch updated course list
      })
      .catch((error) => {
        console.error("Error deleting course", error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        Course Title:{" "}
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
        />
        <br />
        <br />
        {courseTitle} <br />
        Course Fee:{" "}
        <input
          type="text"
          value={courseFee}
          onChange={(e) => setCourseFee(e.target.value)}
        />
        <br />
        <br />
        {courseFee}
        <br />
        <button type="submit">Submit</button>
      </form>

      <button onClick={getAllCourses}>Get courses</button>

      {courses.map((course) => (
        <div key={course.courseID}>
            <p>Course id: {course.courseID}</p>
          <p>Course Title: {course.courseName}</p>
          <p>Course Fee: {course.courseFee}</p>

          <button onClick={()=> deleteData(course.courseID)}>Delete this</button>
        </div>
      ))}
    </>
  );
};

export default DisplayDetails;
