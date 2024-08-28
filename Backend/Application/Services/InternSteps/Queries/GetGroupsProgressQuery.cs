namespace Application.Services.ProgressTracking.Queries
{
    using Application.Repositories;
    using Application.Repositories.Groups;
    using Domain.DTOs.Subjects;
    using MediatR;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public record GetGroupsProgressQuery(Guid GroupId, Guid SubjectId) : IRequest<GroupProgressViewModel>;
    public class GetGroupsProgressQueryHandler : IRequestHandler<GetGroupsProgressQuery, GroupProgressViewModel>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IInternStepRepository _internStepRepository;
        private readonly ISubjectRepository _subjectRepository;

        public GetGroupsProgressQueryHandler(
            IGroupRepository groupRepository,
            IInternStepRepository internStepRepository,
            ISubjectRepository subjectRepository)
        {
            _groupRepository = groupRepository;
            _internStepRepository = internStepRepository;
            _subjectRepository = subjectRepository;
        }

        public async Task<GroupProgressViewModel> Handle(GetGroupsProgressQuery request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(request.GroupId);

            if (group == null)
            {
                throw new InvalidOperationException("Group not found");
            }

            var subject = await _subjectRepository.GetSubjectForGroupAsync(request.SubjectId, request.GroupId);

            if (subject == null)
            {
                throw new InvalidOperationException("Subject not found for the given group");
            }

            var stepProgressViewModels = new List<StepProgressViewModel>();
            double overallSubjectProgress = 0.0;

            foreach (var step in subject.Steps)
            {
                var internSteps = await _internStepRepository.GetByStepIdAsync(step.Id);

                var completedInterns = internSteps.Where(i => i.Status == "Completed").ToList();
                double stepProgress = completedInterns.Count / (double)group.Periods.Count * 100.0;

                var internStepViewModels = completedInterns.Select(i => new InternStepViewModel
                {
                    InternId = i.InternId,
                    InternName = i.Intern.Name,
                    gender = i.Intern.Gender,
                    Status = i.Status
                }).ToList();

                overallSubjectProgress += stepProgress;

                stepProgressViewModels.Add(new StepProgressViewModel
                {
                    StepId = step.Id,
                    Description = step.Description,
                    CompletedByInterns = internStepViewModels,
                    StepProgress = stepProgress.ToString("0.00")
                });
            }

            overallSubjectProgress /= subject.Steps.Count;

            var subjectProgressViewModel = new SubjectProgressViewModel
            {
                SubjectId = subject.Id,
                Title = subject.Title,
                Steps = stepProgressViewModels,
                SubjectProgress = overallSubjectProgress.ToString("0.00")
            };

            return new GroupProgressViewModel
            {
                Subjects = new List<SubjectProgressViewModel> { subjectProgressViewModel }
            };
        }
    }
}
