import axiosClient from "./axiosClient";

// List members of a project
export const getMembers = (projectId) =>
  axiosClient.get(`/projects/${projectId}/members`);

// Add a member directly (user must already exist)
export const addMember = (projectId, { email, role }) =>
  axiosClient.post(`/projects/${projectId}/members`, { email, role });

// Change a member's role
export const changeMemberRole = (projectId, userId, role) =>
  axiosClient.put(`/projects/${projectId}/members/${userId}`, { role });

// Remove a member
export const removeMember = (projectId, userId) =>
  axiosClient.delete(`/projects/${projectId}/members/${userId}`);

// Leave a project (self-removal)
export const leaveProject = (projectId) =>
  axiosClient.delete(`/projects/${projectId}/members/me`);