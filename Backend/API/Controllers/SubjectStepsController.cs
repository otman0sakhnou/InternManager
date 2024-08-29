using Application.Services.InternSteps.Commands;
using Application.Services.InternSteps.Queries;
using Application.Services.ProgressTracking.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectStepsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SubjectStepsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("intern/{internId}")]
        public async Task<IActionResult> GetSubjectForIntern(Guid internId)
        {
            var query = new GetSubjectForInternQuery(internId);
            var result = await _mediator.Send(query);

            return Ok(result);
        }

        [HttpGet("group/{subjectId}")]
        public async Task<IActionResult> GetSubjectForGroup(Guid subjectId, [FromQuery] Guid groupId)
        {
            var query = new GetGroupsProgressQuery(groupId, subjectId);
            var result = await _mediator.Send(query);

            return Ok(result);
        }

        [HttpPost("validate-step")]
        public async Task<IActionResult> ValidateStep([FromBody] UpdateStepValidationCommand command)
        {
            await _mediator.Send(command);

            return NoContent();
        }
    }
}
