import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Trash, X } from 'lucide-react';
import QuizHeader from './components/QuizHeader';
import Pagination from './components/Pagination';
import UploadQuestions from './components/UploadQuestions';
import AIQuestionGenerator from './components/AIQuestionGenerator';
import QuestionForm from './components/QuestionForm';
import { BASE_URL, fetchQuizDetails } from './utils/quizUtils';

const QUESTIONS_PER_PAGE = 5;

const AllQuestions = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [randomCount, setRandomCount] = useState(0);
  const [quiz, setQuiz] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!quizId) {
      console.error('Quiz ID is required');
      return;
    }
    fetchQuestions();
    fetchQuizDetails(quizId).then(setQuiz);
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/quizzes/${quizId}`);
      const data = await response.json();
      const existingQuestions = data.questions || [];
      const uniqueQuestions = existingQuestions.reduce((acc, question) => {
        if (!acc.some((q) => q.question === question.question)) {
          acc.push(question);
        }
        return acc;
      }, []);
      setQuestions(uniqueQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allQuestionIds = questions.map((q) => q.id);
      setSelectedQuestions(allQuestionIds);
    } else {
      setSelectedQuestions([]);
    }
  };

  const handleSelect = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const handleDelete = async () => {
    const selectedCount = selectedQuestions.length;
    if (selectedCount === 0) return;

    const confirmationMessage = `Are you sure you want to delete ${
      selectedCount === 1
        ? 'this question'
        : selectedCount === questions.length
          ? 'all questions'
          : `these ${selectedCount} questions`
    }?`;

    if (!window.confirm(confirmationMessage)) return;

    try {
      const response = await fetch(`${BASE_URL}/quizzes/${quizId}`);
      const existingQuiz = await response.json();

      const updatedQuestions = questions.filter((q) => !selectedQuestions.includes(q.id));
      const updatedQuestionsSelected = (existingQuiz.questionsSelected || []).filter(
        (q) => !selectedQuestions.includes(q.id)
      );

      await fetch(`${BASE_URL}/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: updatedQuestions,
          questionsSelected: updatedQuestionsSelected,
        }),
      });

      setQuestions(updatedQuestions);
      setSelectedQuestions([]);
      setSelectAll(false);

      alert(
        `Successfully deleted ${
          selectedCount === 1
            ? 'the question'
            : selectedCount === questions.length
              ? 'all questions'
              : `${selectedCount} questions`
        }`
      );
    } catch (error) {
      console.error('Error deleting questions:', error);
      alert('An error occurred while deleting the questions. Please try again.');
    }
  };

  const handleAddQuestion = async (newQuestion) => {
    try {
      const updatedQuestions = [...questions, { ...newQuestion, id: Date.now().toString() }];
      await fetch(`${BASE_URL}/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: updatedQuestions }),
      });
      setQuestions(updatedQuestions);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding question:', error);
      alert('An error occurred while adding the question. Please try again.');
    }
  };

  const handleAddToQuiz = async () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question to add to the quiz.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/quizzes/${quizId}`);
      const existingQuiz = await response.json();

      if (!existingQuiz) {
        alert(`Quiz with ID ${quizId} not found`);
        return;
      }

      const questionsSelected = existingQuiz.questionsSelected || [];

      const selectedQuestionsToAdd = questions.filter(
        (q) =>
          selectedQuestions.includes(q.id) &&
          !questionsSelected.some((existingQ) => existingQ.id === q.id)
      );

      const alreadyAddedQuestions = questions.filter(
        (q) =>
          selectedQuestions.includes(q.id) &&
          questionsSelected.some((existingQ) => existingQ.id === q.id)
      );

      if (alreadyAddedQuestions.length > 0 && selectedQuestionsToAdd.length > 0) {
        alert(
          `The following questions are already added and won't be added again: ${alreadyAddedQuestions.map((q) => q.question).join(', ')}.\n${selectedQuestionsToAdd.length} new question(s) will be added to the quiz.`
        );
      } else if (alreadyAddedQuestions.length > 0) {
        alert(
          `All selected questions are already added to the quiz: ${alreadyAddedQuestions.map((q) => q.question).join(', ')}.`
        );
        return;
      } else if (selectedQuestionsToAdd.length > 0) {
        alert(`${selectedQuestionsToAdd.length} question(s) will be added to the quiz.`);
      }

      await fetch(`${BASE_URL}/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...existingQuiz,
          questionsSelected: [...questionsSelected, ...selectedQuestionsToAdd],
        }),
      });

      window.location.href = `/quizzes/questions/${quizId}`;
    } catch (error) {
      console.error('Error adding questions to quiz:', error);
      alert('An error occurred while adding questions to the quiz. Please try again.');
    }
  };

  const handleRandomSelect = (count) => {
    setSelectedQuestions([]);

    const availableQuestions = questions.filter((q) => {
      const existingQuiz = quiz?.questionsSelected || [];
      return !existingQuiz.some((eq) => eq.id === q.id);
    });

    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selectedRandomQuestions = shuffled.slice(0, count);

    setSelectedQuestions(selectedRandomQuestions.map((q) => q.id));
  };

  const currentQuestions = questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-2">All Questions</h1>
      <QuizHeader {...quiz} />
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleDelete}
          className="btn btn-outline btn-error btn-sm gap-2"
          disabled={selectedQuestions.length === 0}
        >
          <Trash className="w-4 h-4" />
          Delete Selected
        </button>
        <div className="flex justify-end gap-2">
          <AIQuestionGenerator quizId={quizId} onQuestionsGenerated={setQuestions} />
          <UploadQuestions quizId={quizId} onQuestionsUploaded={setQuestions} />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-outline btn-primary btn-sm gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>
      <hr />
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="checkbox"
                />
              </th>
              <th>Question</th>
              <th>Options</th>
              <th>Correct Answer</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((question, index) => (
              <tr key={`question-${question.id}-${index}`}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question.id)}
                    onChange={() => handleSelect(question.id)}
                    className="checkbox"
                  />
                </td>
                <td>{question.question}</td>
                <td>
                  <ul>
                    {question.answers.map((answer, idx) => (
                      <li key={`answer-${question.id}-${idx}`}>{answer}</li>
                    ))}
                  </ul>
                </td>
                <td className="text-green-600">{question.correctAnswer}</td>
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
      </div>

      <div className="flex items-center justify-between mt-4 space-x-2">
        <button
          onClick={() => (window.location.href = '/quizzes')}
          className="btn btn-outline btn-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-4">
          <select
            className="select select-bordered w-64"
            value={randomCount}
            onChange={(e) => {
              const count = parseInt(e.target.value);
              setRandomCount(count);
              if (count === 0) {
                setSelectedQuestions([]);
              } else if (count > 0) {
                handleRandomSelect(count);
              }
            }}
          >
            <option value="0">Select questions...</option>
            {[...Array(Math.ceil(questions.length / 10))].map((_, i) => {
              const value = (i + 1) * 10;
              return (
                <option key={value} value={value}>
                  {value} questions
                </option>
              );
            })}
          </select>
          {randomCount > 0 && (
            <button
              className="btn btn-outline btn-primary btn-sm"
              onClick={() => handleRandomSelect(randomCount)}
            >
              Shuffle Selection
            </button>
          )}
        </div>

        <button
          onClick={handleAddToQuiz}
          className="btn btn-outline btn-success"
          disabled={selectedQuestions.length === 0}
        >
          Add to Quiz
        </button>
      </div>
      {isAddModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Question</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="btn btn-ghost">
                <X className="w-4 h-4" />
              </button>
            </div>
            <QuestionForm onSubmit={handleAddQuestion} onCancel={() => setIsAddModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllQuestions;
