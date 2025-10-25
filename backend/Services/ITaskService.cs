using System;
using System.Collections.Generic;
using Backend.Models;

namespace Backend.Services
{
    public interface ITaskService
    {
        TaskItem AddTask(Guid userId, Guid projectId, string title, DateTime? dueDate, int estimatedHours, List<string> dependencies);
        TaskItem UpdateTask(Guid userId, Guid taskId, bool isCompleted);
        void DeleteTask(Guid userId, Guid taskId);
        IEnumerable<TaskItem> GetTasks(Guid userId, Guid projectId);
    }
}
