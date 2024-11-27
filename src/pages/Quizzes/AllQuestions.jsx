import { useState, useEffect } from 'react';
import {
  PlusCircle,
  ArrowLeft,
  Trash,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000';

export default function AllQuestions() {
  // Get quiz ID from URL parameters
  const { quizId } = useParams();
  if (!quizId) {
    console.error('Quiz ID is required');
    return null; // or handle the error appropriately
  }

  // Initialize state variables for managing questions and UI
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Structure for new question form
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    answers: ['', '', '', ''],
    correctAnswer: '',
  });

  // Random question selection count
  const [randomCount, setRandomCount] = useState(0);

  // Quiz details state
  const [quiz, setQuiz] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 5;

  // Fetch quiz details on component mount
  useEffect(() => {
    axios
      .get(`${BASE_URL}/quizzes/${quizId}`)
      .then((res) => {
        const { courseName, Deadline } = res.data;
        setQuiz({ courseName, quizId, Deadline });
      })
      .catch((err) => console.error(err));
  }, [quizId]);

  const { courseName, Deadline } = quiz;
  const QuizHeader = () => (
    <div className="card bg-base-200 shadow-xl mb-8">
      <div className="card-body">
        <h2 className="card-title text-2xl">{courseName}</h2>
        <div className="flex flex-col gap-1">
          <p className="text-sm opacity-70">Quiz ID: {quizId}</p>
          <p className="text-sm opacity-70">Due: {new Date(Deadline).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );

  // Calcul des questions pour la page courante
  const indexOfLastQuestion = currentPage * QUESTIONS_PER_PAGE;
  const indexOfFirstQuestion = indexOfLastQuestion - QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  // Gestion des changements de page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (!quizId) {
      console.error('Quiz ID is required');
      return;
    }
    fetchQuestions();
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quizzes/${quizId}`);
      const existingQuestions = response.data.questions || [];

      // Remove duplicate questions
      const uniqueQuestions = existingQuestions.reduce((acc, question) => {
        if (!acc.some((q) => q.question === question.question)) {
          acc.push(question);
        }
        return acc;
      }, []);

      setQuestions(uniqueQuestions);
      return { quizId, questions: uniqueQuestions };
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Optionally, you can set an empty array or handle the error
      setQuestions([]);
    }
  };

  // Handler functions for various actions
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all questions in all pages
      const allQuestionIds = questions.map((q) => q.id);
      setSelectedQuestions(allQuestionIds);
    } else {
      // Deselect all questions
      setSelectedQuestions([]);
    }
  };

  const handleSelect = (questionId) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        // If already selected, remove it
        return prev.filter((id) => id !== questionId);
      } else {
        // If not selected, add only this item
        return [...prev, questionId];
      }
    });
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
      // Get the current quiz data first
      const response = await axios.get(`${BASE_URL}/quizzes/${quizId}`);
      const existingQuiz = response.data;

      // Filter out the deleted questions from both questions and questionsSelected arrays
      const updatedQuestions = questions.filter((q) => !selectedQuestions.includes(q.id));
      const updatedQuestionsSelected = (existingQuiz.questionsSelected || []).filter(
        (q) => !selectedQuestions.includes(q.id)
      );

      // Update both arrays in the database
      await axios.patch(`${BASE_URL}/quizzes/${quizId}`, {
        questions: updatedQuestions,
        questionsSelected: updatedQuestionsSelected,
      });

      // Update local state
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

  const handleAddQuestion = async () => {
    if (!quizId) {
      alert('Quiz ID is required');
      return;
    }
    try {
      const updatedQuestions = [...questions, { ...newQuestion, id: Date.now().toString() }];
      await axios.patch(`${BASE_URL}/quizzes/${quizId}`, { questions: updatedQuestions });
      setQuestions(updatedQuestions);
      setIsAddModalOpen(false);
      setNewQuestion({
        question: '',
        answers: ['', '', '', ''],
        correctAnswer: '',
      });
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
      // Fetch the existing quiz
      const response = await axios.get(`${BASE_URL}/quizzes/${quizId}`);
      const existingQuiz = response.data;

      if (!existingQuiz) {
        alert(`Quiz with ID ${quizId} not found`);
        return;
      }

      const questionsSelected = existingQuiz.questionsSelected || [];

      // Separate selected questions into already added and new ones
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

      // Alert for already added questions
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

      // Update the quiz with the new questions
      await axios.patch(`${BASE_URL}/quizzes/${quizId}`, {
        ...existingQuiz,
        questionsSelected: [...questionsSelected, ...selectedQuestionsToAdd],
      });

      window.location.href = `/quizzes/questions/${quizId}`;
    } catch (error) {
      console.error('Error adding questions to quiz:', error);
      alert('An error occurred while adding questions to the quiz. Please try again.');
    }
  };

  const handleUploadQuestions = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';

    fileInput.onchange = async () => {
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a file to upload');
        return;
      }

      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const csvData = reader.result;
          const newQuestions = CSVToJson(csvData);

          if (newQuestions.length === 0) {
            alert('No valid questions found in the CSV file');
            return;
          }

          const response = await axios.get(`${BASE_URL}/quizzes/${quizId}`);
          const existingQuiz = response.data;

          if (!existingQuiz) {
            alert(`Quiz with ID ${quizId} not found`);
            return;
          }

          const existingQuestions = Array.isArray(existingQuiz.questions)
            ? existingQuiz.questions
            : [];

          // Create a map to track unique questions by id
          const questionMap = new Map();

          // Add existing questions to the map
          existingQuestions.forEach((question) => {
            questionMap.set(question.id, question);
          });

          // Add new questions to the map, ensuring no duplicates
          newQuestions.forEach((question) => {
            questionMap.set(question.id, question); // This will overwrite duplicates
          });

          // Convert the map back to an array
          const updatedQuestions = Array.from(questionMap.values());

          await axios.patch(`${BASE_URL}/quizzes/${quizId}`, {
            ...existingQuiz,
            questions: updatedQuestions,
          });

          setQuestions(updatedQuestions);
          alert('Questions uploaded successfully!');
        } catch (error) {
          console.error('Error uploading questions:', error);
          alert('Error uploading questions. Please check the file format and try again.');
        }
      };

      reader.readAsText(file);
    };

    fileInput.click();
  };

  // CSV parsing function
  const CSVToJson = (csv) => {
    // First clean up any carriage returns and ensure we have proper line breaks
    const cleanedCsv = csv.replace(/\r/g, '').trim();
    const lines = cleanedCsv.split('\n');
    const headers = lines[0].split(',');

    const questions = [];

    for (let i = 1; i < lines.length; i++) {
      // Skip empty lines
      if (!lines[i].trim()) continue;

      // Handle quoted CSV values properly
      const currentLine = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
      if (!currentLine || currentLine.length < headers.length) continue;

      const values = currentLine.map((str) => str.replace(/^"|"$/g, '').trim());

      // Get field values using header positions
      const id = values[headers.indexOf('id')]?.trim();
      const question = values[headers.indexOf('question')]?.trim();
      const rawAnswers = values[headers.indexOf('answers')]?.trim() || '';
      const correctAnswer = values[headers.indexOf('correctAnswer')]?.trim();

      // Handle both semicolon and comma separated answers
      const answers = rawAnswers.includes(';')
        ? rawAnswers
            .split(';')
            .map((a) => a.trim())
            .filter(Boolean)
        : rawAnswers
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean);

      // Only add if all required fields are present and valid
      if (id && question && answers.length > 0 && correctAnswer) {
        questions.push({
          id,
          question,
          answers,
          correctAnswer,
        });
      }
    }

    return questions;
  };

  const handleRandomSelect = (count) => {
    // Reset previous selections
    setSelectedQuestions([]);

    // Get available questions that aren't already in the quiz
    const availableQuestions = questions.filter((q) => {
      const existingQuiz = quiz?.questionsSelected || [];
      return !existingQuiz.some((eq) => eq.id === q.id);
    });

    // Randomly select specified number of questions
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const selectedRandomQuestions = shuffled.slice(0, count);

    // Update selected questions
    setSelectedQuestions(selectedRandomQuestions.map((q) => q.id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-2">All Questions</h1>
      <div>
        <QuizHeader />
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleDelete}
          className="btn btn-outline btn-error btn-sm gap-2"
          disabled={selectedQuestions.length === 0}
        >
          <Trash className="w-4 h-4" />
          Delete Selected
        </button>
        <div className="flex justify-end">
          <button
            onClick={handleUploadQuestions}
            className="btn btn-outline btn-success btn-sm gap-2 mr-2"
          >
            <Upload className="w-4 h-4" />
            Upload Questions
          </button>
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
        <div>
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="hover px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="checkbox"
                  />
                </th>
                <th className="cursor-pointer hover:bg-base-300 transition-colors duration-200">
                  Question
                </th>
                <th className="cursor-pointer hover:bg-base-300 transition-colors duration-200">
                  Options
                </th>
                <th className="cursor-pointer hover:bg-base-300 transition-colors duration-200">
                  Correct Answer
                </th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions.map((question, index) => (
                <tr key={`question-${question.id}-${index}`}>
                  <td className="hover px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleSelect(question.id)}
                      className="checkbox"
                    />
                  </td>
                  <td className="hover px-6 py-4">{question.question}</td>
                  <td className="hover px-6 py-4">
                    <ul>
                      {question.answers.map((answer, idx) => (
                        <li key={`answer-${question.id}-${idx}`}>{answer}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="hover px-6 py-4 text-green-600">{question.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Contrôles de pagination */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="btn btn-primary"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <span className="text-center">
              Page {currentPage} sur {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="btn btn-primary"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
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
                // Clear all selected questions when selecting the default option
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
            <form onSubmit={handleAddQuestion}>
              <input
                type="text"
                placeholder="Question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="input input-bordered w-full mb-2"
                required
              />
              {newQuestion.answers.map((answer, idx) => (
                <input
                  key={`new-answer-${idx}`}
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={answer}
                  onChange={(e) => {
                    const newAnswers = [...newQuestion.answers];
                    newAnswers[idx] = e.target.value;
                    setNewQuestion({ ...newQuestion, answers: newAnswers });
                  }}
                  className="input input-bordered w-full mb-2"
                  required
                />
              ))}
              <select
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                className="select select-bordered w-full mb-4"
                required
              >
                <option value="">Select Correct Answer</option>
                {newQuestion.answers.map((answer, idx) => (
                  <option key={`new-correct-answer-${idx}`} value={answer}>
                    {answer}
                  </option>
                ))}
              </select>
              {newQuestion.question.trim() === '' ||
              newQuestion.answers.some((answer) => answer.trim() === '') ? (
                <p className="text-red-500">Please fill in all fields</p>
              ) : null}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    newQuestion.question.trim() === '' ||
                    newQuestion.answers.some((answer) => answer.trim() === '')
                  }
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
