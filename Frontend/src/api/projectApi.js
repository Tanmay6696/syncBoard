import axiosClient from "./axiosClient";

// List all projects across all workspaces owned by the user
export const getProjects = () =>
  axiosClient.get("/projects");

// List projects inside a specific workspace
export const getProjectsByWorkspace = (workspaceId) =>
  axiosClient.get(`/projects/workspace/${workspaceId}`);

export const getProject = (id) =>
  axiosClient.get(`/projects/${id}`);

export const createProject = ({ name, description, workspaceId }) =>
  axiosClient.post("/projects", { name, description, workspaceId });

export const updateProject = (id, { name, description }) =>
  axiosClient.put(`/projects/${id}`, { name, description });

export const deleteProject = (id) =>
  axiosClient.delete(`/projects/${id}`);