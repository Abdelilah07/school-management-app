import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../slice/courseSlice";
import { FaCheckCircle, FaClock, FaSearch, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

// ProgressBar Component
const ProgressBar = ({ progress }) => {
  const percentage = Math.min(Math.max(progress, 0), 100); // Ensures progress is between 0 and 100

  return (
    <div className="relative pt-1">
      <label className="form-label block text-gray-200 font-semibold mb-2" htmlFor="progressBar">
        Progress
      </label>
      <div className="flex mb-2 items-center justify-between">
        <span className="text-gray-200">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full">
        <motion.div
          className="bg-blue-600 text-xs font-semibold text-center p-0.5 leading-none rounded-full"
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

const CourseList = () => {
  const dispatch = useDispatch();
  const [selectedModel, setSelectedModel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { courses = [], status, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses(selectedModel));
  }, [dispatch, selectedModel]);

  const handleModelChange = (event) => setSelectedModel(event.target.value);

  // Ensure courses is always an array before calling .filter
  const filteredCourses = Array.isArray(courses) ? courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedModel === "" || course.model === selectedModel)  // filter by model as well
  ) : [];

  return (
    <div className="bg-gray-800 p-8 min-h-screen rounded-lg shadow-lg space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-500 text-center mb-4 md:mb-0">
          Course Catalog
        </h1>
        <div className="flex items-center space-x-4">
          <FaSearch className="absolute left-4 top-3 p-1 text-white bg-blue-600 h-6 w-6 rounded" />
          <input
            type="text"
            placeholder="Search courses by title..."
            className="w-full md:max-w-xs p-3 pl-12 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <label className="text-white font-medium">Filter by Model:</label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Models</option>
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {status === "loading" ? (
        <div className="text-center text-white py-10">Loading courses...</div>
      ) : status === "failed" ? (
        <div className="text-center text-red-500 py-10">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">{course.name}</h3>
                  <div className={`flex items-center text-sm space-x-2 ${course.status === "completed" ? "text-green-500" : "text-blue-600"}`}>
                    {course.status === "completed" ? <FaCheckCircle /> : <FaClock />}
                    <span>{course.status}</span>
                  </div>
                </div>

                <div className="flex items-center mb-4 text-gray-400">
                  <FaUserAlt />
                  <span className="ml-2">{course.instructor}</span>
                </div>

                {/* Add the Progress Bar */}
                {course.status !== "completed" && (
                  <ProgressBar progress={course.progress || 0} />
                )}

                <div className="mt-4">
                  {course.status === "completed" ? (
                    <Link
                      to={`/quiz/${course.id}`}
                      className="w-full inline-block text-center py-2 text-white bg-blue-600 rounded-lg transition duration-300 hover:bg-blue-700"
                    >
                      Start Quiz
                    </Link>
                  ) : (
                    <Link
                      to={`/course/${course.id}`}
                      className="w-full inline-block text-center py-2 text-white bg-blue-600 rounded-lg transition duration-300 hover:bg-blue-700"
                    >
                      Start Course
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10">No courses available for the selected model.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList;
