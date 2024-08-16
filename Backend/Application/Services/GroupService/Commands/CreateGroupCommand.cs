using Application.Repositories.Groups;

using Application.Services.PriodService.Commands;
using Application.Services.PriodService.Queries;
using AutoMapper;
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
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public CreateGroupCommandHandler(IGroupRepository repository, IMapper mapper, IMediator mediator)
        {
            _repository = repository;
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task<Group> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
        {
            var group = _mapper.Map<Group>(request);

            // Ajout du groupe
            await _repository.AddAsync(group);

            foreach (var internId in request.InternIds)
            {
                try
                {
                    // Utilisation de la query pour récupérer la dernière période
                    var recentPeriod = await _mediator.Send(new GetLatestPeriodQuery(internId), cancellationToken);

                    if (recentPeriod != null)
                    {
                        var updatePeriodCommand = new UpdatePeriodCommand
                        {
                            Id = recentPeriod.Id,
                            StartDate = recentPeriod.StartDate,
                            EndDate = recentPeriod.EndDate,
                            InternId = recentPeriod.InternId,
                            GroupId = group.Id
                        };

                        await _mediator.Send(updatePeriodCommand, cancellationToken);
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

                        // Utilisation de la commande pour ajouter la nouvelle période
                        await _mediator.Send(newPeriod, cancellationToken);
                    }
                }
                catch (Exception ex)
                {
                    // Gestion de l'exception pour chaque internId
                    throw new Exception($"Failed to process internId: {internId}", ex);
                }
            }

            return group;
        }

    }
}


