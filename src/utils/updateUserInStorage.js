const updateUserInStorage = (updatedUser) => {
  localStorage.setItem('user', JSON.stringify(updatedUser));
  sessionStorage.setItem('user', JSON.stringify(updatedUser));
};

export default updateUserInStorage;
