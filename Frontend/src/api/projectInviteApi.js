import axiosClient from "./axiosClient";

// Send an invite (ADMIN only)
export const sendInvite = (projectId, { email, role }) =>
  axiosClient.post(`/projects/${projectId}/invites`, { email, role });

// List all invites for a project (ADMIN only)
export const getProjectInvites = (projectId) =>
  axiosClient.get(`/projects/${projectId}/invites`);

// Revoke an invite (ADMIN only)
export const revokeInvite = (projectId, inviteId) =>
  axiosClient.delete(`/projects/${projectId}/invites/${inviteId}`);

// My pending invites
export const getMyInvites = () =>
  axiosClient.get("/invites/me");

// Get invite by token (public-ish)
export const getInviteByToken = (token) =>
  axiosClient.get(`/invites/token/${token}`);

// Accept
export const acceptInvite = (token) =>
  axiosClient.post(`/invites/token/${token}/accept`);

// Decline
export const declineInvite = (token) =>
  axiosClient.post(`/invites/token/${token}/decline`);