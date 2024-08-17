using Application.Repositories;
using Application.Services.Subjects.Commands;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Subjects.Commands
{
    public record StepDto(Guid Id, string Description);
    public record UpdateSubjectCommand(
        Guid Id,
        string Title,
        string Type,
        string Description,
        ICollection<StepDto> Steps
    ) : IRequest<Unit>;

    public class UpdateSubjectCommandHandler : IRequestHandler<UpdateSubjectCommand, Unit>
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly IStepRepository _stepRepository;

        public UpdateSubjectCommandHandler(ISubjectRepository subjectRepository, IStepRepository stepRepository)
        {
            _subjectRepository = subjectRepository;
            _stepRepository = stepRepository;
        }

        public async Task<Unit> Handle(UpdateSubjectCommand request, CancellationToken cancellationToken)
        {
            var subject = await _subjectRepository.GetByIdAsync(request.Id);
            if (subject == null)
            {
                throw new KeyNotFoundException("Subject not found");
            }

            subject.Title = request.Title;
            subject.Type = request.Type;
            subject.Description = request.Description;

            var existingStepIds = subject.Steps.Select(s => s.Id).ToList();
            var requestStepIds = request.Steps.Select(s => s.Id).ToList();

            //removing steps that are no longer present in the request


            var stepsToRemove = subject.Steps.Where(s => !requestStepIds.Contains(s.Id)).ToList();
            foreach (var step in stepsToRemove)
            {
                subject.Steps.Remove(step);
            }


            foreach (var stepDto in request.Steps)
            {
                var existingStep = subject.Steps.FirstOrDefault(s => s.Id == stepDto.Id);
                if (existingStep != null)
                {
                    existingStep.Description = stepDto.Description;
                }
                else
                {
                    var newStep = new Step
                    {
                        Id = Guid.NewGuid(),
                        Description = stepDto.Description,
                        SubjectId = subject.Id
                    };

                    await _stepRepository.AddAsync(newStep);
                    subject.Steps.Add(newStep);
                }
            }

            await _subjectRepository.UpdateAsync(subject);
            return Unit.Value;
        }
    }
}
