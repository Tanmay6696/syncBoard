import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

function AddCardModal({ isOpen, onClose, onSave }) {
  const [description, setDescription] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [action, setAction] = useState("download");
  const [showTag, setShowTag] = useState(true);
  const [tagTitle, setTagTitle] = useState("Download Now");
  const [tagColor, setTagColor] = useState("green");

  const handleSave = () => {
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }

    const newCard = {
      title: description.substring(0, 30),
      desc: description,
      filesize: fileSize,
      close: action === "close",

      tag: {
        isopen: showTag,
        tagTitle: tagTitle,
        tagColor: tagColor,
      },

      xPosition: 100,
      yPosition: 100,
    };

    onSave(newCard);

    // Reset form
    setDescription("");
    setFileSize("");
    setAction("download");
    setShowTag(true);
    setTagTitle("Download Now");
    setTagColor("green");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed inset-0 z-[50]
              bg-black/70
              backdrop-blur-sm
            "
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            className="
              fixed
              left-1/2
              top-1/2
              z-[60]
              w-[440px]
              max-w-[calc(100vw-32px)]
              -translate-x-1/2
              -translate-y-1/2
              rounded-2xl
              border border-white/10
              bg-gradient-to-br
              from-zinc-800
              to-zinc-900
              p-7
              text-white
              shadow-2xl
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Add New Card
              </h2>

              <button
                onClick={onClose}
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  bg-white/5
                  hover:bg-white/10
                "
              >
                <IoMdClose className="text-xl" />
              </button>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="text-xs text-zinc-400">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter card description"
                rows={4}
                className="
                  mt-2 w-full resize-none
                  rounded-xl
                  border border-white/10
                  bg-zinc-800/70
                  px-4 py-3
                  text-sm text-white
                  outline-none
                  placeholder:text-zinc-500
                  focus:border-blue-500
                "
              />
            </div>

            {/* File Size */}
            <div className="mt-5">
              <label className="text-xs text-zinc-400">
                File Size
              </label>

              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 1.2 MB"
                className="
                  mt-2 w-full
                  rounded-xl
                  border border-white/10
                  bg-zinc-800/70
                  px-4 py-3
                  text-sm text-white
                  outline-none
                  placeholder:text-zinc-500
                  focus:border-blue-500
                "
              />
            </div>

            {/* Action */}
            <div className="mt-5">
              <label className="text-xs text-zinc-400">
                Action Icon
              </label>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAction("download")}
                  className={`
                    rounded-xl border px-4 py-3 text-sm
                    ${
                      action === "download"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                        : "border-white/10 bg-zinc-800 text-zinc-400"
                    }
                  `}
                >
                  Download
                </button>

                <button
                  type="button"
                  onClick={() => setAction("close")}
                  className={`
                    rounded-xl border px-4 py-3 text-sm
                    ${
                      action === "close"
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : "border-white/10 bg-zinc-800 text-zinc-400"
                    }
                  `}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Show Tag */}
            <div className="mt-5 flex items-center justify-between">
              <label className="text-xs text-zinc-400">
                Show Bottom Tag
              </label>

              <button
                type="button"
                onClick={() => setShowTag(!showTag)}
                className={`
                  relative h-7 w-14 rounded-full
                  ${showTag ? "bg-blue-500" : "bg-zinc-700"}
                `}
              >
                <span
                  className={`
                    absolute top-1 h-5 w-5
                    rounded-full bg-white
                    transition-all
                    ${showTag ? "left-8" : "left-1"}
                  `}
                />
              </button>
            </div>

            {/* Tag Title */}
            <div className="mt-5">
              <label className="text-xs text-zinc-400">
                Tag Title
              </label>

              <input
                type="text"
                value={tagTitle}
                disabled={!showTag}
                onChange={(e) => setTagTitle(e.target.value)}
                className="
                  mt-2 w-full
                  rounded-xl
                  border border-white/10
                  bg-zinc-800/70
                  px-4 py-3
                  text-sm text-white
                  outline-none
                  disabled:opacity-40
                "
              />
            </div>

            {/* Tag Color */}
            <div className="mt-5">
              <label className="text-xs text-zinc-400">
                Tag Color
              </label>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!showTag}
                  onClick={() => setTagColor("green")}
                  className={`
                    rounded-xl border px-4 py-3 text-sm
                    ${
                      tagColor === "green"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                        : "border-white/10 bg-zinc-800 text-zinc-400"
                    }
                  `}
                >
                  Green
                </button>

                <button
                  type="button"
                  disabled={!showTag}
                  onClick={() => setTagColor("blue")}
                  className={`
                    rounded-xl border px-4 py-3 text-sm
                    ${
                      tagColor === "blue"
                        ? "border-blue-500 bg-blue-500/20 text-blue-300"
                        : "border-white/10 bg-zinc-800 text-zinc-400"
                    }
                  `}
                >
                  Blue
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                className="
                  rounded-xl
                  border border-white/10
                  bg-zinc-800
                  px-4 py-3
                  text-sm
                  hover:bg-zinc-700
                "
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-500 to-blue-600
                  px-4 py-3
                  text-sm font-medium
                  hover:from-blue-400
                  hover:to-blue-500
                "
              >
                Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddCardModal;