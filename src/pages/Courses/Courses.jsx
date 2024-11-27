import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../features/courses/coursesSlice';
import { fetchQuizzes } from '../../features/quizzes/quizzesSlice';

const Courses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, status, error } = useSelector((state) => state.courses);
  const { quizzes } = useSelector((state) => state.quizzes);

  // State for filters
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [selectedTeacherName, setSelectedTeacherName] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses());
      dispatch(fetchQuizzes());
    }
  }, [status, dispatch]);

  const handleAction = (course) => {
    if (course.status === 'completed') {
      const courseQuiz = quizzes.find(
        (quiz) => quiz.courseId === course.id || quiz.courseName === course.courseName
      );

      if (courseQuiz) {
        navigate(`/quiz/${courseQuiz.id}`);
      } else {
        navigate(`/courses/${course.id}`);
        console.warn(`No quiz found for course: ${course.courseName}`);
      }
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  // Filtered courses based on user selections
  const filteredCourses = courses.filter((course) => {
    const matchesCourseName = !selectedCourseName || course.courseName === selectedCourseName;
    const matchesTeacherName = !selectedTeacherName || course.teacherName === selectedTeacherName;
    return matchesCourseName && matchesTeacherName;
  });

  if (status === 'loading')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (status === 'failed')
    return <div className="p-8 text-red-600 text-center">Error: {error}</div>;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold space-y-2 mb-8">Your Courses</h2>

        {/* Filters Section */}
        <div className="flex mb-4 w-full gap-4">
          <select
            className="select select-primary w-1/2"
            value={selectedCourseName}
            onChange={(e) => setSelectedCourseName(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.courseName}>
                {course.courseName}
              </option>
            ))}
          </select>
          <select
            className="select select-primary w-1/2"
            value={selectedTeacherName}
            onChange={(e) => setSelectedTeacherName(e.target.value)}
          >
            <option value="">All Teachers</option>
            {[...new Set(courses.map((course) => course.teacherName))].map((teacherName) => (
              <option key={teacherName} value={teacherName}>
                {teacherName}
              </option>
            ))}
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl shadow-lg border border-gray-300 overflow-hidden"
              >
                <div className="relative group">
                  <img
                    src={course.imageUrl}
                    alt={course.courseName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{course.courseName}</h3>

                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.teacherName}</span>
                  </div>

                  {course.status === 'completed' && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleAction(course)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors duration-200 ${
                      course.status === 'completed'
                        ? 'border border-green-600 hover:bg-green-600 hover:text-white'
                        : 'border border-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {course.status === 'completed' ? 'Start Quiz' : 'Complete Course'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-12">
              No courses match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
