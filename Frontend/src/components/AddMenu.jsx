import React, { useState } from "react";
import { FaPlus, FaFolder, FaTasks, FaLayerGroup } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const OPTIONS = [
  { key: "workspace", label: "Workspace", icon: <FaLayerGroup /> },
  { key: "project", label: "Project", icon: <FaFolder /> },
  { key: "task", label: "Task", icon: <FaTasks /> },
];

function AddMenu({ onSelect }) {
  const [open, setOpen] = useState(false);

  const handlePick = (key) => {
    console.log("Selected option from AddMenu:", key);
    setOpen(false);
    onSelect(key);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[40]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-[72px] right-0 flex flex-col gap-2"
          >
            {OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handlePick(opt.key)}
                className="
                  flex items-center gap-2 whitespace-nowrap
                  rounded-xl border border-white/10 bg-zinc-800
                  px-4 py-3 text-sm text-white shadow-lg
                  hover:bg-zinc-700
                "
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((o) => !o)}
        className="
          flex h-14 w-14 items-center justify-center rounded-full
          bg-gradient-to-br from-blue-500 to-blue-600
          shadow-lg shadow-blue-500/40 text-white
          hover:from-blue-400 hover:to-blue-500 transition-colors
        "
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }}>
          <FaPlus className="text-[18px]" />
        </motion.span>
      </motion.button>
    </div>
  );
}

export default AddMenu;