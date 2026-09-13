import React from "react";
import { FaFileAlt, FaCheck } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { motion } from "framer-motion";

function Cards({
  data,
  id,
  x,
  y,
  reference,
  onDragEnd,
  onDelete,
  onComplete,
}) {
  const tag = data.tag || {
    isopen: true,
    tagTitle: "To Do",
    tagColor: "blue",
  };

  const tagColor =
    tag.tagColor === "blue"
      ? "bg-gradient-to-r from-blue-500 to-blue-600"
      : tag.tagColor === "orange"
      ? "bg-gradient-to-r from-orange-500 to-orange-600"
      : tag.tagColor === "purple"
      ? "bg-gradient-to-r from-purple-500 to-purple-600"
      : "bg-gradient-to-r from-emerald-500 to-green-600";

  const handleComplete = (event) => {
    event.stopPropagation();

    if (onComplete) {
      onComplete(id);
    }
  };

  const handleDelete = (event) => {
    event.stopPropagation();

    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.05, rotate: -2 }}
      dragElastic={0.1}
      dragTransition={{
        bounceStiffness: 100,
        bounceDamping: 50,
      }}
      initial={false}
      style={{
        position: "absolute",
        top: y ?? 0,
        left: x ?? 0,
      }}
      onDragEnd={(event, info) => {
        const newX = (x ?? 0) + info.offset.x;
        const newY = (y ?? 0) + info.offset.y;

        onDragEnd(id, newX, newY);
      }}
      className="
        relative
        flex
        flex-col
        flex-shrink-0
        w-[240px]
        h-[280px]
        rounded-2xl
        bg-gradient-to-br
        from-zinc-800/90
        to-zinc-900/90
        backdrop-blur-sm
        text-white
        overflow-hidden
        shadow-2xl
        border
        border-white/5
        hover:border-white/10
        transition-all
        duration-300
        cursor-grab
        active:cursor-grabbing
      "
    >
      {/* Glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

      {/* Main content */}
      <div className="relative flex flex-col flex-1 min-h-0 p-5">

        {/* Header */}
        <div className="flex items-center justify-between">

          {/* File icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
            <FaFileAlt className="text-[16px] text-blue-400" />
          </div>

          {/* Delete */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="
              flex
              items-center
              justify-center
              w-8
              h-8
              rounded-full
              bg-white/5
              text-zinc-400
              hover:bg-red-500/20
              hover:text-red-400
              transition
            "
          >
            <HiDotsVertical className="text-[18px]" />
          </motion.button>

        </div>

        {/* Title */}
        <h3 className="mt-4 text-sm font-semibold text-white truncate">
          {data.title || "Untitled Task"}
        </h3>

        {/* Description */}
        <div className="mt-2 flex-1 min-h-0 overflow-hidden">
          <p className="text-[12px] font-light leading-[1.5] text-zinc-300 line-clamp-3">
            {data.desc || "No description"}
          </p>
        </div>

        {/* Due date */}
        {data.dueDate && (
          <div className="mt-3 text-[11px] text-zinc-400">
            Due: {data.dueDate}
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="relative flex-shrink-0">

        {/* Divider */}
        <div className="mx-5 h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5">

          {/* Task text */}
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase whitespace-nowrap">
            {data.filesize || "Task"}
          </span>

          {/* Complete button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleComplete}
            className="
              flex
              h-8
              w-8
              flex-shrink-0
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-emerald-500
              to-emerald-600
              text-white
              shadow-lg
              shadow-emerald-500/30
              transition-all
            "
          >
            <FaCheck className="text-[13px]" />
          </motion.button>

        </div>

        {/* Status tag */}
        {tag.isopen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className={`${tagColor} flex h-10 w-full items-center justify-center gap-2`}
          >
            <p className="text-[11px] font-semibold tracking-wide text-white whitespace-nowrap">
              {tag.tagTitle || "To Do"}
            </p>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}

export default Cards;