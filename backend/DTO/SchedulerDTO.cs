namespace Backend.DTOs
{
    public class TaskScheduleDTO
    {
        public string Title { get; set; }
        public int EstimatedHours { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string> Dependencies { get; set; } = new();
    }

    public class ScheduleRequestDTO
    {
        public List<TaskScheduleDTO> Tasks { get; set; } = new();
    }

    public class ScheduledTaskDTO
    {
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class ScheduleResponseDTO
    {
        public List<ScheduledTaskDTO> ScheduledTasks { get; set; } = new();
    }
}
