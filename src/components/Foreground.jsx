import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import Cards from "./Cards";
import AddCardModal from "./AddCardModal";

function Foreground() {
  const ref = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [data, setData] = useState([
    {
      desc: "This is the first card with some sample text content",
      filesize: "0.9 MB",
      close: false,
      tag: {
        isopen: true,
        tagTitle: "Download Now",
        tagColor: "green",
      },
    },
    {
      desc: "This is the second card with more content to show",
      filesize: "0.9 MB",
      close: false,
      tag: {
        isopen: true,
        tagTitle: "Upload",
        tagColor: "blue",
      },
    },
    {
      desc: "This is the third card with sample description",
      filesize: "0.4 MB",
      close: true,
      tag: {
        isopen: false,
        tagTitle: "Download Now",
        tagColor: "green",
      },
    },
  ]);

  const handleSaveCard = (newCard) => {
    setData((prev) => [...prev, newCard]);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        ref={ref}
        className="fixed inset-0 z-[3] flex flex-wrap gap-6 p-8 overflow-auto"
        style={{
          background:
            "radial-gradient(circle at center, rgba(30,30,30,0) 0%, rgba(0,0,0,0.3) 100%)",
        }}
      >
        {data.map((item, index) => (
          <Cards key={index} data={item} reference={ref} />
        ))}
      </div>

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsModalOpen(true)}
        className="
          fixed bottom-8 right-8 z-[40]
          flex h-14 w-14 items-center justify-center
          rounded-full
          bg-gradient-to-br from-blue-500 to-blue-600
          shadow-lg shadow-blue-500/40
          text-white
          hover:from-blue-400 hover:to-blue-500
          transition-colors
        "
      >
        <FaPlus className="text-[18px]" />
      </motion.button>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCard}
      />
    </>
  );
}

export default Foreground;