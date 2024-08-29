using Application.Repositories;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.InternSteps
{
    public record InternStepDto(Guid InternId, Guid StepId, bool Status);
    public record CreateInternStepsCommand(Guid SubjectId, ICollection<InternStepDto> InternSteps) : IRequest<Unit>;

    public class CreateInternStepsCommandHandler : IRequestHandler<CreateInternStepsCommand, Unit>
    {
        private readonly IInternStepRepository _internStepRepository;

        public CreateInternStepsCommandHandler(IInternStepRepository internStepRepository)
        {
            _internStepRepository = internStepRepository;
        }

        public async Task<Unit> Handle(CreateInternStepsCommand request, CancellationToken cancellationToken)
        {
            foreach (var internStepDto in request.InternSteps)
            {
                var internStep = new InternStep
                {
                    InternId = internStepDto.InternId,
                    StepId = internStepDto.StepId,
                    Status = internStepDto.Status ? "Completed" : "In Progress",
                };
                await _internStepRepository.AddAsync(internStep);
            }

            await _internStepRepository.SaveChangesAsync();
            return Unit.Value;
        }
    }
}
