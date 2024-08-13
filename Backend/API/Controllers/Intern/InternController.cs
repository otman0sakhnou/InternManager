using Application.Services.InternService.Commands;
using Application.Services.InternService.Queries;
using Domain.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

using MediatR;


namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InternController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public InternController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateIntern([FromBody] CreateInternCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var internId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetInternById), new { id = internId }, null);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateIntern([FromBody] UpdateInternCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _mediator.Send(command);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIntern(Guid id)
        {
            var command = new DeleteInternCommand { Id = id };
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInternById(Guid id)
        {
            var query = new GetInternByIdQuery { Id = id };
            var intern = await _mediator.Send(query);
            if (intern == null)
            {
                return NotFound();
            }

            var internDto = _mapper.Map<InternDto>(intern);
            return Ok(internDto);
        }
        [HttpDelete("all")]
        public async Task<IActionResult> DeleteAllInterns()
        {
            var command = new DeleteAllInternsCommand();
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllInterns()
        {
            var query = new GetAllInternsQuery();
            var interns = await _mediator.Send(query);
            var internDtos = _mapper.Map<IEnumerable<InternDto>>(interns);
            return Ok(internDtos);
        }
    }
}
