using Application.Repositories.Groups;
using Application.Repositories.Periods;
using Application.Services.PriodService.Commands;
using Application.Services.PriodService.Queries;
using AutoMapper;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Components.Forms;


namespace Application.Services.GroupService.Commands
{
    public class UpdateGroupCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Department { get; set; }
        public Guid CollaboratorId { get; set; }
        public List<Guid> NewInternIds { get; set; }
    }

    public class UpdateGroupCommandHandler : IRequestHandler<UpdateGroupCommand, bool>
    {
        private readonly IGroupRepository _repository;
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public UpdateGroupCommandHandler(IGroupRepository repository, IMediator mediator, IMapper mapper)
        {
            _repository = repository;
            _mediator = mediator;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
        {
            var group = await _repository.GetByIdAsync(request.Id);
            if (group == null)
            {
                return false;
            }

            // Update group details
            _mapper.Map(request, group);
            await _repository.UpdateAsync(group);

            // Get current interns in the group
            var currentInterns = await _mediator.Send(new GetInternIdsByGroupIdQuery { GroupId = request.Id });

            // Interns to remove from the group
            var internsToRemove = currentInterns.Except(request.NewInternIds).ToList();

            // Interns to add to the group
            var internsToAdd = request.NewInternIds.Except(currentInterns).ToList();

            // Remove groupId for interns that are no longer in the group
            foreach (var internId in internsToRemove)
            {
                var periods = await _mediator.Send(new GetPeriodsByInternIdQuery { InternId = internId });
                foreach (var period in periods.Where(p => p.GroupId == request.Id))
                {
                    period.GroupId = null;
                    var updateCommand = _mapper.Map<UpdatePeriodCommand>(period);
                    updateCommand.GroupId = period.GroupId; // Preserve the current GroupId
                    await _mediator.Send(updateCommand);
                }
            }

            // Update or add periods for the new interns
            foreach (var internId in internsToAdd)
            {
                var periods = await _mediator.Send(new GetPeriodsByInternIdQuery { InternId = internId });
                var latestPeriod = periods.OrderByDescending(p => p.EndDate).FirstOrDefault();

                if (latestPeriod != null)
                {
                    // Update the latest period with the new groupId
                    var updateCommand = _mapper.Map<UpdatePeriodCommand>(latestPeriod);
                    updateCommand.GroupId = request.Id;
                    await _mediator.Send(updateCommand);
                }
                else
                {
                    // Create a new period if none exists
                    var createCommand = new CreatePeriodCommand
                    {
                        StartDate = DateTime.UtcNow,
                        EndDate = request.ExpirationDate,
                        InternId = internId,
                        GroupId = request.Id
                    };
                    await _mediator.Send(createCommand);
                }
            }

            return true;
        }
    }
}
