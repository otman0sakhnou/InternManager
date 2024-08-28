using Application.Services.AuthenticationAndAuthorization.Queries;
using Application.Services.Collaborator.Commands;
using Application.Services.Collaborator.Queries;
using Domain.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollaboratorController(IMediator mediator) : ControllerBase
    {
        private readonly IMediator _mediator = mediator;
        // GET: api/Collaborator
        [HttpGet]
        public async Task<IActionResult> GetAllCollaborators()
        {
            var query = new GetAllCollaboratorsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCollaboratorById(Guid id)
        {
            var query = new GetCollaboratorByIdQuery(id);
            var result = await _mediator.Send(query);

            if (result == null)
            {
                return NotFound("Collaborator not found.");
            }

            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> AddCollaborator([FromBody] CollaboratorReq collaboratorReq)
        {
            if (collaboratorReq == null)
            {
                return BadRequest("Collaborator request cannot be null.");
            }

            var command = new AddCollaboratorCommand(collaboratorReq);
            var result = await _mediator.Send(command);

            return CreatedAtAction(nameof(GetCollaboratorById), new { id = result }, result);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCollaborator(Guid id, [FromBody] CollaboratorReq collaboratorReq)
        {
            if (id != collaboratorReq.Id)
            {
                return BadRequest("Invalid collaborator data.");
            }

            var command = new UpdateCollaboratorCommand(collaboratorReq);
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound("Collaborator not found.");
            }

            return NoContent();
        }

        // DELETE: api/Collaborator/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCollaborator(Guid id)
        {
            var command = new DeleteCollaboratorCommand(id);
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound("Collaborator not found.");
            }

            return NoContent();
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCollaboratorIdByUserId(Guid userId)
        {
            try
            {
                var result = await _mediator.Send(new GetCollaboratorIdByUserIdQuery(userId));

                if (result == null)
                {
                    return NotFound("No collaborator found for the given user ID.");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
