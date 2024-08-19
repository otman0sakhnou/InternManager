using Application.Repositories;
using Domain.DTOs.Subjects;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.InternSteps.Queries
{
    public record GetSubjectForGroupQuery(Guid SubjectId, Guid GroupId) : IRequest<GroupSubjectDetailsDto>;

    public class GetSubjectForGroupQueryHandler : IRequestHandler<GetSubjectForGroupQuery, GroupSubjectDetailsDto>
    {
        private readonly ISubjectRepository _subjectRepository;

        public GetSubjectForGroupQueryHandler(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        public async Task<GroupSubjectDetailsDto> Handle(GetSubjectForGroupQuery request, CancellationToken cancellationToken)
        {
            var subject = await _subjectRepository.GetSubjectForGroupAsync(request.SubjectId, request.GroupId);

            if (subject == null)
            {
                throw new InvalidOperationException("Subject not found");
            }

            var periods = subject.Group.Periods;
            var interns = periods.Select(p => p.Intern).Distinct(); // Get unique interns

            var internsProgress = interns.Select(intern =>
            {
                var steps = subject.Steps.Select(step =>
                    new StepStatusDto(
                        step.Id,
                        step.Description,
                        step.InternSteps.FirstOrDefault(internStep => internStep.InternId == intern.Id)?.Status ?? "Not Started"
                    )
                ).ToList();

                double completedSteps = steps.Count(step => step.Status == "Completed");
                double totalSteps = steps.Count;
                double progressPercentage = (totalSteps > 0) ? (completedSteps / totalSteps) * 100 : 0;

                return new InternProgressDto(
                    intern.Id,
                    intern.Name, // Assuming Intern has a Name property
                    steps,
                    progressPercentage
                );
            }).ToList();

            double totalGroupSteps = subject.Steps.Count * interns.Count();
            double completedGroupSteps = internsProgress.Sum(intern => intern.Steps.Count(step => step.Status == "Completed"));

            double groupProgressPercentage = (totalGroupSteps > 0) ? (completedGroupSteps / totalGroupSteps) * 100 : 0;

            return new GroupSubjectDetailsDto(
                subject.Id,
                subject.Title,
                subject.Type,
                subject.Description,
                groupProgressPercentage,
                internsProgress
            );
        }
    }

}
