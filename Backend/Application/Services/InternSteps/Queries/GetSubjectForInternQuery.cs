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
    public record GetSubjectForInternQuery(Guid SubjectId, Guid InternId) : IRequest<SubjectDetailsForInternDto>;

    public class GetSubjectForInternQueryHandler : IRequestHandler<GetSubjectForInternQuery, SubjectDetailsForInternDto>
    {
        private readonly ISubjectRepository _subjectRepository;

        public GetSubjectForInternQueryHandler(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        public async Task<SubjectDetailsForInternDto> Handle(GetSubjectForInternQuery request, CancellationToken cancellationToken)
        {
            var subject = await _subjectRepository.GetSubjectForInternAsync(request.SubjectId, request.InternId);

            if (subject == null)
            {
                throw new InvalidOperationException("Subject not found");
            }

            var steps = subject.Steps.Select(step =>
                new StepStatusDto(
                    step.Id,
                    step.Description,
                    step.InternSteps.FirstOrDefault()?.Status ?? "Not Started"
                )
            ).ToList();

            double completedSteps = steps.Count(step => step.Status == "Completed");
            double totalSteps = steps.Count;
            double progressPercentage = (totalSteps > 0) ? (completedSteps / totalSteps) * 100 : 0;

            return new SubjectDetailsForInternDto(
                subject.Id,
                subject.Title,
                subject.Type,
                subject.Description,
                steps,
                progressPercentage
            );
        }
    }

}
