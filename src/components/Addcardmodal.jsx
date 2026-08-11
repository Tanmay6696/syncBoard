import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

const initialForm = {
  desc: "",
  filesize: "",
  close: false,
  tagEnabled: true,
  tagTitle: "Download Now",
  tagColor: "green",
};

function AddCardModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.desc.trim() || !form.filesize.trim()) return;

    onSave({
      desc: form.desc.trim(),
      filesize: form.filesize.trim(),
      close: form.close,
      tag: {
        isopen: form.tagEnabled,
        tagTitle: form.tagTitle.trim() || "Download Now",
        tagColor: form.tagColor,
      },
    });

    setForm(initialForm);
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[50] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-[380px]
              rounded-2xl
              bg-gradient-to-br from-zinc-800/95 to-zinc-900/95
              backdrop-blur-md
              border border-white/10
              shadow-2xl
              text-white
              p-6
            "
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <IoMdClose className="text-[16px]" />
            </button>

            <h2 className="text-[18px] font-semibold mb-5">Add New Card</h2>

            <div className="flex flex-col gap-4">
              {/* Description */}
              <div>
                <label className="block text-[12px] font-medium text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) => handleChange("desc", e.target.value)}
                  rows={3}
                  placeholder="Enter card description"
                  className="
                    w-full resize-none rounded-lg
                    bg-white/5 border border-white/10
                    px-3 py-2 text-[13px]
                    text-white placeholder-zinc-500
                    focus:outline-none focus:border-blue-500/60
                  "
                />
              </div>

              {/* File size */}
              <div>
                <label className="block text-[12px] font-medium text-zinc-400 mb-1.5">
                  File Size
                </label>
                <input
                  type="text"
                  value={form.filesize}
                  onChange={(e) => handleChange("filesize", e.target.value)}
                  placeholder="e.g. 1.2 MB"
                  className="
                    w-full rounded-lg
                    bg-white/5 border border-white/10
                    px-3 py-2 text-[13px]
                    text-white placeholder-zinc-500
                    focus:outline-none focus:border-blue-500/60
                  "
                />
              </div>

              {/* Icon type */}
              <div>
                <label className="block text-[12px] font-medium text-zinc-400 mb-1.5">
                  Action Icon
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange("close", false)}
                    className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-medium border transition-colors ${
                      !form.close
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                        : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("close", true)}
                    className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-medium border transition-colors ${
                      form.close
                        ? "bg-red-500/20 border-red-500/50 text-red-300"
                        : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Tag toggle */}
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-medium text-zinc-400">
                  Show Bottom Tag
                </label>
                <button
                  type="button"
                  onClick={() => handleChange("tagEnabled", !form.tagEnabled)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.tagEnabled ? "bg-blue-500" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      form.tagEnabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Tag details */}
              {form.tagEnabled && (
                <>
                  <div>
                    <label className="block text-[12px] font-medium text-zinc-400 mb-1.5">
                      Tag Title
                    </label>
                    <input
                      type="text"
                      value={form.tagTitle}
                      onChange={(e) => handleChange("tagTitle", e.target.value)}
                      placeholder="e.g. Download Now"
                      className="
                        w-full rounded-lg
                        bg-white/5 border border-white/10
                        px-3 py-2 text-[13px]
                        text-white placeholder-zinc-500
                        focus:outline-none focus:border-blue-500/60
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-zinc-400 mb-1.5">
                      Tag Color
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleChange("tagColor", "green")}
                        className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-medium border transition-colors ${
                          form.tagColor === "green"
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                            : "bg-white/5 border-white/10 text-zinc-400"
                        }`}
                      >
                        Green
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("tagColor", "blue")}
                        className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-medium border transition-colors ${
                          form.tagColor === "blue"
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                            : "bg-white/5 border-white/10 text-zinc-400"
                        }`}
                      >
                        Blue
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.desc.trim() || !form.filesize.trim()}
                className="
                  flex-1 rounded-lg py-2.5 text-[13px] font-semibold
                  bg-gradient-to-r from-blue-500 to-blue-600
                  hover:from-blue-400 hover:to-blue-500
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all
                "
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddCardModal;