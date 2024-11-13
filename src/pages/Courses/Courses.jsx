import { useState, useEffect } from 'react';
import { Book, Clock, PlayCircle, FileText, CheckCircle, User } from 'lucide-react'; // Changed FileAlt to FileText

// App component to fetch data from API
const Courses = () => {
  // State variables to store fetched data
  const [courses, setCourses] = useState([]);

  // Fetch courses data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await fetch('http://localhost:5001/courses');
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto rounded-l-3xl">
        {/* Courses Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-[#96C9F4] mb-6">Your Courses</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.length ? (
              courses.map((course) => (
                <div
                  key={course.id}
                  className={`flex flex-row gap-4 border border-gray-700 rounded-lg p-6 transition-all duration-300 ease-in-out transform hover:scale-105`}
                >
                  <div>
                    <img
                      src={course.imageurl}
                      alt={course.name}
                      className="w-25 h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">{course.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Instructor: {course.instructor}</p>
                    <div className="relative mt-4">
                      <div className='flex flex-row items-center'>
                        <div
                          className="rounded-full bg-green-500 h-1 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        >
                          {' '}
                        </div>
                        <span className="text-gray-400 text-sm ml-5">{course.progress}%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-medium">
                        {course.status === 'completed' ? (
                          <div>
                            <button
                              className="bg-green-500 px-4 py-2 rounded-lg text-white cursor-not-allowed"
                              disabled
                            >
                              Completed
                            </button>
                            <button className="bg-transparent border border-green-500 px-4 py-2 rounded-lg text ml-2">
                              Start Quiz
                            </button>
                          </div>
                        ) : (
                          <button
                            className="bg-blue-500 px-4 py-2 rounded-lg text-white"
                            onClick={() => {}}
                          >
                            Complete Course
                          </button>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No courses available at the moment.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Courses;
