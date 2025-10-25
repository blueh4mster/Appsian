export interface TaskScheduleDTO {
    title: string;
    estimatedHours: number;
    dueDate?: string;
    dependencies: string[];
  }
  
  export interface ScheduleRequestDTO {
    tasks: TaskScheduleDTO[];
  }
  
  export interface ScheduledTaskDTO {
    title: string;
    startDate: string;
    endDate: string;
  }
  
  export interface ScheduleResponseDTO {
    scheduledTasks: ScheduledTaskDTO[];
  }