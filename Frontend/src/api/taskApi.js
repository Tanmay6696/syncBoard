// api/taskApi.js
import axiosClient from "./axiosClient";

export const getTasks = (projectId) =>
  axiosClient.get(`/projects/${projectId}/tasks`);

export const createTask = (projectId, payload) =>
  axiosClient.post(`/projects/${projectId}/tasks`, payload);

export const updateTask = (projectId, taskId, payload) =>
  axiosClient.put(`/projects/${projectId}/tasks/${taskId}`, payload);

export const deleteTask = (projectId, taskId) =>
  axiosClient.delete(`/projects/${projectId}/tasks/${taskId}`);