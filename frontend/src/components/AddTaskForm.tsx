import { useState, type ChangeEvent, type FormEvent } from "react";
import API, { type AddTaskRequest } from "../services/api";

interface AddTaskFormProps {
  projectId: string;
  onTaskAdded: () => void;
}

export default function AddTaskForm({ projectId, onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const payload: AddTaskRequest = { title };
    try {
      await API.post(`/projects/${projectId}/tasks`, payload);
      setTitle("");
      onTaskAdded();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mb-3">
      <input
        type="text"
        placeholder="New Task"
        value={title}
        onChange={handleChange}
        className="form-control me-2"
      />
      <button className="btn" style={{ backgroundColor: "#ff4d6d", color: "#fff" }}>
        Add
      </button>
    </form>
  );
}
