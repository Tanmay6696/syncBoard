import { useEffect, useState } from "react";
import { getProjectInvites, revokeInvite } from "../api/projectInviteApi";

export default function PendingInvitesList({ projectId }) {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getProjectInvites(projectId);
      setInvites(data.filter((i) => i.status === "PENDING"));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load invites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleRevoke = async (inviteId) => {
    if (!confirm("Revoke this invite?")) return;
    try {
      await revokeInvite(projectId, inviteId);
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to revoke");
    }
  };

  if (loading) return <p className="text-sm text-zinc-400">Loading invites...</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (invites.length === 0)
    return <p className="text-sm text-zinc-500">No pending invites.</p>;

  return (
    <ul className="space-y-2">
      {invites.map((inv) => (
        <li
          key={inv.id}
          className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-4 py-3"
        >
          <div>
            <p className="text-sm text-white">{inv.email}</p>
            <p className="text-xs text-zinc-500">
              Role: {inv.role} · Expires{" "}
              {new Date(inv.expiresAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => handleRevoke(inv.id)}
            className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500"
          >
            Revoke
          </button>
        </li>
      ))}
    </ul>
  );
}