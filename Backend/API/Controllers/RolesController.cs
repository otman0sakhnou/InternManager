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
    }
}
