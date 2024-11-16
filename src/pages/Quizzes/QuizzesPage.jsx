import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../../features/quizzes/quizzesSlice';
import QuizCard from './QuizCard';
import { LoadingSpinner, ErrorAlert } from '../../components';
import { Search, AlertCircle } from 'lucide-react';

const QuizzesPage = () => {
  const dispatch = useDispatch();
  const quizData = useSelector((state) => state.quizzes.quizzes) || [];
  const status = useSelector((state) => state.quizzes.status);
  const error = useSelector((state) => state.quizzes.error);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchQuizzes());
    }
  }, [dispatch, status]);

  const categories = useMemo(
    () => [
      'all',
      ...new Set(quizData.filter((quiz) => quiz?.courseId).map((quiz) => quiz.courseId)),
    ],
    [quizData]
  );

  const filteredQuizzes = useMemo(
    () =>
      quizData.filter((quiz) => {
        const matchesSearch =
          searchTerm === '' ||
          quiz?.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz?.techerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || quiz?.courseId === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [quizData, searchTerm, categoryFilter]
  );

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex justify-center items-start min-h-screen">
          <LoadingSpinner message="Fetching quizzes..." />
        </div>
      );
    }
    if (status === 'failed') {
      return (
        <div className="flex justify-center items-start min-h-screen">
          <ErrorAlert message={error} />
        </div>
      );
    }
    if (filteredQuizzes.length === 0) {
      return (
        <div role="alert" className="alert">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">No quizzes found</h3>
            <p className="text-sm">Try adjusting your search terms or filters.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredQuizzes.map((quiz) => (
          <QuizCard key={quiz.quizID} quiz={quiz} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-2">Available Quizzes</h2>
        <p className="text-center text-base-content/70 mb-6">
          Browse through our collection of quizzes
        </p>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search quizzes..."
              className="input input-bordered w-full pl-10"
              aria-label="Search quizzes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-base-content/50" />
          </div>

          {/* Category Filter */}
          <select
            className="select select-bordered w-full md:w-[200px]"
            aria-label="Filter quizzes by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all'
                  ? 'All Categories'
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Quiz Content */}
        {renderContent()}

        {/* Stats Section */}
        {status === 'succeeded' && (
          <div className="stats w-full shadow mt-6">
            <div className="stat text-center">
              <div className="stat-title">Total Quizzes</div>
              <div className="stat-value">{quizData.length}</div>
            </div>
            <div className="stat text-center">
              <div className="stat-title">Filtered Results</div>
              <div className="stat-value">{filteredQuizzes.length}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;
