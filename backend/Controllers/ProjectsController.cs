using System;
using System.Linq;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        [HttpPost]
        public IActionResult AddProject([FromBody] ProjectDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var project = _projectService.Create(GetUserId(), dto.Title, dto.Description);

            return Ok(new ProjectDTO
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreatedAt = project.CreatedAt
            });
        }

        [HttpGet]
        public IActionResult GetProjects()
        {
            var projects = _projectService.GetAll(GetUserId());

            var projectDtos = projects.Select(p => new ProjectDTO
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                CreatedAt = p.CreatedAt
            }).ToList();

            return Ok(projectDtos);
        }

        [HttpGet("{projectId}")]
        public IActionResult GetProject(Guid projectId)
        {
            var project = _projectService.GetById(GetUserId(), projectId);

            if (project == null) return NotFound();

            return Ok(new ProjectDTO
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreatedAt = project.CreatedAt
            });
        }

        [HttpDelete("{projectId}")]
        public IActionResult DeleteProject(Guid projectId)
        {
            _projectService.Delete(GetUserId(), projectId);
            return NoContent();
        }
    }
}