import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BASE_URL } from '../utils/quizUtils';

const AIQuestionGenerator = ({ quizId, onQuestionsGenerated }) => {
  const [quiz, setQuiz] = useState({});
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      const response = await fetch(`${BASE_URL}/quizzes/${quizId}`);
      const quizData = await response.json();
      setQuiz(quizData);
    };

    fetchQuizDetails();
  }, [quizId]);

  useEffect(() => {
    setTopic(quiz?.courseName || '');
  }, [quiz]);

  const apiKey = 'AIzaSyAcdlS5nhIFfLN_hYjdk5g14ZwDgREmduI';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const generateQuestionId = (index) => {
    return `${index + 1}`;
  };

  const parseGeneratedText = (responseText) => {
    const questionBlocks = responseText.split('\n\n');

    return questionBlocks
      .map((block) => {
        const lines = block.split('\n').filter((line) => line.trim());
        if (lines.length < 6) return null;

        const question = lines[0].trim().replace(/^\d+\.\s*/, '');

        const answers = lines
          .slice(1, 5)
          .map((line) => line.trim())
          .map((line) => line.replace(/^[A-Z]\.\s*/i, ''))
          .filter((answer) => answer !== '' && answer.length > 0);

        const correctAnswer = lines[5]
          .trim()
          .replace(/^Correct Answer:\s*/i, '')
          .replace(/^[A-Z]\.\s*/i, '');

        while (answers.length < 4) {
          answers.push(`Option ${answers.length + 1}`);
        }

        return {
          question,
          answers: answers.slice(0, 4),
          correctAnswer,
        };
      })
      .filter((q) => q !== null);
  };

  const generateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      };

      const prompt = `Generate a concise multiple-choice of 10 questions about ${topic}. 
          Ensure the question is clear, professional, and suitable for an academic quiz.
          Format the response with:
          [Your question here]
          [First option]
          [Second option]
          [Third option]
          [Fourth option]
          Correct Answer: [Correct option text, matching one of the above options exactly]

          Separate each question with a blank line.`;

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(prompt);
      const responseText = await result.response.text();

      console.log('API Response:', responseText);

      const parsedQuestions = parseGeneratedText(responseText);

      if (parsedQuestions && parsedQuestions.length > 0) {
        const newQuestions = parsedQuestions.map((parsedData, index) => ({
          id: generateQuestionId(index),
          question: parsedData.question,
          answers: parsedData.answers,
          correctAnswer: parsedData.correctAnswer,
        }));

        const response = await fetch(`${BASE_URL}/quizzes/${quizId}`);
        const existingQuiz = await response.json();
        const updatedQuestions = [...(existingQuiz.questions || []), ...newQuestions];

        await fetch(`${BASE_URL}/quizzes/${quizId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questions: updatedQuestions,
          }),
        });

        onQuestionsGenerated(updatedQuestions);
        console.log('Generated Questions:', newQuestions);

        setTopic(quiz?.courseName || '');
      } else {
        setError('Failed to parse the generated text. Please try again.');
      }
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('An error occurred while generating questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generateQuestions}
      className="btn btn-outline btn-secondary btn-sm gap-2"
      disabled={loading}
    >
      <Sparkles className="w-4 h-4" />
      {loading ? 'Generating...' : 'Generate AI Questions'}
    </button>
  );
};

export default AIQuestionGenerator;
