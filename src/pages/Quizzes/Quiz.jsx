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
  const [showSadFace, setShowSadFace] = useState(false);

  const progressAnimation = useSpring({
    width: `${((300 - timeLeft) / 300) * 100}%`,
    config: { tension: 200, friction: 30 },
  });

  // Sound Effects
  const confettiSound = new Audio('../src/applause-236785.mp3');
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
    const score = calculateScore();
    
    // Show confetti if score is >= 70%
    if (score >= 0.7 * quizData.questions.length) {
      setShowConfetti(true);
      confettiSound.play();  // Play confetti sound
      setTimeout(() => setShowConfetti(false), 3000); // Show confetti for 3 seconds
    } else {
      // Show the sad face if score < 70%
      setShowSadFace(true);
    }
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
  const score = calculateScore(); // Calculate the score when it's needed

  const sadFaceAnimation = useSpring({
    opacity: showSadFace ? 1 : 0,
    scale: showSadFace ? 1.5 : 0.5,
    config: { tension: 170, friction: 12 },
  });

  const feedbackMessage =
    score >= 0.8 * quizData.questions.length
      ? 'Excellent job! 🎉'
      : score >= 0.5 * quizData.questions.length
        ? 'Good effort! 👍'
        : 'Keep practicing! 💪';

  return (
    <div className="flex flex-col max-w-[800px] mx-auto justify-center gap-6 p-4 text-base-content">
      {/* Show confetti if score >= 70% */}
      {showConfetti && (
        <div width={'100%'} height={'100%'}>
          <Confetti />
        </div>
      )}

      {/* Sad Face Animation if score < 70% */}
      {quizFinished && showSadFace && (
        <animated.div style={sadFaceAnimation} className="flex flex-col items-center justify-center my-6">
          <div className="text-6xl">😞</div>
          <p className="text-xl font-semibold text-error">Oops, you didn't reach 70%. Keep practicing!</p>
        </animated.div>
      )}

      {/* Quiz Header */}
      <div className="bg-primary text-primary-content p-6 rounded-lg shadow-md">
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2">{quizData.courseName}</h1>
        <p className="text-lg">Quiz ID: {quizData.quizID}</p>
        <p className="text-sm mt-2">Deadline: {new Date(quizData.Deadline).toLocaleString()}</p>
      </div>

      {/* Countdown Timer and Progress Bar */}
      {!quizFinished && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock size={20} />
              <animated.span className="text-lg font-semibold">{`${Math.floor(timeLeft / 60)}:${
                timeLeft % 60 < 10 ? '0' : ''
              }${timeLeft % 60}`}</animated.span>
            </div>
            <div>Time Left</div>
          </div>
          <div className="w-full bg-neutral-focus rounded-full h-4">
            <animated.div className="bg-secondary h-4 rounded-full" style={progressAnimation} />
          </div>
        </div>
      )}

      {/* Question and Answer Options */}
      {!quizFinished && (
        <div className="bg-neutral p-6 rounded-lg shadow-md">
          <h2 className="text-xl text-neutral-content font-semibold">{currentQuestion.question}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {currentQuestion.answers.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerChange(option)}
                className={`btn btn-outline  ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? 'btn-secondary btn-active'
                    : 'btn-secondary hover:bg-secondary hover:text-secondary-content'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
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
              <ArrowRight className="h-5 w-5 inline-block" />
              Next Question
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 inline-block" />
              Submit Quiz
            </>
          )}
        </button>
      )}

      {/* Quiz Results */}
      {quizFinished && (
        <div className="bg-neutral text-neutral-content p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Quiz Finished!</h2>
          <span className="badge badge-accent text-lg">
            Score: {score}/{quizData.questions.length}
          </span>
          <p className="text-xl mt-2 mb-4 font-semibold">{feedbackMessage}</p>
          <p>Thank you for completing the quiz. Here are your results:</p>
          <div className="divider"></div>
          <div className="space-y-4">
            {quizData.questions.map((question, index) => (
              <div
                key={index}
                className="text-lg font-semibold grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <p className="col-span-2">{question.question}</p>
                <ul className="ms-12 list-disc">
                  <li
                    className={`${selectedAnswers[index] === question.correctAnswer ? 'text-success' : 'text-error'}`}
                  >
                    Your answer: {selectedAnswers[index] || 'Not Answered'}
                  </li>
                  <li className="text-success">Correct answer: {question.correctAnswer}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
