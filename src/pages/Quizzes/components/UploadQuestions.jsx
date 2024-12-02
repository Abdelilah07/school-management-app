import React from 'react';
import { Upload } from 'lucide-react';
import { CSVToJson } from '../utils/csvParser';
import { BASE_URL } from '../utils/quizUtils';

const UploadQuestions = ({ quizId, onQuestionsUploaded }) => {
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

          const response = await fetch(`${BASE_URL}/quizzes/${quizId}`);
          const existingQuiz = await response.json();

          if (!existingQuiz) {
            alert(`Quiz with ID ${quizId} not found`);
            return;
          }

          const existingQuestions = Array.isArray(existingQuiz.questions)
            ? existingQuiz.questions
            : [];

          const questionMap = new Map();
          existingQuestions.forEach((question) => {
            questionMap.set(question.id, question);
          });

          newQuestions.forEach((question) => {
            questionMap.set(question.id, question);
          });

          const updatedQuestions = Array.from(questionMap.values());

          await fetch(`${BASE_URL}/quizzes/${quizId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...existingQuiz,
              questions: updatedQuestions,
            }),
          });

          onQuestionsUploaded(updatedQuestions);
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

  return (
    <button onClick={handleUploadQuestions} className="btn btn-outline btn-success btn-sm gap-2">
      <Upload className="w-4 h-4" />
      Upload Questions
    </button>
  );
};

export default UploadQuestions;
