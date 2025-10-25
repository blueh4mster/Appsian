import { useEffect, useState } from "react";
import API, {type Project } from "../services/api";
import TaskList from "./TaskList";
export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTitle, setNewTitle] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await API.get<Project[]>("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addProject = async () => {
    if (!newTitle) return;
    try {
      await API.post("/projects", { title: newTitle, description: "" });
      setNewTitle("");
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4" style={{ color: "#e75480" }}>My Projects</h2>
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="New Project Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="form-control me-2"
        />
        <button className="btn" style={{ backgroundColor: "#ff4d6d", color: "#fff" }} onClick={addProject}>
          Add Project
        </button>
      </div>
      {projects.map((project) => (
        <div key={project.id} className="card mb-3 shadow-sm" style={{ backgroundColor: "#fff0f6" }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5 style={{ color: "#e75480" }}>{project.title}</h5>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProject(project.id)}>Delete Project</button>
            </div>
            <TaskList projectId={project.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
