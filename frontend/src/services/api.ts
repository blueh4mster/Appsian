import axios from "axios";

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate?: string; 
  isCompleted: boolean;
  projectId?: string;
  estimatedHours?: number;
  dependencies?: string[];
}

export interface AddTaskRequest {
  title: string;
}

const API = axios.create({
  baseURL: "https://appsian-2.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
