import { useEffect, useState } from "react";
import API, { type Task } from "../services/api";
import AddTaskForm from "./AddTaskForm";

interface TaskListProps {
  projectId: string;
}

export default function TaskList({ projectId }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [schedule, setSchedule] = useState<string[]>([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get<Task[]>(`/projects/${projectId}/tasks`);
      console.log(res.data);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Automatically calculate schedule whenever tasks change
    async function generateSchedule() {
      if (tasks.length === 0) return;
      const payload: Task[] = tasks.map(t => ({
        id:t.id,
        title: t.title,
        estimatedHours: t.estimatedHours || 1,
        dueDate: t.dueDate,
        dependencies: t.dependencies || [],
        isCompleted: t.isCompleted || false,
        projectId:projectId
      }));
      const res = await API.post(`/projects/${projectId}/schedule`, payload);
      setSchedule(res.data.recommendedOrder);
    }
    generateSchedule();
  }, [tasks]);

  const toggleTask = async (taskId: string, isCompleted: boolean) => {
    try {
        console.log(isCompleted);
      await API.put(`/tasks/${taskId}`, { isCompleted: !isCompleted });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <div className="mt-3">
      <AddTaskForm projectId={projectId} onTaskAdded={fetchTasks} />
      {tasks.map((task) => (
        <div key={task.id} className="d-flex justify-content-between align-items-center mb-2 p-2 rounded" style={{ backgroundColor: "#ffe6f0" }}>
          <div>
            <span className={`badge me-2 ${task.isCompleted ? "bg-success" : "bg-warning"}`} style={{ backgroundColor: task.isCompleted ? "#ff4d6d" : "#ffb3c6", color: "#fff" }}>
              {task.isCompleted ? "Done" : "Active"}
            </span>
            {task.title}
          </div>
          <div>
            <button className="btn btn-sm btn-outline-dark me-2" onClick={() => toggleTask(task.id, task.isCompleted)}>Toggle</button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
    <div className="p-4 bg-pink-50 rounded-lg">
  <h2 className="text-lg font-bold text-pink-600 mb-2">Recommended Task Order</h2>
  <ol className="list-decimal list-inside space-y-1">
    {schedule.map((taskTitle, i) => (
      <li key={i} className="text-pink-700">{taskTitle}</li>
    ))}
  </ol>
</div>
    </>
  );
}
