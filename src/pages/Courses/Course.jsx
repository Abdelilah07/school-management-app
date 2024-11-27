import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../../features/quizzes/quizzesSlice';
import { BookOpen, FileText, Clock, Award, ChevronRight, Play } from 'lucide-react';
import QuizCard from '../Quizzes/QuizCard';

const Course = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isCourseEnded, setIsCourseEnded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [expandedContent, setExpandedContent] = useState({});

  const quizzes = useSelector((state) => state.quizzes.quizzes);
  const quizzesStatus = useSelector((state) => state.quizzes.status);

  const courseQuizzes = isCourseEnded
    ? quizzes.filter((quiz) => quiz.courseId === courseId || quiz.courseName === course?.courseName)
    : [];

  const toggleContentDescription = (index) => {
    setExpandedContent((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const courseResponse = await axios.get(`http://localhost:3000/courses/${courseId}`);
        if (courseResponse.data) {
          setCourse(courseResponse.data);
          setIsCourseEnded(courseResponse.data.status === 'completed');
        } else {
          setError('Course not found');
        }

        if (quizzesStatus === 'idle') {
          await dispatch(fetchQuizzes());
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Course not found or network error');
      }
    };

    fetchData();
  }, [courseId, dispatch, quizzesStatus]);

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleEndCourse = async () => {
    try {
      await axios.patch(`http://localhost:3000/courses/${courseId}`, {
        status: 'completed',
      });

      setIsCourseEnded(true);
      setCourse((prevCourse) => ({
        ...prevCourse,
        status: 'completed',
      }));
    } catch (error) {
      console.error('Error ending course:', error);
    }
  };

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!course)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="animate-pulse rounded-full h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen to-purple-50 py-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Glassmorphism Effect */}
        <div className=" rounded-2xl shadow-2xl p-6 mb-10 border border-white/30">
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {course.courseName}
          </h1>
          <div className="flex items-center space-x-6 text-gray-700">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-medium">
                Status:
                <span className={`ml-2 ${isCourseEnded ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isCourseEnded ? 'Completed' : 'In Progress'}
                </span>
              </span>
            </div>
            {course.pdfUrl && (
              <button
                onClick={() => window.open(course.pdfUrl, '_blank')}
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
              >
                <FileText className="w-5 h-5 mr-2" />
                Course Materials
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content with Enhanced Card Design */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Preview with Modern Overlay */}
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={course.imageUrl}
                alt={course.courseName}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <button
                  onClick={() => window.open(course.videoLink, '_blank')}
                  className="bg-white/30 backdrop-blur-sm rounded-full p-6 hover:bg-white/40 transition-all"
                >
                  <Play className="w-16 h-16 text-white" />
                </button>
              </div>
            </div>

            {/* Description and Content Sections with Soft Shadows */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Course Description</h2>
                <p className="text-gray-700 leading-relaxed">{course.courseDescription}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Course Content</h2>
                <div className="space-y-4">
                  {course.contentOfCourse.map((item, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-4 bg-blue-50/50 rounded-r-xl transition-all hover:bg-blue-100/50 hover:shadow-md"
                    >
                      <h3
                        onClick={() => toggleContentDescription(index)}
                        className="text-lg font-semibold text-blue-700 mb-2 flex items-center cursor-pointer hover:text-blue-900 transition-colors"
                      >
                        <ChevronRight
                          className={`w-5 h-5 mr-2 text-blue-500 transform transition-transform ${
                            expandedContent[index] ? 'rotate-90' : ''
                          }`}
                        />
                        {item.contentName}
                      </h3>
                      {expandedContent[index] && (
                        <p className="text-gray-700 leading-relaxed pl-7 mt-2 animate-fade-in">
                          {item.contentDescription}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Quizzes Section with Animated Cards */}
            {isCourseEnded && courseQuizzes.length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-purple-600">Course Quizzes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courseQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                      >
                        <QuizCard quiz={quiz} onQuizStart={handleStartQuiz} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar with Floating Card Design */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100/50 transform transition-all hover:scale-105 hover:shadow-4xl">
              {isCourseEnded ? (
                <div className="text-center">
                  <Award className="w-24 h-24 mx-auto text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold text-blue-600 mb-6">Course Completed!</h3>
                  {courseQuizzes.length > 0 && (
                    <button
                      onClick={() => handleStartQuiz(courseQuizzes[0].id)}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Start Quiz
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold text-blue-800">In Progress</h3>
                  </div>
                  <button
                    onClick={handleEndCourse}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all"
                  >
                    End Course
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
