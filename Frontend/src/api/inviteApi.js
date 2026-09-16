// api/inviteApi.js
import axios from "axios";

export const getMyInvites  = ()       => axios.get("/me/invites");
export const acceptInvite  = (id)     => axios.post(`/me/invites/${id}/accept`);
export const rejectInvite  = (id)     => axios.post(`/me/invites/${id}/reject`);