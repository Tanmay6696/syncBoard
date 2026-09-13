import React, { useRef, useState, useEffect } from "react";
import Cards from "./Cards";
import AddMenu from "./AddMenu";
import AddWorkspace from "./AddWorkspace";
import AddProjectModal from "./AddProjectModal";
import AddCardModal from "./AddCardModal";
import AddWorkspaceModal from "./AddWorkspaceModal";
import { getDocuments, createDocument, updateDocumentPosition, deleteDocument } from "../api/documentApi";
import { getWorkspaces, createWorkspace } from "../api/workspaceApi";
import { getProjects, createProject } from "../api/projectApi";
function mapDoc(doc) {
  return {
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
      tagTitle: doc.tagTitle || "To Do",
      tagColor: doc.tagColor || "blue",
    },
  };
}
function Foreground({ user }) {
  const ref = useRef(null);
  const [activeModal, setActiveModal] = useState(null); // 'workspace' | 'project' | 'task' | null
  const [data, setData] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  console.log("Active Modal:  ", activeModal, "user: ", user);

  useEffect(() => {
    // console.log("Foreground user:", user);
    // if () return;

    // getDocuments(user.userId).then((res) => setData(res.data.map(mapDoc)));
    // getWorkspaces(user.userId).then((res) => setWorkspaces(res.data));
    // getProjects(user.userId).then((res) => setProjects(res.data));
    // getDocuments().then((res) => setData(res.data.map(mapDoc)));
    getWorkspaces().then((res) => setWorkspaces(res.data));
    getProjects().then((res) => setProjects(res.data));
  }, []);

  const handleCreateWorkspace = (payload) => {
    createWorkspace(payload)
      .then((res) => {
        setWorkspaces((prev) => [...prev, res.data]);
        setActiveModal(null);
      })
      .catch((err) => console.error("Failed to create workspace:", err));
  };

  const handleCreateProject = ({ name, workspaceId }) => {
    createProject({ name, workspaceId })
      .then((res) => {
        setProjects((prev) => [...prev, res.data]);
        setActiveModal(null);
      })
      .catch((err) => console.error("Failed to create project:", err));
  };

  const handleSaveCard = (newCard) => {
    // unchanged, just now newCard.projectId is populated
    const documentData = { ...newCard, userId: user.userId };
    createDocument(documentData)
      .then((response) => {
        setData((prev) => [...prev, mapDoc(response.data)]);
        setActiveModal(null);
      })
      .catch((error) => console.error("Failed to create document:", error));
  };

  // handleDragEnd, handleDelete, handleComplete — unchanged

  return (
    <>
      <div ref={ref} className="fixed inset-0 z-[3] overflow-hidden" style={{ background: "radial-gradient(circle at center, rgba(30,30,30,0) 0%, rgba(0,0,0,0.3) 100%)" }}>
        {data.map((item) => (
          <Cards key={item.id} id={item.id} x={item.xPosition} y={item.yPosition} data={item} reference={ref}
            onDragEnd={handleDragEnd} onDelete={handleDelete} onComplete={handleComplete} />
        ))}
      </div>

      <AddMenu onSelect={setActiveModal} />

      <AddWorkspace
        isOpen={activeModal === "workspace"}
        onClose={() => setActiveModal(null)}
        onSave={handleCreateWorkspace}
      />
      <AddWorkspaceModal
        isOpen={activeModal === "workspace"}
        onClose={() => setActiveModal(null)}
        onSave={handleCreateWorkspace}
      />
      <AddProjectModal
        isOpen={activeModal === "project"}
        onClose={() => setActiveModal(null)}
        onSave={handleCreateProject}
        workspaces={workspaces}
      />

      <AddCardModal
        isOpen={activeModal === "task"}
        onClose={() => setActiveModal(null)}
        onSave={handleSaveCard}
        projects={projects}
      />
    </>
  );
}

export default Foreground;