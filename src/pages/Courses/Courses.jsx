import { useEffect, useState, useRef } from 'react';
import { BookOpen, CheckCircle, Flame,Swords,ChevronRight,BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../features/courses/coursesSlice';
import { fetchQuizzes } from '../../features/quizzes/quizzesSlice';



const Courses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, status, error } = useSelector((state) => state.courses);
  const { quizzes } = useSelector((state) => state.quizzes);
  const courseGridRef = useRef(null);

  // State for filters and interactions
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [selectedTeacherName, setSelectedTeacherName] = useState('');
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses());
      dispatch(fetchQuizzes());
    }
  }, [status, dispatch]);

  // Particle effect for card interactions
  const createNetherParticles = (event) => {
    const particlesContainer = event.currentTarget.querySelector('.particles-container');
    if (!particlesContainer) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add(
        'absolute', 
        'rounded-full', 
        'bg-nether-flame', 
        'opacity-70', 
        'pointer-events-none',
        'animate-nether-particle'
      );
      
      particle.style.width = `${Math.random() * 8}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      particlesContainer.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        particlesContainer.removeChild(particle);
      }, 1000);
    }
  };

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
      <div className="flex items-center justify-center min-h-screen bg-nether-bg">
        <div className="animate-volcanic-pulse rounded-full h-24 w-24 bg-nether-flame shadow-volcanic-glow"></div>
      </div>
    );

  if (status === 'failed')
    return (
      <div className="p-8 text-nether-lava text-center bg-nether-bg min-h-screen flex items-center justify-center">
        <div className="bg-nether-dark-stone p-8 rounded-xl border-2 border-nether-lava shadow-volcanic-glow">
          <Swords className="mx-auto mb-4 text-nether-lava" size={48} />
          <p className="text-2xl">Error in the Nether Realm: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-nether-bg text-nether-text py-12 relative overflow-hidden">
      {/* Nether Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-nether-bg via-nether-dark-stone to-nether-lava opacity-50 animate-nether-flow"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://nether.dev/nether-pattern.svg')] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-bold mb-8 text-nether-flame border-b-4 border-nether-flame pb-4 flex items-center">
          <BookMarked className="mr-4 text-nether-flame" size={48} />
          Courses
        </h2>

        {/* Filters Section */}
        <div className="flex mb-8 w-full gap-4">
          <div className="w-1/2 relative group">
            <select
              className="w-full bg-nether-dark-stone text-nether-text border-2 border-nether-flame rounded-xl p-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-nether-flame transition-all duration-300 hover:border-opacity-80"
              value={selectedCourseName}
              onChange={(e) => setSelectedCourseName(e.target.value)}
            >
              <option value="" className="bg-nether-dark-stone">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.courseName} className="bg-nether-dark-stone">
                  {course.courseName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-nether-flame">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="w-1/2 relative group">
            <select
              className="w-full bg-nether-dark-stone text-nether-text border-2 border-nether-flame rounded-xl p-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-nether-flame transition-all duration-300 hover:border-opacity-80"
              value={selectedTeacherName}
              onChange={(e) => setSelectedTeacherName(e.target.value)}
            >
              <option value="" className="bg-nether-dark-stone">All Teachers</option>
              {[...new Set(courses.map((course) => course.teacherName))].map((teacherName) => (
                <option key={teacherName} value={teacherName} className="bg-nether-dark-stone">
                  {teacherName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-nether-flame">
              <Swords className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div 
          ref={courseGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCourses.length ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`relative rounded-3xl bg-nether-dark-stone border-2 border-nether-flame overflow-hidden transform transition-all duration-500 
                  ${activeCard === course.id 
                    ? 'scale-105 shadow-volcanic-glow' 
                    : 'hover:scale-105 hover:shadow-nether-glow'}
                `}
                onMouseEnter={(e) => {
                  setActiveCard(course.id);
                  createNetherParticles(e);
                }}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Particle Container */}
                <div className="particles-container absolute inset-0 pointer-events-none z-0"></div>

                <div className="relative group z-10">
                  <div className="relative">
                    <img
                      src={course.imageUrl}
                      alt={course.courseName || 'Course Image'}
                      className="w-full h-48 object-cover filter brightness-75 group-hover:brightness-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-nether-lava/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-nether-flame tracking-wide">
                      {course.courseName || 'Unnamed Course'}
                    </h3>

                    <div className="flex items-center space-x-3 text-nether-text">
                      <BookOpen className="w-5 h-5 text-nether-flame" />
                      <span className="text-sm">{course.teacherName || 'Unknown Teacher'}</span>
                    </div>

                    {course.status === 'completed' && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">Completed</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleAction(course)}
                      className={`w-full py-3 px-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-500 group
                        ${
                          course.status === 'completed'
                            ? 'border-green-800 hover:bg-green-700 text-nether-text border-2 border-green-600'
                            : 'border-blue-600 hover:bg-blue-800 text-nether-text border-2 border-blue-600'
                        } flex items-center justify-center space-x-3`}
                    >
                      {course.status === 'completed' ? (
                        <>
                          <Flame className="w-6 h-6 group-hover:animate-pulse" />
                          <span>Start Quiz</span>
                        </>
                      ) : (
                        <>
                        <ChevronRight className="w-6 h-6 group-hover:animate-pulse" />
                        <span>Start Course</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-nether-text py-16 bg-nether-dark-stone rounded-xl border-2 border-nether-lava shadow-volcanic-glow">
              <Swords className="mx-auto mb-4 text-nether-flame" size={48} />
              <p className="text-2xl">No courses found in the Nether realm.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
};

export default Courses;