import { Link } from 'react-router';
import { Clock, PlayCircle, User, BookOpen, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const getTimeStatus = (deadline) => {
  try {
    if (!deadline) {
      return {
        text: 'No deadline',
        color: 'badge-neutral',
        urgency: 'none',
        icon: Clock,
      };
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      throw new Error('Invalid date format');
    }

    const now = new Date();
    const timeDiff = deadlineDate - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60));

    if (timeDiff <= 0) {
      return {
        text: 'Expired',
        color: 'badge-error',
        urgency: 'expired',
        icon: AlertCircle,
      };
    }

    if (daysLeft <= 1) {
      return {
        text: hoursLeft <= 1 ? 'Due in 1 hour' : `Due in ${hoursLeft} hours`,
        color: 'badge-error',
        urgency: 'urgent',
        icon: Clock,
      };
    }

    if (daysLeft <= 3) {
      return {
        text: `${daysLeft} days left`,
        color: 'badge-warning',
        urgency: 'soon',
        icon: Clock,
      };
    }

    return {
      text: `${daysLeft} days left`,
      color: 'badge-info',
      urgency: 'normal',
      icon: Clock,
    };
  } catch (error) {
    console.error('Error calculating time status:', error);
    return {
      text: 'Invalid date',
      color: 'badge-error',
      urgency: 'error',
      icon: AlertCircle,
    };
  }
};

const QuizCardSkeleton = () => (
  <div className="card bg-base-100 shadow-lg animate-pulse h-[280px] w-full">
    <div className="card-body">
      <div className="h-6 bg-base-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-base-200 rounded w-1/4 mb-2" />
      <div className="space-y-3">
        <div className="h-4 bg-base-200 rounded w-1/2" />
        <div className="h-4 bg-base-200 rounded w-2/3" />
        <div className="h-4 bg-base-200 rounded w-3/4" />
      </div>
      <div className="mt-auto">
        <div className="h-10 bg-base-200 rounded w-full" />
      </div>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`flex items-center gap-2 text-base-content/70 ${className}`}>
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="font-medium whitespace-nowrap">{label}:</span>
    <span className="text-base-content truncate" title={value || 'N/A'}>
      {value || 'N/A'}
    </span>
  </div>
);

const QuizCard = ({ quiz, onQuizStart, className = '', loading = false }) => {
  if (loading) return <QuizCardSkeleton />;
  if (!quiz) return null;

  const {
    id,
    courseName = 'Untitled Quiz',
    teacherName,
    courseId,
    deadline,
    disabled = false,
    questionCount,
    duration,
  } = quiz;

  const timeStatus = getTimeStatus(deadline);
  const isExpired = timeStatus.urgency === 'expired' || timeStatus.urgency === 'error';
  const StatusIcon = timeStatus.icon;

  const formattedDeadline = (() => {
    try {
      return new Date(deadline).toLocaleString(undefined, {
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
      return;
    }
    onQuizStart?.(id);
  };

  return (
    <div
      className={`
        card bg-base-100 hover:bg-base-100/80
        border border-base-200 shadow-md
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:border-base-300
        h-[280px] w-full relative
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1'}
        ${className}
      `}
    >
      {/* Status Badge */}
      <div className="absolute -top-2 right-4">
        <div className={`badge ${timeStatus.color} gap-1 px-3 py-2 shadow-sm`}>
          <StatusIcon className="w-3 h-3" />
          <span className="text-xs font-medium">{timeStatus.text}</span>
        </div>
      </div>

      <div className="card-body p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4">
          <h3
            className="card-title text-base sm:text-lg font-bold mb-1 line-clamp-2"
            title={courseName}
          >
            {courseName}
          </h3>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 text-sm">
          <InfoRow icon={User} label="Instructor" value={teacherName} />
          <InfoRow icon={BookOpen} label="Course ID" value={courseId} />
          <InfoRow icon={Clock} label="Due Date" value={formattedDeadline} />
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4">
          <Link
            to={`/quiz/${id}`}
            onClick={handleStartQuiz}
            className={`
              btn btn-block gap-2 normal-case
              ${isExpired ? 'btn-disabled' : 'btn-primary'}
              ${disabled ? 'pointer-events-none' : ''}
              transition-all duration-300
            `}
            aria-disabled={disabled || isExpired}
          >
            <PlayCircle className="w-5 h-5" />
            {isExpired ? 'Quiz Expired' : 'Start Quiz'}
          </Link>
        </div>
      </div>
    </div>
  );
};

QuizCard.propTypes = {
  quiz: PropTypes.shape({
    id: PropTypes.string,
    courseName: PropTypes.string,
    teacherName: PropTypes.string,
    courseId: PropTypes.string,
    deadline: PropTypes.string,
    disabled: PropTypes.bool,
    questionCount: PropTypes.number,
    duration: PropTypes.number,
  }),
  onQuizStart: PropTypes.func,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

InfoRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  className: PropTypes.string,
};

export default QuizCard;
