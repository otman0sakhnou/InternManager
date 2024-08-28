using Application.Services.AuthenticationAndAuthorization.Commands;
using Application.Services.AuthenticationAndAuthorization.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RolesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _mediator.Send(command);
            if (result.Success)
            {
                return Ok(result.Message);
            }
            return BadRequest(result.Errors);
        }

        [HttpGet("get-roles/{userId}")]
        public async Task<IActionResult> GetRoles(string userId)
        {
            var query = new GetRolesQuery(userId);
            var result = await _mediator.Send(query);

            if (result.Success)
            {
                return Ok(result.Roles);
            }
            return NotFound(result.Errors);
        }

        // GET: api/roles/collaborators/{collaboratorId}
        [HttpGet("collaborators/{collaboratorId}")]
        public async Task<IActionResult> GetRolesByCollaboratorId(Guid collaboratorId)
        {
            try
            {
                var result = await _mediator.Send(new GetRoleByCollaboratorIdQuery(collaboratorId));

                if (result == null)
                {
                    return NotFound("No roles found for the given collaborator ID.");
                }

                return Ok(result.Roles);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/roles/interns/{internId}
        [HttpGet("interns/{internId}")]
        public async Task<IActionResult> GetRolesByInternId(Guid internId)
        {
            try
            {
                var result = await _mediator.Send(new GetRoleByInernIdQuery(internId));

                if (result == null)
                {
                    return NotFound("No roles found for the given intern ID.");
                }

                return Ok(result.Roles);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
