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
    public record GetSubjectForInternQuery(Guid InternId) : IRequest<List<SubjectDetailsForInternDto>>;

    public class GetSubjectForInternQueryHandler : IRequestHandler<GetSubjectForInternQuery, List<SubjectDetailsForInternDto>>
    {
        private readonly ISubjectRepository _subjectRepository;

        public GetSubjectForInternQueryHandler(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        public async Task<List<SubjectDetailsForInternDto>> Handle(GetSubjectForInternQuery request, CancellationToken cancellationToken)
        {
            var subjects = await _subjectRepository.GetSubjectsForInternAsync(request.InternId);

            if (subjects == null)
            {
                throw new InvalidOperationException("Subject not found");
            }

            var subjectDetails = subjects.Select(subject =>
            {
                var steps = subject.Steps.Select(step =>
                    new StepStatusDto(
                        step.Id,
                        step.Description,
                        step.InternSteps.FirstOrDefault(internStep => internStep.InternId == request.InternId)?.Status ?? "Not Started"
                    )
                ).ToList();

                double completedSteps = steps.Count(step => step.Status == "Completed");
                double totalSteps = steps.Count;
                double progressPercentage = (totalSteps > 0) ? (completedSteps / totalSteps) * 100 : 0;

                return new SubjectDetailsForInternDto(
                    subject.Id,
                    subject.Title,
                    steps,
                    progressPercentage
                );
            }).ToList();

            return subjectDetails;
        }
    }

}
