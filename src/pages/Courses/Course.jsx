import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../../features/quizzes/quizzesSlice';
import axios from 'axios';
import { Clock, Award, Play, ChevronRight, BookOpen } from 'lucide-react';
import QuizCard from '../Quizzes/QuizCard';

const Course = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isCourseEnded, setIsCourseEnded] = useState(false);
  const [expandedContent, setExpandedContent] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quizzes.quizzes);
  const quizzesStatus = useSelector((state) => state.quizzes.status);

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/courses/${courseId}`);
        setCourse(data);
        setIsCourseEnded(data.status === 'completed');
        if (quizzesStatus === 'idle') dispatch(fetchQuizzes());
      } catch {
        setCourse(null);
      }
    };
    fetchData();
  }, [courseId, dispatch, quizzesStatus]);

  const handleStartQuiz = (quizId) => navigate(`/quiz/${quizId}`);
  const handleEndCourse = async () => {
    await axios.patch(`http://localhost:3000/courses/${courseId}`, { status: 'completed' });
    setIsCourseEnded(true);
  };

  if (!course) return <div className="text-center text-red-600 p-8">Course not found</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="card bg-base-100 shadow-xl p-6">
        <h1 className="text-3xl font-bold text-primary">{course.courseName}</h1>
        <div className="flex gap-4 mt-2">
          <Clock className="w-5 h-5" />
          <span className={isCourseEnded ? 'text-green-600' : 'text-yellow-600'}>
            {isCourseEnded ? 'Completed' : 'In Progress'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card shadow-lg">
            <figure>
              <img src={course.imageUrl} alt={course.courseName} className="w-full" />
            </figure>
            <div className="card-body">
              <button
                className="btn btn-primary"
                onClick={() => window.open(course.videoLink, '_blank')}
              >
                <Play className="w-5 h-5" /> Watch Course Video
              </button>
            </div>
          </div>

          <div className="card shadow-md p-4">
            <h2 className="text-xl font-semibold">Course Description</h2>
            <p>{course.courseDescription}</p>
          </div>

          <div className="card shadow-md p-4">
            <h2 className="text-xl font-semibold">Course Content</h2>
            {course.contentOfCourse.map((item, index) => (
              <div key={index} className="collapse collapse-arrow border border-base-300">
                <input
                  type="checkbox"
                  onClick={() =>
                    setExpandedContent({ ...expandedContent, [index]: !expandedContent[index] })
                  }
                />
                <div className="collapse-title flex items-center gap-2 cursor-pointer">
                  <ChevronRight
                    className={`w-5 h-5 ${expandedContent[index] ? 'rotate-90' : ''}`}
                  />{' '}
                  {item.contentName}
                </div>
                <div className="collapse-content">
                  <p>{item.contentDescription}</p>
                </div>
              </div>
            ))}
          </div>

          {isCourseEnded && quizzes.some((quiz) => quiz.courseId === courseId) && (
            <div className="card shadow-md p-4">
              <h2 className="text-xl font-semibold">Course Quizzes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes
                  .filter((quiz) => quiz.courseId === courseId)
                  .map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} onQuizStart={handleStartQuiz} />
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="card bg-base-100 shadow-lg p-6 text-center">
          {isCourseEnded ? (
            <>
              <Award className="w-16 h-16 text-success mx-auto" />
              <h3 className="text-xl font-bold text-success">Course Completed!</h3>
              {quizzes.some((quiz) => quiz.courseId === courseId) && (
                <button
                  className="btn btn-primary w-full mt-4"
                  onClick={() =>
                    handleStartQuiz(quizzes.find((quiz) => quiz.courseId === courseId).id)
                  }
                >
                  Start Quiz
                </button>
              )}
            </>
          ) : (
            <>
              <BookOpen className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-lg font-semibold text-primary">In Progress</h3>
              <button className="btn btn-success w-full mt-4" onClick={handleEndCourse}>
                End Course
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;
