using Application.Repositories;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.InternSteps.Commands
{
    public record UpdateStepValidationCommand(
    Guid StepId,
    Guid InternId,
    bool Status
    ) : IRequest<Unit>;

    public class UpdateStepValidationCommandHandler : IRequestHandler<UpdateStepValidationCommand, Unit>
    {
        private readonly IStepRepository _stepRepository;
        private readonly IInternStepRepository _internStepRepository;

        public UpdateStepValidationCommandHandler(IStepRepository stepRepository, IInternStepRepository internStepRepository)
        {
            _stepRepository = stepRepository;
            _internStepRepository = internStepRepository;
        }

        public async Task<Unit> Handle(UpdateStepValidationCommand request, CancellationToken cancellationToken)
        {
            var step = await _stepRepository.GetByIdAsync(request.StepId);

            if (step == null)
            {
                throw new InvalidOperationException("Step not found");
            }

            var internStep = (await _internStepRepository.GetByStepIdAsync(request.StepId))
            .FirstOrDefault(internStep => internStep.InternId == request.InternId);

            if (internStep == null)
            {
                // Add a new InternStep if it does not exist
                await _internStepRepository.AddAsync(new InternStep
                {
                    StepId = request.StepId,
                    InternId = request.InternId,
                    Status = request.Status ? "Completed" : "Pending"
                });
            }
            else
            {
                // Update the status of the existing InternStep
                internStep.Status = request.Status ? "Completed" : "Pending";
            }

            await _internStepRepository.SaveChangesAsync();

            return Unit.Value;
        }
    }
}
