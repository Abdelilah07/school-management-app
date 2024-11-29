/**
 * Retrieves a value from localStorage or sessionStorage.
 * @param {string} key - The storage key.
 * @returns {Object|null} - Parsed value or null if not found.
 */
const getUserFromStorage = (key) => {
  try {
    const user = localStorage.getItem(key) || sessionStorage.getItem(key);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return null;
  }
};

export default getUserFromStorage;
