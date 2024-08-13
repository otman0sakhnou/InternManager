using Application.Repositories.Groups;
using Application.Repositories.Periods;
using AutoMapper;
using Domain.Models;
using MediatR;


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
        private readonly IPeriodRepository _periodRepository;
        private readonly IMapper _mapper;

        public UpdateGroupCommandHandler(IGroupRepository repository, IPeriodRepository periodRepository, IMapper mapper)
        {
            _repository = repository;
            _periodRepository = periodRepository;
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
            var currentInterns = (await _periodRepository.GetByGroupIdAsync(request.Id)).Select(p => p.InternId).ToList();

            // Interns to remove from the group
            var internsToRemove = currentInterns.Except(request.NewInternIds).ToList();

            // Interns to add to the group
            var internsToAdd = request.NewInternIds.Except(currentInterns).ToList();

            // Remove groupId for interns that are no longer in the group
            foreach (var internId in internsToRemove)
            {
                var periods = await _periodRepository.GetByInternIdAsync(internId);
                foreach (var period in periods.Where(p => p.GroupId == request.Id))
                {
                    period.GroupId = null;
                    await _periodRepository.UpdateAsync(period);
                }
            }

            // Update or add periods for the new interns
            foreach (var internId in internsToAdd)
            {
                var periods = await _periodRepository.GetByInternIdAsync(internId);
                var latestPeriod = periods.OrderByDescending(p => p.EndDate).FirstOrDefault();

                if (latestPeriod != null)
                {
                    // Update the latest period with the new groupId
                    latestPeriod.GroupId = request.Id;
                    await _periodRepository.UpdateAsync(latestPeriod);
                }
                else
                {
                    // Create a new period if none exists
                    var newPeriod = new Period
                    {
                        Id = Guid.NewGuid(),
                        InternId = internId,
                        GroupId = request.Id,
                        StartDate = DateTime.UtcNow,
                        EndDate = request.ExpirationDate
                    };
                    await _periodRepository.AddAsync(newPeriod);
                }
            }

            return true;
        }
    }
}
