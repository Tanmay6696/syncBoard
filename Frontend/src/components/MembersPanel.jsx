import { useEffect, useState } from "react";
import {
  getMembers,
  removeMember,
  changeMemberRole,
} from "../api/projectMemberApi";
import AddMemberModal from "./AddMemberModal";
import SendInviteModal from "./SendInviteModal";
import PendingInvitesList from "./PendingInvitesList";

const ROLES = ["ADMIN", "MEMBER", "VIEWER"];

export default function MembersPanel({ projectId, currentUserId, isAdmin = true }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddMember, setShowAddMember] = useState(false);
  const [showSendInvite, setShowSendInvite] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getMembers(projectId);
      setMembers(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data } = await changeMemberRole(projectId, userId, newRole);
      setMembers((prev) =>
        prev.map((m) => (m.userId === userId ? { ...m, role: data.role } : m))
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change role");
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm("Remove this member?")) return;
    try {
      await removeMember(projectId, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove member");
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Members</h2>
          <p className="text-sm text-zinc-500">
            {members.length} {members.length === 1 ? "person" : "people"} in this project
          </p>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddMember(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              + Add Member
            </button>
            <button
              onClick={() => setShowSendInvite(true)}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
            >
              + Invite
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Members list */}
      {loading ? (
        <p className="text-zinc-400">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-zinc-500">No members yet.</p>
      ) : (
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">
                  {m.name}
                  {m.userId === currentUserId && (
                    <span className="ml-2 text-xs text-zinc-500">(you)</span>
                  )}
                </p>
                <p className="text-xs text-zinc-500">{m.email}</p>
              </div>

              <div className="flex items-center gap-3">
                {isAdmin && m.userId !== currentUserId ? (
                  <>
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.userId, e.target.value)}
                      className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleRemove(m.userId)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                    {m.role}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pending Invites */}
      {isAdmin && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold text-white">Pending Invites</h3>
          <PendingInvitesList projectId={projectId} />
        </div>
      )}

      {/* Modals */}
      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        projectId={projectId}
        onAdded={(newMember) => setMembers((prev) => [...prev, newMember])}
      />

      <SendInviteModal
        isOpen={showSendInvite}
        onClose={() => setShowSendInvite(false)}
        projectId={projectId}
      />
    </div>
  );
}