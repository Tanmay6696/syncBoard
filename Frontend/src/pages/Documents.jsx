import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkspaces } from "../api/workspaceApi";
import { getProjectsByWorkspace } from "../api/projectApi";
import { getTasks } from "../api/taskApi";
import MembersPanel from "../components/MembersPanel";
import Foreground from "../components/foreground";

export default function Documents({ user, setUser }) {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkspaces = useCallback((selectId) => {
    return getWorkspaces()
      .then(({ data }) => {
        setWorkspaces(data);
        setWorkspaceId((cur) => selectId ?? cur ?? (data[0]?.id ?? null));
      })
      .catch((err) =>
        setError(err.response?.data?.error || "Failed to load workspaces")
      );
  }, []);

  useEffect(() => {
    loadWorkspaces().finally(() => setLoading(false));
  }, [loadWorkspaces]);

  const loadProjects = useCallback((wsId, selectId) => {
    if (!wsId) {
      setProjects([]);
      setProjectId(null);
      return;
    }
    return getProjectsByWorkspace(wsId).then(({ data }) => {
      setProjects(data);
      setProjectId((cur) =>
        selectId ?? (data.some((p) => p.id === cur) ? cur : data[0]?.id ?? null)
      );
    });
  }, []);

  useEffect(() => {
    loadProjects(workspaceId);
  }, [workspaceId, loadProjects]);

  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      return;
    }
    let alive = true;
    getTasks(projectId).then(({ data }) => alive && setTasks(data));
    return () => {
      alive = false;
    };
  }, [projectId]);

  const activeWorkspace = workspaces.find((w) => w.id === workspaceId);
  const activeProject = projects.find((p) => p.id === projectId);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (loading) return <div className="p-10 text-zinc-400">Loading…</div>;
  if (error) return <div className="p-10 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen w-full bg-zinc-950">
      <Foreground
        user={user}
        workspaces={workspaces}
        projects={projects}
        activeProjectId={projectId}
        onWorkspaceCreated={(ws) => loadWorkspaces(ws.id)}
        onProjectCreated={(p) => loadProjects(workspaceId, p.id)}
        onTaskCreated={() =>
          projectId && getTasks(projectId).then(({ data }) => setTasks(data))
        }
      />

      <header
        className="sticky top-0 z-[20] flex w-full items-center justify-between
                   gap-4 border-b border-white/5 bg-zinc-950/80 px-8 py-4 backdrop-blur"
      >
        <h1 className="text-lg font-semibold text-white">Documents</h1>
        <button
          onClick={handleLogout}
          className="shrink-0 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold
                     text-white shadow-lg shadow-red-500/20 transition
                     hover:bg-red-600 active:scale-95"
        >
          Logout
        </button>
      </header>

      <main className="relative z-[10] mx-auto w-full max-w-7xl space-y-6 px-8 py-8">
        {/* Workspaces */}
        <section>
          <h2 className="text-3xl font-bold text-white">Workspaces</h2>
          <p className="text-sm text-zinc-400">
            Select a workspace to view its projects
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {workspaces.length === 0 && (
              <p className="text-zinc-500">
                No workspaces yet — create one to get started.
              </p>
            )}
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setWorkspaceId(ws.id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  ws.id === workspaceId
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 bg-zinc-900 hover:border-white/20"
                }`}
              >
                <h3 className="font-semibold text-white">{ws.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{ws.description}</p>
                <span className="mt-4 block text-xs text-zinc-500">
                  {ws.projectCount ?? 0} Projects
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Projects */}
        {activeWorkspace && (
          <section className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white">
              {activeWorkspace.name}
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {projects.length === 0 && (
                <p className="text-zinc-500">No projects in this workspace.</p>
              )}
              {projects.map((p) => (
                <>
                <button
                  key={p.id}
                  onClick={() => setProjectId(p.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    p.id === projectId
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-zinc-900 hover:border-white/20"
                  }`}
                >
                  <h3 className="font-semibold text-white">{p.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{p.description}</p>
                  <span className="mt-4 block text-xs text-zinc-500">
                    {p.taskCount ?? 0} Tasks
                  </span>
                </button>
                <MembersPanel projectId={p.id} />
                </>
              ))}
            </div>
          </section>
        )}

        {/* Tasks */}
        {activeProject && (
          <section className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white">
              {activeProject.name}
            </h2>

            <table className="mt-5 w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="pb-3">Task</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Assignee</th>
                  <th className="pb-3">Due Date</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {tasks.map((t) => (
                  <tr key={t.id} className="border-t border-white/5">
                    <td className="py-3 text-white">{t.title}</td>
                    <td className="py-3">{t.status}</td>
                    <td className="py-3">{t.priority}</td>
                    <td className="py-3">{t.assigneeName || "—"}</td>
                    <td className="py-3">{t.dueDate || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {tasks.length === 0 && (
              <p className="mt-4 text-zinc-500">No tasks yet in this project.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}