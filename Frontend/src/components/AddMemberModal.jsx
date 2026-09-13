import { useState } from "react";
import { motion } from "framer-motion";
import { addMember } from "../api/projectMemberApi";

const ROLES = ["ADMIN", "MEMBER", "VIEWER"];

export default function AddMemberModal({ isOpen, onClose, projectId, onAdded }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await addMember(projectId, {
        email: email.trim().toLowerCase(),
        role,
      });
      onAdded?.(data);
      setEmail("");
      setRole("MEMBER");
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
      >
        <h2 className="mb-4 text-xl font-bold text-white">Add Member</h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm text-zinc-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            autoFocus
            className="mb-4 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <label className="mb-2 block text-sm text-zinc-300">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mb-6 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}