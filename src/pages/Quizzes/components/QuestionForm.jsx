import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';

const QuestionForm = ({ initialQuestion, onSubmit, onCancel }) => {
  const [question, setQuestion] = useState(
    initialQuestion || {
      question: '',
      answers: ['', '', '', ''],
      correctAnswer: '',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(question);
    }
  };

  const validateForm = () => {
    return (
      question.question.trim() !== '' &&
      question.answers.every((answer) => answer.trim() !== '') &&
      question.correctAnswer.trim() !== ''
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Question"
        value={question.question}
        onChange={(e) => setQuestion({ ...question, question: e.target.value })}
        className="input input-bordered w-full mb-2"
        required
      />
      {question.answers.map((answer, idx) => (
        <input
          key={`answer-${idx}`}
          type="text"
          placeholder={`Option ${idx + 1}`}
          value={answer}
          onChange={(e) => {
            const newAnswers = [...question.answers];
            newAnswers[idx] = e.target.value;
            setQuestion({ ...question, answers: newAnswers });
          }}
          className="input input-bordered w-full mb-2"
          required
        />
      ))}
      <select
        value={question.correctAnswer}
        onChange={(e) => setQuestion({ ...question, correctAnswer: e.target.value })}
        className="select select-bordered w-full mb-4"
        required
      >
        <option value="">Select Correct Answer</option>
        {question.answers.map((answer, idx) => (
          <option key={`correct-answer-${idx}`} value={answer}>
            {answer}
          </option>
        ))}
      </select>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={!validateForm()}>
          <PlusCircle className="w-4 h-4 mr-2" />
          {initialQuestion ? 'Update' : 'Add'} Question
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
