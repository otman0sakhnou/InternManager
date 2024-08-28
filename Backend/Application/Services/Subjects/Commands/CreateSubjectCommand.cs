using Application.Repositories;
using Domain.Models;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Subjects.Commands
{
    public record CreateSubjectCommand(
        string Title,
        string Type,
        string Description,
        Guid GroupId,
        ICollection<StepDto> Steps
    ) : IRequest<Guid>;

    public class CreateSubjectHandler : IRequestHandler<CreateSubjectCommand, Guid>
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly ILogger<CreateSubjectHandler> _logger;

        public CreateSubjectHandler(ISubjectRepository subjectRepository, ILogger<CreateSubjectHandler> logger)
        {
            _subjectRepository = subjectRepository;
            _logger = logger;
        }

        public async Task<Guid> Handle(CreateSubjectCommand request, CancellationToken cancellationToken)
        {
            // Create a new Subject
            var subject = new Subject
            {
                Title = request.Title,
                Type = request.Type,
                Description = request.Description,
                GroupId = request.GroupId,
                Steps = new List<Step>()
            };

            // Add the subject to the repository (this will generate the Id)
            await _subjectRepository.AddAsync(subject);

            // Assign the generated Id to each step and add them to the subject
            foreach (var stepDto in request.Steps.OrderBy(s => s.order))
            {
                var step = new Step
                {
                    Id = Guid.NewGuid(),
                    Description = stepDto.Description,
                    SubjectId = subject.Id,
                    OrderStep = stepDto.order
                };

                subject.Steps.Add(step);
            }

            // Update the subject with steps
            await _subjectRepository.UpdateAsync(subject);

            // Log the subject details
            _logger.LogInformation("Created Subject: {@Subject}", subject);

            return subject.Id;
        }
    }

}
