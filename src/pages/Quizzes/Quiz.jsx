import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../../features/quizzes/quizzesSlice';

const Quiz = () => {
  const { id } = useParams(); // Get the quiz ID from the URL
  const dispatch = useDispatch();

  // Access quizzes and status from Redux store
  const { quizzes, status, error } = useSelector((state) => state.quizzes);
  // Filter the quiz based on the ID from the URL
  const quizData = quizzes.find((quiz) => quiz.id === id);

  // Local state for handling quiz
  const [timeLeft, setTimeLeft] = useState(300);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [retries, setRetries] = useState(0);

  // Fetch quizzes when the component mounts or the ID changes
  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch, id]); // Re-run when the ID or component mounts

  // Reset quiz state when ID or retries change
  useEffect(() => {
    if (quizData && quizData.questionsSelected) {
      setTimeLeft(quizData.questionsSelected.length * 30); // Set time based on number of questions (30 sec per question)
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setQuizFinished(false);
    }
  }, [id, retries, quizData]); // Run this effect when the quiz ID, retries, or quizData changes

  // Timer for quiz countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      finishQuiz();
    }
  }, [timeLeft]);

  // Calculate score based on answers
  const calculateScore = () =>
    quizData?.questionsSelected.reduce(
      (score, question, index) =>
        score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0),
      0
    );

  // Finish quiz logic
  const finishQuiz = () => {
    if (!quizData || !quizData.questionsSelected) return; // Safeguard: Ensure quizData and questions exist
    setQuizFinished(true);
    const score = calculateScore();
    if (score >= 0.7 * quizData.questionsSelected.length) {
      setIsConfettiActive(true);
      setTimeout(() => setIsConfettiActive(false), 3000); // Confetti effect
    }
  };

  // Update selected answer
  const handleAnswerChange = (answer) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  // Go to the next question
  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.questionsSelected.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  // Retry quiz
  const handleRetryQuiz = () => {
    setRetries((prev) => prev + 1);
  };

  // Loading or error state check
  if (status === 'loading' || !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500">Error: {error}</span>
      </div>
    );
  }

  // Quiz progress component
  const QuizProgress = () => (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm">
          Question {currentQuestionIndex + 1} of {quizData.questionsSelected.length}
        </span>
        <span className="text-sm font-mono">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <progress
        className="progress progress-primary w-full"
        value={currentQuestionIndex + 1}
        max={quizData.questionsSelected.length}
      ></progress>
    </div>
  );

  // Quiz header component
  const QuizHeader = () => (
    <div className="card bg-base-200 shadow-xl mb-8">
      <div className="card-body">
        <h2 className="card-title text-2xl">{quizData.courseName}</h2>
        <div className="flex flex-col gap-1">
          <p className="text-sm opacity-70">Quiz ID: {quizData.quizID}</p>
          <p className="text-sm opacity-70">
            Due: {new Date(quizData.Deadline).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  // Render quiz content (questions, answers, etc.)
  const renderQuizContent = () => (
    <div className="space-y-8">
      <QuizProgress />
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="text-xl font-medium mb-6">
            {quizData.questionsSelected[currentQuestionIndex].question}
          </h3>
          <div className="space-y-4">
            {quizData.questionsSelected[currentQuestionIndex].answers.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerChange(option)}
                className={`btn btn-outline w-full justify-start h-auto py-4 px-6 normal-case text-left ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? 'btn-primary'
                    : 'hover:btn-primary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="card-actions justify-end mt-6">
            <button
              onClick={nextQuestion}
              disabled={!selectedAnswers[currentQuestionIndex]}
              className="btn btn-primary"
            >
              {currentQuestionIndex < quizData.questionsSelected.length - 1
                ? 'Next Question'
                : 'Finish Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render quiz results (score, review, etc.)
  const renderQuizResults = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🎉 Quiz Completed! 🎉</h2>
          <div className="stats shadow-lg">
            <div className="stat">
              <div className="stat-title text-lg">Your Final Score</div>
              <div className="stat-value text-primary">
                {calculateScore()}/{quizData.questionsSelected.length}
              </div>
              <div className="stat-desc text-sm">
                Accuracy:{' '}
                {((calculateScore() / quizData.questionsSelected.length) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="divider text-lg">📜 Question Review</div>
        <div className="space-y-6">
          {quizData.questionsSelected.map((question, index) => (
            <div key={index} className="border border-base-200 rounded-lg p-4 shadow-sm">
              <p className="font-medium mb-2">
                <span className="text-primary">{index + 1}.</span> {question.question}
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge ${
                      selectedAnswers[index] === question.correctAnswer
                        ? 'badge-success'
                        : 'badge-error'
                    }`}
                  >
                    {selectedAnswers[index] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                  </span>
                  <p>
                    <span className="font-semibold">Your Answer:</span>{' '}
                    {selectedAnswers[index] || 'Not answered'}
                  </p>
                </div>

                {selectedAnswers[index] !== question.correctAnswer && (
                  <p className="text-sm text-success">
                    <span className="font-semibold">Correct Answer:</span> {question.correctAnswer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="btn btn-primary btn-wide" onClick={() => handleRetryQuiz()}>
            Retry Quiz
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8">
      <QuizHeader />
      {quizFinished ? renderQuizResults() : renderQuizContent()}
    </div>
  );
};

export default Quiz;
