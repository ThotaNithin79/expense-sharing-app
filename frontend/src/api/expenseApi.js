import apiClient from './apiClient';

// Note: For now, we are hardcoding groupId = 1.
// In a real app, the user would select their group, and you would pass the
// dynamic groupId to these functions.

// Function to get all expenses for a group
export const getExpensesForGroup = (groupId = 1) => {
  return apiClient.get(`/expenses/group/${groupId}`);
};

// Function to get the calculated balances for a group
export const getBalancesForGroup = (groupId = 1) => {
  return apiClient.get(`/expenses/group/${groupId}/balances`);
};

export const addExpense = (expenseData, proofFile) => {
  // We need to send multipart/form-data, so we create a FormData object
  const formData = new FormData();

  // 1. Append the JSON data as a 'Blob'.
  // We must stringify the JSON and explicitly set the content type.
  const expenseBlob = new Blob([JSON.stringify(expenseData)], {
    type: 'application/json'
  });
  formData.append('expense', expenseBlob);

  // 2. Append the file if it exists.
  if (proofFile) {
    formData.append('proofFile', proofFile);
  }

  // 3. Make the API call with the FormData object.
  // Axios will automatically set the correct 'Content-Type: multipart/form-data' header.
  return apiClient.post('/expenses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};