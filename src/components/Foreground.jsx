import React, { useRef, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

import Cards from "./Cards";
import AddCardModal from "./AddCardModal";

import {
  getDocuments,
  createDocument,
  updateDocumentPosition,
  deleteDocument,
} from "../api/documentApi";


function Foreground({ user }) {

  const ref = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [data, setData] = useState([]);


  // ==============================
  // LOAD USER'S DOCUMENTS
  // ==============================

  useEffect(() => {

    if (!user || !user.userId) {
      return;
    }

    getDocuments(user.userId)
      .then((response) => {

        console.log("Documents received:");

        console.log(response.data);


        const documents = response.data.map((doc) => ({

          id: doc.documentId,

          title: doc.title,

          desc: doc.content,

          dueDate: doc.dueDate,

          filesize: doc.filesize || "",

          close: doc.close || false,

          xPosition: doc.xPosition ?? 100,

          yPosition: doc.yPosition ?? 100,

          tag: {
            isopen: true,

            tagTitle:
              doc.tagTitle || "To Do",

            tagColor:
              doc.tagColor || "blue",
          },

        }));


        setData(documents);

      })

      .catch((error) => {

        console.error(
          "Failed to load documents:",
          error
        );

      });

  }, [user]);


  // ==============================
  // CREATE CARD
  // ==============================

  const handleSaveCard = (newCard) => {

    const documentData = {

      title:
        newCard.title || "Untitled",

      content:
        newCard.desc || "",

      xPosition:
        newCard.xPosition ?? 100,

      yPosition:
        newCard.yPosition ?? 100,

      dueDate:
        newCard.dueDate || null,

      filesize:
        newCard.filesize || "",

      close:
        false,

      tagOpen:
        true,

      tagTitle:
        newCard.tag?.tagTitle || "To Do",

      tagColor:
        newCard.tag?.tagColor || "blue",

      userId:
        user.userId,
    };


    createDocument(documentData)

      .then((response) => {

        const doc = response.data;


        const newDocument = {

          id: doc.documentId,

          title: doc.title,

          desc: doc.content,

          dueDate: doc.dueDate,

          filesize:
            doc.filesize || "",

          close:
            doc.close || false,

          xPosition:
            doc.xPosition ?? 100,

          yPosition:
            doc.yPosition ?? 100,

          tag: {

            isopen: true,

            tagTitle:
              doc.tagTitle || "To Do",

            tagColor:
              doc.tagColor || "blue",

          },

        };


        setData((prev) => [
          ...prev,
          newDocument,
        ]);


        setIsModalOpen(false);

      })

      .catch((error) => {

        console.error(
          "Failed to create document:",
          error
        );

      });

  };


  // ==============================
  // DRAG CARD
  // ==============================

  const handleDragEnd = (
    id,
    newX,
    newY
  ) => {

    setData((prev) =>

      prev.map((doc) =>

        doc.id === id

          ? {
              ...doc,

              xPosition: newX,

              yPosition: newY,
            }

          : doc

      )

    );


    updateDocumentPosition(
      id,
      newX,
      newY
    )

      .catch((error) => {

        console.error(
          "Failed to save position:",
          error
        );

      });

  };


  // ==============================
  // DELETE CARD
  // ==============================

  const handleDelete = (id) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this task?"
      )
    ) {
      return;
    }


    deleteDocument(id)

      .then(() => {

        setData((prev) =>
          prev.filter(
            (doc) => doc.id !== id
          )
        );

        console.log(
          "Document deleted successfully"
        );

      })

      .catch((error) => {

        console.error(
          "Failed to delete document:",
          error
        );

      });

  };


  // ==============================
  // MARK COMPLETE
  // ==============================

  const handleComplete = (id) => {

    setData((prev) =>

      prev.map((doc) =>

        doc.id === id

          ? {

              ...doc,

              tag: {

                isopen: true,

                tagTitle:
                  "Completed",

                tagColor:
                  "green",

              },

            }

          : doc

      )

    );

  };


  return (

    <>

      {/* DOCUMENT AREA */}

      <div

        ref={ref}

        className="
          fixed
          inset-0
          z-[3]
          overflow-hidden
        "

        style={{
          background:
            "radial-gradient(circle at center, rgba(30,30,30,0) 0%, rgba(0,0,0,0.3) 100%)",
        }}

      >

        {data.map((item) => (

          <Cards

            key={item.id}

            id={item.id}

            x={item.xPosition}

            y={item.yPosition}

            data={item}

            reference={ref}

            onDragEnd={handleDragEnd}

            onDelete={handleDelete}

            onComplete={handleComplete}

          />

        ))}

      </div>


      {/* ADD BUTTON */}

      <motion.button

        whileHover={{
          scale: 1.08,
        }}

        whileTap={{
          scale: 0.92,
        }}

        onClick={() =>
          setIsModalOpen(true)
        }

        className="
          fixed
          bottom-8
          right-8
          z-[40]

          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-full

          bg-gradient-to-br
          from-blue-500
          to-blue-600

          shadow-lg
          shadow-blue-500/40

          text-white

          hover:from-blue-400
          hover:to-blue-500

          transition-colors
        "

      >

        <FaPlus className="text-[18px]" />

      </motion.button>


      {/* ADD CARD MODAL */}

      <AddCardModal

        isOpen={isModalOpen}

        onClose={() =>
          setIsModalOpen(false)
        }

        onSave={handleSaveCard}

      />

    </>

  );
}


export default Foreground;