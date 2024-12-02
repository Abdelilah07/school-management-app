import React from 'react';
import { Trash2, Edit, Eye, Plus, User, Clock, BookOpen } from 'lucide-react';
import { getTimeStatus } from '../utils/quizUtils';

const QuizCardTeacher = ({ quiz, onDelete, onEdit, onViewDetails, onAddQuestions }) => {
  const { text: timeStatus, color: timeColor } = getTimeStatus(quiz.Deadline);

  return (
    <div
      className="card bg-base-200 shadow-lg 
                        transition-all duration-300 hover:shadow-xl
                        h-[290px] w-full
                        hover:-translate-y-1"
    >
      <div className="card-body p-4 sm:p-6 flex flex-col justify-between h-full">
        {/* Header Section - Fixed Height */}
        <div className="min-h-[80px]">
          <h3
            className="card-title text-base sm:text-lg md:text-xl mb-2 line-clamp-2"
            title={quiz.courseName || 'Untitled Quiz'}
          >
            {quiz.courseName || 'Untitled Quiz'}
          </h3>

          <div className={`badge ${timeColor} px-3 py-2 `}>{timeStatus}</div>
        </div>
        {/* Content Section - Flexible Height */}
        <div className="flex-grow space-y-2 text-sm sm:text-base">
          <div className="flex items-center gap-2 text-base-content/70">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">Instructor:</span>
            <span className="text-base-content truncate" title={quiz.teacherName || 'Unknown'}>
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
              title={new Date(quiz.Deadline).toLocaleString()}
            >
              {new Date(quiz.Deadline).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-base-content/70">
            <span className="font-medium whitespace-nowrap">Deadline:</span>
            <span
              className={`font-semibold ${quiz.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}
            >
              {quiz.status}
            </span>
          </div>

          <div className="h-[40px] mt-4">
            <div className="card-actions justify-between mt-4">
              <button
                className="btn btn-outline btn-sm text-green-500 hover:text-green-600 transition duration-300 ease-in-out "
                onClick={() => onViewDetails(quiz.id)}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                className="btn btn-outline btn-sm text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out"
                onClick={() => onEdit(quiz)}
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                className="btn btn-outline btn-sm text-red-500 hover:text-red-600 transition duration-300 ease-in-out"
                onClick={() => onDelete(quiz.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                className="btn btn-outline btn-sm text-purple-500 hover:text-purple-600 transition duration-300 ease-in-out font-semibold"
                onClick={() => onAddQuestions(quiz.id)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCardTeacher;
//1
