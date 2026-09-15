import React, { useRef, useState } from "react";
import Cards from "./Cards";
import AddMenu from "./AddMenu";
import AddProjectModal from "./AddProjectModal";
import AddCardModal from "./AddCardModal";
import AddWorkspaceModal from "./AddWorkspaceModal";
import { createDocument } from "../api/documentApi";
import { createWorkspace } from "../api/workspaceApi";
import { createProject } from "../api/projectApi";

function Foreground({
  user,
  workspaces,
  projects,
  activeProjectId,
  onWorkspaceCreated,
  onProjectCreated,
  onTaskCreated,
}) {
  const ref = useRef(null);
  const [activeModal, setActiveModal] = useState(null);
  const [data, setData] = useState([]);

  const handleCreateWorkspace = (payload) =>
    createWorkspace(payload)
      .then((res) => {
        onWorkspaceCreated?.(res.data);   // tell Documents to refresh
        setActiveModal(null);
      })
      .catch((err) => console.error("Failed to create workspace:", err));

  const handleCreateProject = ({ name, workspaceId }) =>
    createProject({ name, workspaceId })
      .then((res) => {
        onProjectCreated?.(res.data);
        setActiveModal(null);
      })
      .catch((err) => console.error("Failed to create project:", err));

  const handleSaveCard = (newCard) =>
    createDocument({ ...newCard, userId: user?.userId })
      .then((res) => {
        setData((prev) => [...prev, res.data]);
        onTaskCreated?.(res.data);
        setActiveModal(null);
      })
      .catch((err) => console.error("Failed to create document:", err));

  const handleDragEnd = (id, x, y) =>
    setData((prev) => prev.map((d) => (d.id === id ? { ...d, xPosition: x, yPosition: y } : d)));

  const handleDelete = (id) => setData((prev) => prev.filter((d) => d.id !== id));

  const handleComplete = (id) =>
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, tag: { ...d.tag, tagTitle: "Done", tagColor: "green" } } : d))
    );

  return (
    <>
      {/* only mounted when there are cards, and never blocks clicks */}
      {data.length > 0 && (
        <div ref={ref} className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
          {data.map((item) => (
            <div key={item.id} className="pointer-events-auto">
              <Cards
                id={item.id}
                x={item.xPosition}
                y={item.yPosition}
                data={item}
                reference={ref}
                onDragEnd={handleDragEnd}
                onDelete={handleDelete}
                onComplete={handleComplete}
              />
            </div>
          ))}
        </div>
      )}

      <AddMenu onSelect={setActiveModal} />

      {/* AddWorkspace (the inline form) removed — it was rendering unconditionally */}
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
        defaultProjectId={activeProjectId}
      />
    </>
  );
}

export default Foreground;