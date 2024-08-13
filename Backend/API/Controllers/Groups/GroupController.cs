using Application.Services.GroupService.Commands;
using Application.Services.GroupService.Queries;
using AutoMapper;
using Domain.DTOs.Groups;
using Domain.DTOs.Periods;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Groups
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public GroupController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Group>> GetById(Guid id)
        {
            var group = await _mediator.Send(new GetGroupByIdQuery(id));
            if (group == null)
            {
                return NotFound();
            }
            var groupDtos = _mapper.Map<IEnumerable<GroupDto>>(group);
            return Ok(groupDtos);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Group>>> GetAll()
        {
            var groups = await _mediator.Send(new GetAllGroupsQuery());
            var groupDtos = _mapper.Map<IEnumerable<GroupDto>>(groups);
            return Ok(groupDtos);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateGroupCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] UpdateGroupCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            var result = await _mediator.Send(command);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var result = await _mediator.Send(new DeleteGroupCommand(id));
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
