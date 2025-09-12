import apiClient from './apiClient';

// Get all groups for the currently logged-in user
export const getMyGroups = () => {
  return apiClient.get('/groups/my-groups');
};

// Create a new group
export const createGroup = (groupData) => {
    return apiClient.post('/groups', groupData);
};

// Function to get all members for a specific group
export const getGroupMembers = (groupId) => {
  return apiClient.get(`/groups/${groupId}/members`);
};

// Function to add a new member to a group
export const addGroupMember = (groupId, memberEmail) => {
  // The backend expects an object with an 'email' key
  return apiClient.post(`/groups/${groupId}/members`, { email: memberEmail });
};

// Function to remove a member from a group
export const removeGroupMember = (groupId, userId) => {
  return apiClient.delete(`/groups/${groupId}/members/${userId}`);
};