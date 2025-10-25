using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/projects/{projectId}/schedule")]
    public class SchedulerController : ControllerBase
    {
        private readonly SchedulerService _schedulerService;

        public SchedulerController(SchedulerService schedulerService)
        {
            _schedulerService = schedulerService;
        }

        [HttpPost]
        public IActionResult GenerateSchedule(Guid projectId, [FromBody] List<TaskDTO> tasks)
        {
            try
            {
                var result = _schedulerService.GenerateSchedule(tasks);
                return Ok(new
                {
                    recommendedOrder = result,
                    message = "Schedule generated successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
