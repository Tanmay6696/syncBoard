// components/InvitesInbox.jsx
import { useEffect, useState } from "react";
import { getMyInvites, acceptInvite, rejectInvite } from "../api/inviteApi";

export default function InvitesInbox({ onChanged }) {
  const [invites, setInvites] = useState([]);

  const load = () =>
    getMyInvites()
      .then(({ data }) => setInvites(data))
      .catch(() => setInvites([]));

  useEffect(() => { load(); }, []);

  const handle = async (id, action) => {
    await (action === "accept" ? acceptInvite(id) : rejectInvite(id));
    await load();
    onChanged?.();       // refresh workspaces so the newly accepted one appears
  };

  if (invites.length === 0) return null;

  return (
    <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6">
      <h2 className="text-lg font-semibold text-yellow-200">Pending Invites</h2>
      <ul className="mt-4 space-y-3">
        {invites.map((inv) => (
          <li key={inv.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3">
            <div>
              <p className="text-white">{inv.workspaceName}</p>
              <p className="text-xs text-zinc-400">
                Invited by {inv.invitedByUsername}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handle(inv.id, "accept")}
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => handle(inv.id, "reject")}
                className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}