import axios, { type AxiosResponse } from "axios";
import { type ScheduleRequestDTO, type ScheduleResponseDTO } from "../types";

// Response types
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
  isCompleted: boolean;
  projectId?: string;
}

export interface AddTaskRequest {
  title: string;
}

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const generateSchedule = async (
  projectId: string,
  payload: ScheduleRequestDTO
): Promise<ScheduleResponseDTO> => {
  const { data } = await API.post(`/projects/${projectId}/schedule`, payload);
  return data;
};

export default API;
