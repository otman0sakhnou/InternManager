using Application.Repositories;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Subjects.Commands
{
    public record StepDto(string Description);
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

        public CreateSubjectHandler(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        public async Task<Guid> Handle(CreateSubjectCommand request, CancellationToken cancellationToken)
        {
            var subject = new Subject
            {
                //Id = Guid.NewGuid(),
                Title = request.Title,
                Type = request.Type,
                Description = request.Description,
                GroupId = request.GroupId,
                Steps = new List<Step>()
            };

            foreach (var stepDto in request.Steps)
            {
                subject.Steps.Add(new Step
                {
                    //Id = Guid.NewGuid(),
                    Description = stepDto.Description,
                    SubjectId = subject.Id
                });
            }

            await _subjectRepository.AddAsync(subject);
            return subject.Id;
        }
    }
}
