import { Link } from 'react-router-dom';
import { Clock, PlayCircle, User, BookOpen } from 'lucide-react';
import PropTypes from 'prop-types';

const getTimeStatus = (deadline) => {
  try {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      throw new Error('Invalid date');
    }

    const now = new Date();
    const timeDiff = deadlineDate - now;

    if (timeDiff <= 0) {
      return {
        text: 'Expired',
        color: 'badge-error',
        urgency: 'expired',
      };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 7) {
      return {
        text: `${days} days left`,
        color: 'badge-neutral',
        urgency: 'low',
      };
    }
    if (days > 0) {
      return {
        text: `${days} day${days > 1 ? 's' : ''} left`,
        color: 'badge-primary',
        urgency: 'medium',
      };
    }
    if (hours > 0) {
      return {
        text: `${hours} hour${hours > 1 ? 's' : ''} left`,
        color: 'badge-warning',
        urgency: 'high',
      };
    }
    return {
      text: 'Less than an hour left',
      color: 'badge-error',
      urgency: 'critical',
    };
  } catch (error) {
    console.error('Error calculating time status:', error.message);
    return {
      text: 'Invalid deadline',
      color: 'badge-error',
      urgency: 'error',
    };
  }
};

const QuizCardSkeleton = () => (
  <div className="card bg-base-100 shadow-lg animate-pulse h-[280px] w-full">
    <div className="card-body">
      <div className="h-6 bg-base-300 rounded w-3/4 mb-4" />
      <div className="h-4 bg-base-300 rounded w-1/4 mb-2" />
      <div className="space-y-2">
        <div className="h-4 bg-base-300 rounded w-1/2" />
        <div className="h-4 bg-base-300 rounded w-2/3" />
        <div className="h-4 bg-base-300 rounded w-3/4" />
      </div>
      <div className="mt-auto h-10 bg-base-300 rounded w-full" />
    </div>
  </div>
);

const QuizCard = ({ quiz, onQuizStart, className = '', loading = false }) => {
  if (loading) return <QuizCardSkeleton />;

  if (!quiz) {
    return null;
  }

  const { id, courseName, teacherName, courseId, Deadline, disabled = false } = quiz;

  const timeStatus = getTimeStatus(Deadline);
  const isExpired = timeStatus.urgency === 'expired' || timeStatus.urgency === 'error';

  const formattedDeadline = (() => {
    try {
      return new Date(Deadline).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return 'Invalid date';
    }
  })();

  const handleStartQuiz = (e) => {
    if (disabled || isExpired) {
      e.preventDefault();
    }
    onQuizStart?.(id);
  };

  return (
    <div
      className={`
      card bg-base-200 shadow-lg
      transition-all duration-300 hover:shadow-xl
      h-[280px] w-full
      ${disabled ? 'opacity-60' : 'hover:-translate-y-1'}
      ${className}
    `}
    >
      <div className="card-body p-4 sm:p-6 flex flex-col justify-between h-full">
        {/* Header Section - Fixed Height */}
        <div className="min-h-[80px]">
          <h3
            className="card-title text-base sm:text-lg md:text-xl mb-2 line-clamp-2"
            title={courseName || 'Untitled Quiz'}
          >
            {courseName || 'Untitled Quiz'}
          </h3>
          <div className={`badge ${timeStatus.color} px-3 py-2 text-xs sm:text-sm`}>
            {timeStatus.text}
          </div>
        </div>

        {/* Content Section - Flexible Height */}
        <div className="flex-grow space-y-2 text-sm sm:text-base">
          <div className="flex items-center gap-2 text-base-content/70">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">Instructor:</span>
            <span className="text-base-content truncate" title={teacherName || 'Unknown'}>
              {teacherName || 'Unknown'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-base-content/70">
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">Course ID:</span>
            <span className="text-base-content truncate" title={courseId || 'N/A'}>
              {courseId || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-base-content/70">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">Deadline:</span>
            <span className="text-base-content truncate" title={formattedDeadline}>
              {formattedDeadline}
            </span>
          </div>
        </div>

        {/* Footer Section - Fixed Height */}
        <div className="h-[40px] mt-4">
          <Link
            to={`/school-management-app/quiz/${id}`}
            onClick={handleStartQuiz}
            className={`
              btn btn-block h-10 min-h-0
              text-sm sm:text-base
              ${isExpired ? 'btn-disabled' : 'btn-primary'}
              ${disabled ? 'pointer-events-none' : ''}
            `}
            aria-disabled={disabled || isExpired}
          >
            <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            {isExpired ? 'Quiz Expired' : 'Start Quiz'}
          </Link>
        </div>
      </div>
    </div>
  );
};

QuizCard.propTypes = {
  quiz: PropTypes.object,
  onQuizStart: PropTypes.func,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export default QuizCard;
