using Application.Repositories.Groups;
using Application.Repositories.Periods;
using AutoMapper;
using Domain.DTOs.Groups;
using Domain.Models;
using MediatR;



namespace Application.Services.GroupService.Commands
{
    public class CreateGroupCommand : IRequest<Group>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Department { get; set; }
        public Guid CollaboratorId { get; set; }
        public List<Guid> InternIds { get; set; }
    }

    public class CreateGroupCommandHandler : IRequestHandler<CreateGroupCommand, Group>
    {
        private readonly IGroupRepository _repository;
        private readonly IPeriodRepository _periodRepository; // Accès direct à DbContext pour gérer les périodes
        private readonly IMapper _mapper;

        public CreateGroupCommandHandler(IGroupRepository repository, IMapper mapper, IPeriodRepository periodRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _periodRepository = periodRepository;
        }

        public async Task<Group> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
        {
            var group = _mapper.Map<Group>(request);

            // Ajout du groupe
            await _repository.AddAsync(group);

            foreach (var internId in request.InternIds)
            {
                // Récupérer la période la plus récente de l'intern
                var recentPeriod = (await _periodRepository.GetByInternIdAsync(internId))
                    .OrderByDescending(p => p.EndDate)
                    .FirstOrDefault();

                if (recentPeriod != null)
                {
                    // Associer le groupe à cette période
                    recentPeriod.GroupId = group.Id;
                    await _periodRepository.UpdateAsync(recentPeriod);
                }
                else
                {
                    // Créer une nouvelle période si aucune n'existe
                    var newPeriod = new Period
                    {
                        Id = Guid.NewGuid(),
                        InternId = internId,
                        GroupId = group.Id,
                        StartDate = DateTime.UtcNow,
                        EndDate = request.ExpirationDate
                    };
                    await _periodRepository.AddAsync(newPeriod);
                }
            }

            return group;
        }
    }

}
