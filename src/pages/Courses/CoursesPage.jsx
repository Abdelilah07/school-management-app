import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../features/courses/coursesSlice';
import { fetchQuizzes } from '../../features/quizzes/quizzesSlice';
import { PageHeader } from '../../components';
import { BookOpen, CheckCircle, ChevronRight } from 'lucide-react';

const CoursesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, status, error } = useSelector((state) => state.courses);
  const { quizzes } = useSelector((state) => state.quizzes);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses());
      dispatch(fetchQuizzes());
    }
  }, [status, dispatch]);

  const handleNavigation = (course) => {
    const quiz = quizzes.find((q) => q.courseId === course.id);
    navigate(quiz ? `/quiz/${quiz.id}` : `/courses/${course.id}`);
  };

  const filteredCourses = courses.filter(
    (c) => (!selectedCourse || c.courseName === selectedCourse) && (!selectedTeacher || c.teacherName === selectedTeacher)
  );

  if (status === 'loading')
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (status === 'failed')
    return <div className="text-center text-error">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-base-100 p-8 rounded-lg">
      <PageHeader title="Courses" />
      <div className="flex gap-4 mb-6">
        <select className="select select-bordered w-1/2" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.courseName}>{c.courseName}</option>
          ))}
        </select>
        <select className="select select-bordered w-1/2" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
          <option value="">All Teachers</option>
          {[...new Set(courses.map((c) => c.teacherName))].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length ? filteredCourses.map((course) => (
          <div key={course.id} className="card bg-base-100 shadow-xl border border-base-200">
            <figure><img src={course.imageUrl} alt={course.courseName} className="h-48 w-full object-cover" /></figure>
            <div className="card-body">
              <h2 className="card-title">{course.courseName}</h2>
              <p className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> {course.teacherName}</p>
              {course.status === 'completed' && <p className="text-success flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Completed</p>}
              <button onClick={() => handleNavigation(course)} className="btn btn-primary flex items-center gap-2">
                <ChevronRight className="w-5 h-5" /> {course.status === 'completed' ? 'Start Quiz' : 'Start Course'}
              </button>
            </div>
          </div>
        )) : <div className="text-center col-span-full">No courses available.</div>}
      </div>
    </div>
  );
};

export default CoursesPage;
