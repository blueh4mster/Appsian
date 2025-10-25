using Backend.DTOs;

namespace Backend.Services
{
    public interface ISchedulerService
    {
        ScheduleResponseDTO GenerateOptimalSchedule(List<TaskScheduleDTO> tasks, DateTime projectStart);
    }
}