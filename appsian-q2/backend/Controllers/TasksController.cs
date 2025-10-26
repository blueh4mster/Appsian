using System;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        [HttpPost("projects/{projectId}/tasks")]
        public IActionResult AddTask(Guid projectId, [FromBody] TaskDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = _taskService.AddTask(
                GetUserId(),
                projectId,
                dto.Title,
                dto.DueDate,
                dto.EstimatedHours,
                dto.Dependencies
            );

            // Return task DTO without parent project reference to avoid cycles
            return Ok(new TaskDTO
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId,
                EstimatedHours = task.EstimatedHours,
                Dependencies = task.Dependencies
            });
        }

        [HttpPut("tasks/{taskId}")]
        public IActionResult UpdateTask(Guid taskId, [FromBody] UpdateTaskStatusDTO dto)
        {
            var task = _taskService.UpdateTask(
                GetUserId(),
                taskId,
                dto.IsCompleted
            );

            return Ok(new TaskDTO
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId,
                EstimatedHours = task.EstimatedHours,
                Dependencies = task.Dependencies
            });
        }

        [HttpDelete("tasks/{taskId}")]
        public IActionResult DeleteTask(Guid taskId)
        {
            _taskService.DeleteTask(GetUserId(), taskId);
            return NoContent();
        }

        [HttpGet("projects/{projectId}/tasks")]
        public IActionResult GetTasksForProject(Guid projectId)
        {
            var tasks = _taskService.GetTasks(GetUserId(), projectId);

            var taskDtos = tasks.Select(t => new TaskDTO
            {
                Id = t.Id,
                Title = t.Title,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                ProjectId = t.ProjectId,
                EstimatedHours = t.EstimatedHours,
                Dependencies = t.Dependencies
            }).ToList();

            return Ok(taskDtos);
        }
    }
}
