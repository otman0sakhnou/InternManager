using Application.Services.PriodService.Commands;
using Application.Services.PriodService.Queries;
using AutoMapper;
using Domain.DTOs.Periods;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Period
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeriodController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public PeriodController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePeriod([FromBody] CreatePeriodCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var periodId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetPeriodById), new { id = periodId }, null);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePeriod([FromBody] UpdatePeriodCommand command)
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
        public async Task<IActionResult> DeletePeriod(Guid id)
        {
            var command = new DeletePeriodCommand { Id = id };
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPeriodById(Guid id)
        {
            var query = new GetPeriodByIdQuery { Id = id };
            var period = await _mediator.Send(query);
            if (period == null)
            {
                return NotFound();
            }

            var periodDto = _mapper.Map<PeriodDto>(period);
            return Ok(periodDto);
        }

        [HttpGet("intern/{internId}")]
        public async Task<IActionResult> GetPeriodsByInternId(Guid internId)
        {
            var query = new GetPeriodsByInternIdQuery { InternId = internId };
            var periods = await _mediator.Send(query);
            var periodDtos = _mapper.Map<IEnumerable<PeriodDto>>(periods);
            return Ok(periodDtos);
        }

     
    }
}
