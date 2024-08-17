using Application.Repositories.Groups;
using MediatR;


namespace Application.Services.GroupService.Commands
{
    public class RemoveInternFromGroupCommand : IRequest<bool>
    {
        public Guid GroupId { get; set; }
        public Guid InternId { get; set; }
    }

    public class RemoveInternFromGroupCommandHandler : IRequestHandler<RemoveInternFromGroupCommand, bool>
    {
        private readonly IGroupRepository _repository;

        public RemoveInternFromGroupCommandHandler(IGroupRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(RemoveInternFromGroupCommand request, CancellationToken cancellationToken)
        {
            var group = await _repository.GetByIdAsync(request.GroupId);

            if (group == null || !group.Periods.Any(p => p.InternId == request.InternId))
            {
                return false; // Group or intern not found
            }

            // Remove the period corresponding to the intern
            var periodToRemove = group.Periods.FirstOrDefault(p => p.InternId == request.InternId);
            if (periodToRemove != null)
            {
                group.Periods.Remove(periodToRemove);
                await _repository.UpdateAsync(group);
                return true;
            }

            return false;
        }
    }
}
