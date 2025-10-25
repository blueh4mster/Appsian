using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _db;

        public TaskService(AppDbContext db)
        {
            _db = db;
        }

        public TaskItem AddTask(Guid userId, Guid projectId, string title, DateTime? dueDate, int estimatedHours, List<string> dependencies)
        {
            var project = _db.Projects.FirstOrDefault(p => p.Id == projectId && p.UserId == userId);
            if (project == null) throw new Exception("Project not found");

            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                Title = title,
                DueDate = dueDate,
                IsCompleted = false,
                EstimatedHours = estimatedHours, 
                Dependencies = dependencies
            };

            _db.Tasks.Add(task);
            _db.SaveChanges();
            return task;
        }

        public TaskItem UpdateTask(Guid userId, Guid taskId, bool isCompleted)
        {
            var task = _db.Tasks.Include(t => t.Project)
                .FirstOrDefault(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null) throw new Exception("Task not found");
            task.IsCompleted = isCompleted;

            _db.SaveChanges();
            return task;
        }

        public void DeleteTask(Guid userId, Guid taskId)
        {
            var task = _db.Tasks.Include(t => t.Project)
                .FirstOrDefault(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null) throw new Exception("Task not found");

            _db.Tasks.Remove(task);
            _db.SaveChanges();
        }

        public IEnumerable<TaskItem> GetTasks(Guid userId, Guid projectId)
        {
            var project = _db.Projects.Include(p => p.Tasks)
                .FirstOrDefault(p => p.Id == projectId && p.UserId == userId);

            if (project == null) throw new Exception("Project not found");

            return project.Tasks.OrderBy(t => t.IsCompleted).ThenBy(t => t.DueDate).ToList();
        }
    }
}
