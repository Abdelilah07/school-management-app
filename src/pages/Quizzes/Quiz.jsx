import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import Confetti from 'react-confetti';
import { useSelector } from 'react-redux';

const Quiz = () => {
  const { id } = useParams();
  const quizData = useSelector((state) => state.quizzes.quizzes.find((quiz) => quiz.id === id));

  const [timeLeft, setTimeLeft] = useState(300);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const progressAnimation = useSpring({
    width: `${((300 - timeLeft) / 300) * 100}%`,
    config: { tension: 200, friction: 30 },
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      finishQuiz();
    } else {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const finishQuiz = () => {
    setQuizFinished(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 7000);
  };

  const handleAnswerChange = (answer) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    return quizData.questions.reduce(
      (score, question, index) =>
        score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0),
      0
    );
  };

  if (!quizData) return <div>Loading...</div>;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto justify-center gap-4 text-base-content">
      {showConfetti && <Confetti />}

      {/* Quiz Header */}
      <div className="bg-primary text-primary-content p-4 rounded-lg shadow-md">
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2">{quizData.courseName}</h1>
        <p className="text-lg">Quiz ID: {quizData.quizID}</p>
        <p className="text-sm mt-2">Deadline: {new Date(quizData.Deadline).toLocaleString()}</p>
      </div>

      {/* Countdown Timer */}
      {!quizFinished && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock size={20} />
            <span className="text-lg font-semibold">{`${Math.floor(timeLeft / 60)}:${
              timeLeft % 60 < 10 ? '0' : ''
            }${timeLeft % 60}`}</span>
          </div>
          <div>Time Left</div>
        </div>
      )}

      {/* Progress Bar */}
      {!quizFinished && (
        <div className="mb-4">
          <div className="w-full bg-neutral-focus rounded-full h-2">
            <animated.div className="bg-secondary h-2 rounded-full" style={progressAnimation} />
          </div>
        </div>
      )}

      {/* Question and Answer Options */}
      {!quizFinished && (
        <div className="bg-neutral p-4 rounded-lg shadow-md">
          <h2 className="text-xl text-neutral-content font-semibold">{currentQuestion.question}</h2>
          {currentQuestion.answers.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerChange(option)}
              className={`w-full py-3 text-lg rounded-lg font-semibold transition ${
                selectedAnswers[currentQuestionIndex] === option
                  ? 'bg-secondary text-secondary-content'
                  : 'bg-neutral-focus text-neutral-content hover:bg-secondary hover:text-secondary-content'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Next/Submit Button */}
      {!quizFinished && (
        <button
          onClick={currentQuestionIndex < quizData.questions.length - 1 ? nextQuestion : finishQuiz}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className={`btn btn-primary w-full text-lg font-semibold ${
            !selectedAnswers[currentQuestionIndex] ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <>
              <ArrowRight size={18} className="mr-2 inline-block" />
              Next Question
            </>
          ) : (
            <>
              <CheckCircle size={18} className="mr-2 inline-block" />
              Submit Quiz
            </>
          )}
        </button>
      )}

      {/* Quiz Results */}
      {quizFinished && (
        <div className="bg-neutral text-neutral-content p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Quiz Finished!</h2>
          <span className="badge badge-accent text-lg">
            Score: {calculateScore()}/{quizData.questions.length}
          </span>
          <p className="mt-4">Thank you for completing the quiz. Here are your results:</p>

          {quizData.questions.map((question, index) => (
            <div key={index} className="mt-4 text-lg font-semibold">
              <p>{question.question}</p>
              <p>
                Your answer:{' '}
                <span
                  className={
                    selectedAnswers[index] === question.correctAnswer
                      ? 'text-success'
                      : 'text-error'
                  }
                >
                  {selectedAnswers[index] || 'Not Answered'}
                </span>
              </p>
              <p>
                Correct answer: <span className="text-success">{question.correctAnswer}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quiz;
