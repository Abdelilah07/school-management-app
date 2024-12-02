import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import QuizHeader from './components/QuizHeader';
import Pagination from './components/Pagination';
import { BASE_URL, fetchQuizDetails } from './utils/quizUtils';

const QUESTIONS_PER_PAGE = 5;

const QuizQuestions = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quiz, setQuiz] = useState({});

  useEffect(() => {
    fetchQuestions();
    fetchQuizDetails(quizId).then(setQuiz);
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/quizzes/${quizId}`);
      const data = await response.json();
      const selectedQuestions = data.questionsSelected || [];
      setQuestions(selectedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('An error occurred while fetching the questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const handleDeleteQuestions = async () => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${selectedQuestions.length} selected questions?`
      );

      if (!confirmDelete) return;

      const updatedQuestions = questions.filter(
        (question) => !selectedQuestions.includes(question.id)
      );

      await fetch(`${BASE_URL}/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionsSelected: updatedQuestions,
        }),
      });

      setQuestions(updatedQuestions);
      setSelectedQuestions([]);
    } catch (err) {
      console.error('Error deleting questions:', err);
      alert('Failed to delete questions');
    }
  };

  const currentQuestions = questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-2">Quiz Questions</h1>
        <QuizHeader {...quiz} />
        {selectedQuestions.length > 0 && (
          <button onClick={handleDeleteQuestions} className="btn btn-error flex items-center">
            <Trash2 className="mr-2" />
            Delete {selectedQuestions.length} Questions
          </button>
        )}
      </div>
      <hr />
      <div className="overflow-x-auto">
        <div>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedQuestions.length === questions.length}
                      onChange={() => {
                        setSelectedQuestions((prev) =>
                          prev.length === questions.length ? [] : questions.map((q) => q.id)
                        );
                      }}
                    />
                  </label>
                </th>
                <th>Question</th>
                <th>Options</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions.map((question) => (
                <tr key={question.id}>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => handleQuestionSelect(question.id)}
                      />
                    </label>
                  </td>
                  <td className="hover px-6 py-4">{question.question}</td>
                  <td className="hover px-6 py-4">
                    <ul>
                      {question.answers.map((answer) => (
                        <li key={`answer-${question.id}-${answer}`}>{answer}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="hover px-6 py-4 text-green-600">{question.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          />
          <div className="mt-4">
            <button onClick={handleGoBack} className="btn btn-outline btn-primary">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizQuestions;
