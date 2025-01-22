import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../../features/quizzes/quizzesSlice';
import QuizCard from './QuizCard';
import { LoadingSpinner, ErrorAlert, PageHeader } from '../../components';
import { Search, AlertCircle, FilterIcon } from 'lucide-react';

const QuizzesPage = () => {
  const dispatch = useDispatch();
  const quizData = useSelector((state) =>
    state.quizzes.quizzes
      ? state.quizzes.quizzes.filter(
          (quiz) => quiz.status === 'active' && quiz.questions?.length > 0
        )
      : []
  );
  const status = useSelector((state) => state.quizzes.status);
  const error = useSelector((state) => state.quizzes.error);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchQuizzes());
    }
  }, [dispatch, status]);

  const categories = useMemo(
    () => [
      'all',
      ...new Set(
        quizData
          .filter((quiz) => quiz?.coursequizID)
          .map((quiz) => quiz.coursequizID)
          .sort()
      ),
    ],
    [quizData]
  );

  const filteredQuizzes = useMemo(
    () =>
      quizData.filter((quiz) => {
        const searchFields = [quiz?.courseName, quiz?.techerName, quiz?.description].filter(
          Boolean
        );

        const matchesSearch =
          !searchTerm ||
          searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = categoryFilter === 'all' || quiz?.coursequizID === categoryFilter;

        return matchesSearch && matchesCategory;
      }),
    [quizData, searchTerm, categoryFilter]
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="bg-base-200 rounded-full p-4">
        <AlertCircle className="w-8 h-8 text-base-content/70" />
      </div>
      <h3 className="text-lg font-semibold">No quizzes found</h3>
      <p className="text-base-content/70 text-center max-w-md">
        {searchTerm || categoryFilter !== 'all'
          ? 'Try adjusting your search terms or filters'
          : 'No quizzes are currently available'}
      </p>
      {(searchTerm || categoryFilter !== 'all') && (
        <button
          onClick={() => {
            setSearchTerm('');
            setCategoryFilter('all');
          }}
          className="btn btn-outline btn-sm"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex justify-center items-start min-h-[400px] pt-16">
      <LoadingSpinner message="Loading available quizzes..." />
    </div>
  );

  const renderErrorState = () => (
    <div className="flex justify-center items-start min-h-[400px] pt-16">
      <ErrorAlert message={error || 'Failed to load quizzes. Please try again later.'} />
    </div>
  );

  const renderContent = () => {
    if (status === 'loading') return renderLoadingState();
    if (status === 'failed') return renderErrorState();
    if (filteredQuizzes.length === 0) return renderEmptyState();

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <PageHeader title="Available Quizzes" />

      {/* Search and Filter Section */}
      <div className="bg-base-200 rounded-box p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by course name, teacher, or description..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-base-content/50" />
          </div>

          {/* Desktop Category Filter */}
          <div className="hidden lg:block">
            <select
              className="select select-bordered w-[200px]"
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

          {/* Mobile Filter Button */}
          <button
            className="btn btn-outline lg:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FilterIcon className="h-5 w-5" />
            Filter
          </button>
        </div>

        {/* Mobile Category Filter */}
        {isFilterOpen && (
          <div className="mt-4 lg:hidden">
            <select
              className="select select-bordered w-full"
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
        )}

        {/* Active Filters */}
        {(searchTerm || categoryFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <div className="badge badge-outline gap-2">
                <span>{searchTerm}</span>
                <button className="hover:text-error" onClick={() => setSearchTerm('')}>
                  ×
                </button>
              </div>
            )}
            {categoryFilter !== 'all' && (
              <div className="badge badge-outline gap-2">
                <span>{categoryFilter}</span>
                <button className="hover:text-error" onClick={() => setCategoryFilter('all')}>
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quiz Content */}
      {renderContent()}
    </div>
  );
};

export default QuizzesPage;
