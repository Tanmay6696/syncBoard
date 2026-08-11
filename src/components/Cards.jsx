import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";

function Cards({ data, reference }) {
  const tagColor =
    data.tag.tagColor === "blue"
      ? "bg-gradient-to-r from-blue-500 to-blue-600"
      : "bg-gradient-to-r from-emerald-500 to-green-600";

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
      className="
        relative
        flex-shrink-0
        flex
        flex-col
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
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />

      {/* Top content: icon + description (flexes, never pushes into footer) */}
      <div className="relative flex flex-col flex-1 min-h-0 p-5">
        {/* File Icon */}
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
          <FaFileAlt className="text-[16px] text-blue-400" />
        </div>

        {/* Description */}
        <div className="mt-3 flex-1 min-h-0 overflow-hidden pr-1">
          <p className="text-[12px] font-light leading-[1.5] text-zinc-300 line-clamp-3">
            {data.desc}
          </p>
        </div>
      </div>

      {/* Footer: normal flow, fixed size, can never overlap the text above */}
      <div className="relative flex-shrink-0">
        {/* Divider line */}
        <div className="mx-5 h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

        {/* File size + action */}
        <div className="flex items-center justify-between px-5 py-2.5">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase whitespace-nowrap">
            {data.filesize}
          </span>

          <motion.span
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full
              ${
                data.close
                  ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
                  : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
              }
              transition-all duration-200
            `}
          >
            {data.close ? (
              <IoMdClose className="text-[14px]" />
            ) : (
              <LuDownload className="text-[12px]" />
            )}
          </motion.span>
        </div>

        {/* Bottom Tag */}
        {data.tag.isopen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${tagColor} flex h-10 w-full items-center justify-center gap-2`}
          >
            <p className="text-[11px] font-semibold tracking-wide text-white whitespace-nowrap">
              {data.tag.tagTitle}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Cards;