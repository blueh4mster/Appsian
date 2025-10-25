using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/projects/{projectId}/schedule")]
    public class ScheduleController : ControllerBase
    {
        private readonly ISchedulerService _schedulerService;

        public ScheduleController(ISchedulerService schedulerService)
        {
            _schedulerService = schedulerService;
        }

        [HttpPost]
        public IActionResult GenerateSchedule([FromBody] ScheduleRequestDTO request)
        {
            try
            {
                // Use today's date as project start for simplicity
                var result = _schedulerService.GenerateOptimalSchedule(request.Tasks, DateTime.Now);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
