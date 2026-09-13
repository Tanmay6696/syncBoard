import axiosClient from "./axiosClient";

// GET all workspaces for the logged-in user
export const getWorkspaces = () =>
  axiosClient.get("/workspaces");

// GET one workspace by id
export const getWorkspace = (id) =>
  axiosClient.get(`/workspaces/${id}`);

// CREATE a workspace
export const createWorkspace = ({ name }) =>
  axiosClient.post("/workspaces", { name });

// UPDATE a workspace
export const updateWorkspace = (id, { name }) =>
  axiosClient.put(`/workspaces/${id}`, { name });

// DELETE a workspace
export const deleteWorkspace = (id) =>
  axiosClient.delete(`/workspaces/${id}`);