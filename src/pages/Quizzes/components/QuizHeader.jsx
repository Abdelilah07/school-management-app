import React from 'react';

const QuizHeader = ({ courseName, quizId, Deadline }) => (
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

export default QuizHeader;
