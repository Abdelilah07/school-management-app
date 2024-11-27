import { useEffect, useState } from 'react';
import {
  Trash2,
  Edit,
  Eye,
  Plus,
  X,
  BookOpen,
  User,
  Clock,
  Calendar,
  Settings,
} from 'lucide-react';

// Utility function to calculate quiz time status
const getTimeStatus = (deadline) => {
  try {
    if (!deadline) {
      return {
        text: 'No deadline',
        color: 'badge-warning',
        urgency: 'none',
      };
    }

    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      throw new Error('Invalid date format');
    }

    const now = new Date();
    const timeDiff = deadlineDate - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (timeDiff <= 0) {
      return {
        text: 'Expired',
        color: 'badge-error',
        urgency: 'expired',
      };
    }

    if (daysLeft <= 1) {
      return {
        text: 'Due Today',
        color: 'badge-warning',
        urgency: 'urgent',
      };
    }

    if (daysLeft <= 3) {
      return {
        text: `${daysLeft} days left`,
        color: 'badge-warning',
        urgency: 'soon',
      };
    }

    return {
      text: `${daysLeft} days left`,
      color: 'badge-info',
      urgency: 'normal',
    };
  } catch (error) {
    console.error('Error calculating time status:', error);
    return {
      text: 'Invalid date',
      color: 'badge-error',
      urgency: 'error',
    };
  }
};

export default function TeacherQuizzes() {
  // Get user data from local storage
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  // State Management
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setApiCourses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [errors, setErrors] = useState({});

  // Initial state for new quiz
  const [newQuiz, setNewQuiz] = useState({
    courseName: '',
    coursequizID: '',
    teacherName: user?.name || '',
    Deadline: '',
    status: '',
  });
  const [editingQuiz, setEditingQuiz] = useState(null);
  // Format deadline date
  const formattedDeadline = (quiz) => {
    try {
      return new Date(quiz.Deadline).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Initial data loading
  useEffect(() => {
    // Function to fetch quizzes
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:3000/quizzes');
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    // Function to fetch courses
    const fetchApiCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/courses');
        const data = await response.json();
        setApiCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchQuizzes();
    fetchApiCourses();
  }, []);

  // Filter quizzes by selected course
  const filteredQuizzes = selectedCourse
    ? quizzes.filter((quiz) => quiz.coursequizID === selectedCourse)
    : quizzes;

  // Delete a quiz
  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        const response = await fetch(`http://localhost:3000/quizzes/${quizId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete quiz');
        }
        setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  // Edit a quiz
  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setIsEditModalOpen(true);
  };

  // Update a quiz
  const handleUpdateQuiz = async () => {
    try {
      const response = await fetch(`http://localhost:3000/quizzes/${editingQuiz.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingQuiz),
      });

      if (!response.ok) {
        throw new Error('Failed to update quiz');
      }

      const updatedQuiz = await response.json();
      setQuizzes(quizzes.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz)));
      setIsEditModalOpen(false);
      setEditingQuiz(null);
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  // Navigate to quiz details
  const handleViewDetails = (quizId) => {
    window.location.href = `/quizzes/questions/${quizId}`;
  };

  // Navigate to add questions
  const handleAddQuestions = (quizId) => {
    console.log('Quiz ID:', quizId); // Log the quiz ID
    if (!quizId) {
      console.error('Quiz ID is required to add questions.');
      return;
    }
    try {
      // Navigate to the allQuestions page with the quiz ID
      window.location.href = `/quizzes/all-questions/${quizId}`;
    } catch (error) {
      console.error('Error navigating to add questions page:', error);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!newQuiz.coursequizID) {
      newErrors.coursequizID = 'Veuillez renseigner le champ';
    }
    if (!newQuiz.teacherName) {
      newErrors.teacherName = 'Veuillez renseigner le champ';
    }
    if (!newQuiz.Deadline) {
      newErrors.Deadline = 'Veuillez renseigner le champ';
    }
    if (!newQuiz.status) {
      newErrors.status = 'Veuillez renseigner le champ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new quiz
  const handleAddQuiz = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuiz),
      });

      if (!response.ok) {
        throw new Error('Failed to add quiz');
      }

      const addedQuiz = await response.json();
      setQuizzes([...quizzes, addedQuiz]);
      setIsAddModalOpen(false);
      setNewQuiz({
        courseName: '',
        coursequizID: '',
        teacherName: '',
        Deadline: '',
        status: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  };

  return (
    <div className="bg-base-100">
      <h1 className="text-3xl font-bold text-center mb-2 mt-4 ">
        Welcome Mr(s)
        <span className="text-green-700 hover:text-green-400 transition duration-300 ease-in-out font-bold">
          {' '}
          {user.name}
        </span>
      </h1>
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-3xl font-bold text-center mb-2">Available Quizzes</h3>
        <p className="text-center text-base-content/70 mb-6">Our collection of quizzes</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="select select-bordered w-full max-w"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.coursequizID} value={course.coursequizID}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-wide btn-primary">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Quiz
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="card bg-base-200 shadow-lg 
                        transition-all duration-300 hover:shadow-xl
                        h-[290px] w-full hover:-translate-y-1"
            >
              <div className="card-body p-4 sm:p-6 flex flex-col justify-between h-full">
                <div className="min-h-[80px]">
                  <h3 className="card-title text-base sm:text-lg md:text-xl mb-2 line-clamp-2">
                    {quiz.courseName || 'Untitled Quiz'}
                  </h3>
                  <div
                    className={`badge ${getTimeStatus(quiz.Deadline).color} px-3 py-2 text-xs sm:text-sm`}
                  >
                    {getTimeStatus(quiz.Deadline).text}
                  </div>
                </div>
                <div className="flex-grow space-y-2 text-sm sm:text-base">
                  <div className="flex items-center gap-2 text-base-content/70">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium whitespace-nowrap">Instructor:</span>
                    <span
                      className="text-base-content truncate"
                      title={quiz.teacherName || 'Unknown'}
                    >
                      {quiz.teacherName || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-base-content/70">
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium whitespace-nowrap">Course ID:</span>
                    <span className="text-base-content truncate" title={quiz.coursequizID || 'N/A'}>
                      {quiz.coursequizID || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-base-content/70">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium whitespace-nowrap">Deadline:</span>
                    <span
                      className="text-base-content truncate"
                      title={formattedDeadline(quiz) || 'Invalid date'}
                    >
                      {formattedDeadline(quiz) || 'Invalid date'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-base-content/70">
                    <p>
                      <span className="font-medium whitespace-nowrap">Status: </span>
                      <span
                        className={`font-semibold ${quiz.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}
                      >
                        {quiz.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="h-[40px] mt-4">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(quiz)}
                      className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleViewDetails(quiz.id)}
                      className="text-green-500 hover:text-green-600 transition duration-300 ease-in-out"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleAddQuestions(quiz.id)}
                      className="text-purple-500 hover:text-purple-600 transition duration-300 ease-in-out font-semibold"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isAddModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Add New Quiz</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-ghost btn-circle"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <BookOpen size={18} />
                      Course
                    </span>
                  </label>
                  <select
                    value={newQuiz.coursequizID}
                    onChange={(e) => {
                      setNewQuiz({
                        ...newQuiz,
                        coursequizID: e.target.value,
                        courseName: courses.find((course) => course.coursequizID === e.target.value)
                          ?.courseName,
                      });

                      if (errors.coursequizID) {
                        setErrors({ ...errors, coursequizID: '' });
                      }
                    }}
                    className={`select select-bordered w-full ${errors.coursequizID ? 'select-error' : ''}`}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.coursequizID} value={course.coursequizID}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                  {errors.coursequizID && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.coursequizID}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <User size={18} />
                      Instructor
                    </span>
                  </label>
                  <input
                    type="text"
                    value={newQuiz.teacherName}
                    readOnly
                    className="input input-bordered w-full bg-base-200"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Calendar size={18} />
                      Deadline
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    value={newQuiz.Deadline}
                    onChange={(e) => setNewQuiz({ ...newQuiz, Deadline: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Settings size={18} />
                      Status
                    </span>
                  </label>
                  <select
                    value={newQuiz.status}
                    onChange={(e) => setNewQuiz({ ...newQuiz, status: e.target.value })}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button onClick={handleAddQuiz} className="btn btn-primary">
                    Add Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditModalOpen && editingQuiz && (
          <div className="modal modal-open">
            <div className="modal-box max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Edit Quiz</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-ghost btn-circle"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <BookOpen /> Course
                  </span>
                </label>
                <select
                  value={editingQuiz.coursequizID || ''}
                  onChange={(e) =>
                    setEditingQuiz({
                      ...editingQuiz,
                      coursequizID: e.target.value,
                      courseName: courses.find((course) => course.coursequizID === e.target.value)
                        ?.courseName,
                    })
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select Course
                  </option>
                  {courses.map((course) => (
                    <option key={course.coursequizID} value={course.coursequizID}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <User /> Instructor
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Teacher Name"
                  value={editingQuiz.teacherName}
                  readOnly
                  className="input input-bordered w-full bg-base-200"
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Calendar /> Deadline
                  </span>
                </label>
                <input
                  type="datetime-local"
                  value={editingQuiz.Deadline}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, Deadline: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Settings /> Status
                  </span>
                </label>
                <select
                  value={editingQuiz.status}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, status: e.target.value })}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="card-actions justify-end mt-6">
                <button onClick={handleUpdateQuiz} className="btn btn-primary">
                  Update
                </button>
                <button onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
