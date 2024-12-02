import axios from 'axios';

export const BASE_URL = 'http://localhost:3000';

export const getTimeStatus = (deadline) => {
  try {
    if (!deadline) {
      return { text: 'No deadline', color: 'badge-warning', urgency: 'none' };
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      throw new Error('Invalid date format');
    }

    const now = new Date();
    const timeDiff = deadlineDate - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (timeDiff <= 0) {
      return { text: 'Expired', color: 'badge-error', urgency: 'expired' };
    }
    if (daysLeft <= 1) {
      return { text: 'Due Today', color: 'badge-warning', urgency: 'urgent' };
    }
    if (daysLeft <= 3) {
      return { text: `${daysLeft} days left`, color: 'badge-warning', urgency: 'soon' };
    }
    return { text: `${daysLeft} days left`, color: 'badge-info', urgency: 'normal' };
  } catch (error) {
    console.error('Error calculating time status:', error);
    return { text: 'Invalid date', color: 'badge-error', urgency: 'error' };
  }
};

export const fetchQuizDetails = async (quizId) => {
  try {
    const response = await axios.get(`${BASE_URL}/quizzes/${quizId}`);
    const { courseName, Deadline } = response.data;
    return { courseName, quizId, Deadline };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const formatDeadline = (deadline) => {
  try {
    return new Date(deadline).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return 'Invalid date';
  }
};
