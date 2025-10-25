import React, { useState } from "react";
import API, { type Task } from "../services/api";

const SchedulerUI: React.FC = () => {
  const [taskCount, setTaskCount] = useState<number | null>(null);
  const [projectid, setProjectid] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [dependency, setDependency] = useState("");

  const handleTaskCountSubmit = () => {
    if (!taskCount || taskCount <= 0) return;
    setTasks(Array.from({ length: taskCount }, () => ({
        id: "",
        projectId:"",
        isCompleted:false,
      title: "",
      estimatedHours: 1,
      dueDate: "",
      dependencies: []
    })));
  };

  const handleChange = (index: number, field: keyof Task, value: any) => {
    const updated = [...tasks];
    (updated[index] as any)[field] = value;
    setTasks(updated);
  };

  const handleDependencyChange = (index: number, depTitle: string) => {
    const updated = [...tasks];
    const deps = new Set(updated[index].dependencies);
    if (deps.has(depTitle)) deps.delete(depTitle);
    else deps.add(depTitle);
    updated[index].dependencies = Array.from(deps);
    setTasks(updated);
  };

  const handleSubmitAll = async () => {
    setLoading(true);
    try {
      const res = await API.post(`projects/${projectid}/schedule` ,{tasks})
      setSchedule(res.data);
    } catch (err) {
      console.error(err);
      alert("Error generating schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Poppins, sans-serif", color: "#333" }}>
      <h2 style={{ color: "#ff4d6d", textAlign: "center" }}>🩷 Task Scheduler</h2>

      {!tasks.length && (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <input
            type="number"
            placeholder="Number of tasks"
            value={taskCount ?? ""}
            onChange={(e) => setTaskCount(parseInt(e.target.value))}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ffb3c6",
              width: "160px",
              marginRight: "10px"
            }}
          />
          <input
            type="string"
            placeholder="Project-Id"
            value={projectid ?? ""}
            onChange={(e) => setProjectid(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ffb3c6",
              width: "160px",
              marginRight: "10px"
            }}
          />
          
          <button
            onClick={handleTaskCountSubmit}
            style={{
              backgroundColor: "#ff80a8",
              border: "none",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer"
            }}
          >
            Next
          </button>
        </div>
      )}

      {tasks.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          {tasks.map((task, i) => (
            <div
              key={i}
              style={{
                background: "#ffe6f0",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "10px"
              }}
            >
              <h4 style={{ color: "#ff4d6d" }}>Task {i + 1}</h4>
              <input
                type="text"
                placeholder="Title"
                value={task.title}
                onChange={(e) => handleChange(i, "title", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ffb3c6"
                }}
              />
              <input
                type="number"
                placeholder="Estimated Hours"
                value={task.estimatedHours}
                onChange={(e) => handleChange(i, "estimatedHours", parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ffb3c6"
                }}
              />
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => handleChange(i, "dueDate", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ffb3c6"
                }}
              />

                <select
                value={dependency}
                onChange={e => {
                    const selected = e.target.value; 
                    setDependency(selected); 
                    handleChange(i, "dependencies", selected ? [selected] : []);
                }}
                style={{
                    padding: "6px",
                    borderRadius: "8px",
                    border: "1px solid #ff4d6d",
                    backgroundColor: "#fff0f5",
                    color: "#ff4d6d",
                    width: "150px",
                    cursor: "pointer"
                }}
                >
                <option value="">Select dependency</option> {/* placeholder */}
                {tasks
                    .filter((_, j) => j !== i)
                    .map((t, j) => (
                    <option key={j} value={t.title}>
                        {t.title || `Task ${j + 1}`}
                    </option>
                    ))}
                </select>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={handleSubmitAll}
              disabled={loading}
              style={{
                backgroundColor: "#ff4d6d",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {loading ? "Generating..." : "Generate Schedule"}
            </button>
          </div>
        </div>
      )}

      {schedule.length > 0 && (
        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#fff0f5",
          borderRadius: "10px"
        }}>
          <h3 style={{ color: "#ff4d6d" }}>📅 Recommended Task Order</h3>
          <ol style={{ paddingLeft: "20px" }}>
            {schedule.map((t, i) => (
              <li key={i} style={{ marginBottom: "4px", color: "#333" }}>
                <strong>{t.title}</strong> — {t.dueDate ? `Due: ${new Date(t.dueDate).toLocaleDateString()}` : "No due date"}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default SchedulerUI;
