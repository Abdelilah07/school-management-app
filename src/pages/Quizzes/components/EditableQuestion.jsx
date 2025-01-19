import React, { useState } from 'react';
import { Edit } from 'lucide-react';

const EditableQuestion = ({
  question,
  onSave,
  selectedQuestions,
  handleSelect,
  editingQuestionId, 
  onEditStart,       
  onEditEnd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({ ...question });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name.startsWith('answers[')) {
        const index = parseInt(name.match(/\[(\d+)\]/)[1], 10);
        setEditedQuestion((prevQuestion) => {
          const updatedAnswers = [...prevQuestion.answers];
          updatedAnswers[index] = value;
          return { ...prevQuestion, answers: updatedAnswers };
        });
      } else {
        setEditedQuestion((prevQuestion) => ({
          ...prevQuestion,
          [name]: type === 'checkbox' ? checked : value,
        }));
      }
  };

  const handleSave = () => {
    onSave(editedQuestion);
    setIsEditing(false);
    onEditEnd(); 
  };
  const handleEditClick = () => {
    if (!editingQuestionId) { 
      onEditStart(question.id); 
      setIsEditing(true); 
    }
  };


  return (
    <tr> 
      <td>
        <input
          type="checkbox"
          checked={selectedQuestions.includes(question.id)}
          onChange={() => handleSelect(question.id)}
          className="checkbox"
        />
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="question"
            value={editedQuestion.question}
            onChange={handleInputChange}
            className="input input-bordered input-sm w-full max-w-xs"
          />
        ) : (
          editedQuestion.question 
        )}
      </td>
      <td>
        <ul className="list-none pl-4"> 
          {isEditing
            ? editedQuestion.answers.map((answer, idx) => (
                <li key={`answer-${question.id}-${idx}`}>
                  <input
                    type="text"
                    name={`answers[${idx}]`}
                    value={answer}
                    onChange={handleInputChange}
                    className="input input-bordered input-sm w-full max-w-xs"
                  />
                </li>
              ))
            :  (
                editedQuestion.answers.map((answer) => (
                  <li key={`answer-${answer}`}>{answer}</li>
                ))
              )}
        </ul>
      </td>
      <td>
        {isEditing ? (
          <div>
            {editedQuestion.answers.map((answer, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={answer}
                  checked={editedQuestion.correctAnswer === answer}
                  onChange={handleInputChange}
                  className="radio radio-sm mr-2" 
                />
                <label htmlFor={answer}>{answer}</label>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-green-600">{editedQuestion.correctAnswer}</span>
        )}
      </td>
      <td>
        <div className="btn-group btn-group-xs"> 
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn btn-outline btn-success"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-outline btn-error"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick} 
              className="btn btn-outline btn-primary"
              disabled={editingQuestionId !== null && editingQuestionId !== question.id}
            >
              <Edit size={16} className="mr-2" />
                Update
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default EditableQuestion;
