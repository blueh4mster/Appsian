// ScheduleForm.tsx
import React, { useState } from "react";
import {type  TaskScheduleDTO, type ScheduleResponseDTO } from "../types";
import { generateSchedule } from "../services/api";

interface Props {
  projectId: string;
}

const ScheduleForm: React.FC<Props> = ({ projectId }) => {
  const [tasks, setTasks] = useState<TaskScheduleDTO[]>([
    { title: "", estimatedHours: 1, dueDate: "", dependencies: [] },
  ]);
  const [schedule, setSchedule] = useState<ScheduleResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, field: keyof TaskScheduleDTO, value: any) => {
    const updated = [...tasks];
    (updated[index] as any)[field] = value;
    setTasks(updated);
  };

  const addTask = () => {
    setTasks([...tasks, { title: "", estimatedHours: 1, dueDate: "", dependencies: [] }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await generateSchedule(projectId, { tasks });
      setSchedule(response);
    } catch (err) {
      alert("Error generating schedule");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">Task Scheduler</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className="border p-3 rounded-md space-y-2">
            <input
              type="text"
              placeholder="Title"
              value={task.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-pink-500"
              required
            />
            <input
              type="number"
              placeholder="Estimated Hours"
              value={task.estimatedHours}
              onChange={(e) => handleChange(index, "estimatedHours", parseInt(e.target.value))}
              className="w-full p-2 border rounded-md focus:outline-pink-500"
              min={1}
              required
            />
            <input
              type="date"
              placeholder="Due Date"
              value={task.dueDate?.split("T")[0] || ""}
              onChange={(e) => handleChange(index, "dueDate", e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-pink-500"
            />
            <input
              type="text"
              placeholder="Dependencies (comma separated)"
              value={task.dependencies.join(", ")}
              onChange={(e) => handleChange(index, "dependencies", e.target.value.split(",").map(s => s.trim()))}
              className="w-full p-2 border rounded-md focus:outline-pink-500"
            />
          </div>
        ))}
        <button type="button" onClick={addTask} className="w-full bg-pink-500 text-white py-2 rounded-md">
          + Add Task
        </button>
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded-md mt-2"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Schedule"}
        </button>
      </form>

      {schedule && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-pink-600 mb-2">Recommended Schedule</h3>
          <ul className="space-y-2">
            {schedule.scheduledTasks.map((t, i) => (
              <li key={i} className="p-2 border rounded-md bg-pink-50">
                <strong>{t.title}</strong>: {new Date(t.startDate).toLocaleString()} - {new Date(t.endDate).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleForm;
