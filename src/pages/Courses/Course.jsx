import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, markAsCompleted } from "../../features/courses/courseSlice";
import { FaCheckCircle, FaClock } from "react-icons/fa";

const Course = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { courses } = useSelector((state) => state.courses);

  const courseId = location.pathname.split("/").pop();
  const course = courses.find((course) => course.id.toString() === courseId);

  const [buttonText, setButtonText] = useState("End Lesson");

  useEffect(() => {
    if (!course) {
      dispatch(fetchCourses());
    }
  }, [dispatch, course]);

  const handleEndOfLesson = () => {
    // Mark the course as completed
    dispatch(markAsCompleted(courseId));
    // Change button text to 'Start Quiz'
    setButtonText("Start Quiz");
    // Navigate to course list
    navigate("/courses");
  };

  return (
    <div className="bg-[#34495E] p-8 rounded-lg shadow-lg space-y-8">
      {course ? (
        <>
          <h1 className="text-3xl font-bold text-white">{course.name}</h1>
          <p className="text-gray-400 text-sm mt-2">Instructor: {course.instructor}</p>
          {course.pdfUrl && (
            <a
              href={course.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mb-4 inline-block text-center py-4 text-white  transition duration-300 hover:border border-blue-20 rounded-lg w-full"
            >
              Lessoning
            </a>
          )}
          <button
            onClick={handleEndOfLesson}
            className="w-full mt-8 inline-block text-center py-2 text-white bg-green-500 rounded-lg transition duration-300 hover:bg-green-700"
          >
            {buttonText}
          </button>
        </>
      ) : (
        <p className="text-center text-white">Loading course...</p>
      )}
    </div>
  );
};

export default Course;
