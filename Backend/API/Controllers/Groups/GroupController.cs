using Application.Services.GroupService.Commands;
using Application.Services.GroupService.Queries;
using AutoMapper;
using Domain.DTOs.Groups;
using Domain.DTOs.Periods;
using Domain.Models;
using FluentValidation;
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
        private readonly IValidator<CreateGroupCommand> _createValidator;
        private readonly IValidator<UpdateGroupCommand> _updateValidator;
        public GroupController(IMediator mediator, IMapper mapper, IValidator<CreateGroupCommand> createValidator,
                               IValidator<UpdateGroupCommand> updateValidator)
        {
            _mediator = mediator;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Group>> GetById(Guid id)
        {
            var group = await _mediator.Send(new GetGroupByIdQuery(id));
            if (group == null)
            {
                return NotFound();
            }
            var groupDto = _mapper.Map<GroupDto>(group);
            return Ok(groupDto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Group>>> GetAll()
        {
            var groups = await _mediator.Send(new GetAllGroupsQuery());
            var groupDtos = _mapper.Map<IEnumerable<GroupDto>>(groups);
            return Ok(groupDtos);
        }
        [HttpDelete("{groupId}/interns/{internId}")]
        public async Task<ActionResult> RemoveInternFromGroup(Guid groupId, Guid internId)
        {
            var result = await _mediator.Send(new RemoveInternFromGroupCommand
            {
                GroupId = groupId,
                InternId = internId
            });

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateGroupCommand command)
        {
            var validationResult = await _createValidator.ValidateAsync(command);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] UpdateGroupCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("Mismatched Group ID");
            }

            var validationResult = await _updateValidator.ValidateAsync(command);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
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
