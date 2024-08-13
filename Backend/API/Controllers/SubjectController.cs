using Application.Services.Subjects.Commands;
using Application.Services.Subjects.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SubjectController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SubjectController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSubjects()
        {
            try
            {
                var subjects = await _mediator.Send(new GetAllSubjectsQuery());

                if (subjects == null || !subjects.Any())
                {
                    return NotFound("No subjects found.");
                }

                return Ok(subjects);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubjectById(Guid id)
        {
            var subject = await _mediator.Send(new GetSubjectByIdQuery(id));
            if (subject == null)
            {
                return NotFound();
            }

            return Ok(subject);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSubject(CreateSubjectCommand command)
        {
            var subjectId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetSubjectByIdQuery), new { id = subjectId }, subjectId);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubject(Guid id, UpdateSubjectCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("Subject ID mismatch");
            }

            await _mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(Guid id)
        {
            await _mediator.Send(new DeleteSubjectCommand(id));
            return NoContent();
        }
    }
}
