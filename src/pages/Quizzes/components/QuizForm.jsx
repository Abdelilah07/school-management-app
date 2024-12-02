import React, { useState } from 'react';
import { BookOpen, User, Calendar, Settings } from 'lucide-react';

const QuizForm = ({ initialQuiz, courses, onSubmit, onCancel }) => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const [quiz, setQuiz] = useState(
    initialQuiz || {
      courseName: '',
      coursequizID: '',
      teacherName: user?.name || '',
      Deadline: '',
      status: '',
    }
  );

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!quiz.coursequizID) newErrors.coursequizID = 'Course is required';
    if (!quiz.teacherName) newErrors.teacherName = 'Instructor name is required';
    if (!quiz.Deadline) newErrors.Deadline = 'Deadline is required';
    if (!quiz.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(quiz);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <BookOpen size={18} />
            Course
          </span>
        </label>
        <select
          value={quiz.coursequizID}
          onChange={(e) => {
            const selectedCourse = courses.find((course) => course.coursequizID === e.target.value);
            setQuiz({
              ...quiz,
              coursequizID: e.target.value,
              courseName: selectedCourse ? selectedCourse.courseName : '',
            });
            setErrors({ ...errors, coursequizID: '' });
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
          value={initialQuiz ? initialQuiz.teacherName : user?.name || ''}
          className={`input input-bordered w-full ${errors.teacherName ? 'input-error' : ''}`}
          readOnly
        />
        {errors.teacherName && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.teacherName}</span>
          </label>
        )}
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
          value={quiz.Deadline}
          onChange={(e) => setQuiz({ ...quiz, Deadline: e.target.value })}
          className={`input input-bordered w-full ${errors.Deadline ? 'input-error' : ''}`}
          required
        />
        {errors.Deadline && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.Deadline}</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <Settings size={18} />
            Status
          </span>
        </label>
        <select
          value={quiz.status}
          onChange={(e) => setQuiz({ ...quiz, status: e.target.value })}
          className={`select select-bordered w-full ${errors.status ? 'select-error' : ''}`}
          required
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
        {errors.status && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.status}</span>
          </label>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialQuiz ? 'Update' : 'Add'} Quiz
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
