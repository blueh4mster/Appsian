import { useState } from "react";
import API, { type Task } from "../services/api";
import { Modal, Button, Form } from "react-bootstrap";

interface AddTaskFormProps {
  projectId: string;
  existingTasks: Task[];
  onTaskAdded: (task: Task) => void;
}

const AddTaskForm = ({
  projectId,
  existingTasks,
  onTaskAdded,
}: AddTaskFormProps) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [estimatedHours, setEstimatedHours] = useState<number>(1);
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [dependency, setDependency] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: title,
      dueDate: dueDate,
      estimatedHours: estimatedHours,
      dependencies: dependencies,
      projectId: projectId,
      isCompleted: false,
    };

    try {
      const res = await API.post(`/projects/${projectId}/tasks`, payload);
      onTaskAdded(res.data);
      setTitle("");
      setDueDate(undefined);
      setEstimatedHours(1);
      setDependencies([]);
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };

  return (
    <div>
      <Button
        className="btn btn-pink float-end mb-2"
        onClick={() => setShow(true)}
        style={{ backgroundColor: "#ff4d6d", color: "#fff" }}
      >
        + Add Task
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#ffdee9' }}>
          <Modal.Title className="text-pink-700">Add New Task</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: '#ffe6f0' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estimated Hours</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dependency</Form.Label>
              <Form.Select
                value={dependency}
                onChange={(e) => setDependency(e.target.value)}
              >
                <option value="">No Dependency</option>
                {existingTasks.map((task) => (
                  <option key={task.id} value={task.title}>
                    {task.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: '#ffdee9' }}>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: "#ff4d6d", color: "#fff" }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddTaskForm;
