import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

function AddProjectModal({ isOpen, onClose, onSave, workspaces }) {
  console.log("AddProjectModal workspaces:", workspaces);
  const [name, setName] = useState("");
  const [workspaceId, setWorkspaceId] = useState(workspaces?.[0]?.id || 0);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Enter a project name");
      return;
    }
    console.log("Selected workspaceId 0:", workspaces?.[0]?.id);

    console.log("Selected workspaceId:", workspaceId);
    if (!workspaceId) {
      setError("Select a workspace");
      return;
    }
    onSave({ name: name.trim(), workspaceId });
    setName("");
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[50] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="
              fixed left-1/2 top-1/2 z-[60] w-[420px] max-w-[calc(100vw-32px)]
              -translate-x-1/2 -translate-y-1/2 rounded-2xl
              border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900
              p-7 text-white shadow-2xl
            "
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">New Project</h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
              >
                <IoMdClose className="text-xl" />
              </button>
            </div>

            <div className="mt-6">
              <label className="text-xs text-zinc-400">Workspace</label>
              <select
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                {workspaces.length === 0 && <option value="">No workspaces yet</option>}
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label className="text-xs text-zinc-400">Project name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cricket Club"
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800/70 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-blue-500"
              />
            </div>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button onClick={onClose} className="rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm hover:bg-zinc-700">
                Cancel
              </button>
              <button onClick={handleSave} className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-medium hover:from-blue-400 hover:to-blue-500">
                Create
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddProjectModal;