using Application.Repositories;
using Application.Services.Collaborator.Queries;
using AutoMapper;
using Domain.DTOs;
using MediatR;

namespace Application.Services.Collaborator.Handlers;public class GetAllCollaboratorsQueryHandler : IRequestHandler<GetAllCollaboratorsQuery, IEnumerable<CollaboratorRes>>
{
    private readonly ICollaboratorRepository _repository;
    private readonly IMapper _mapper;

    public GetAllCollaboratorsQueryHandler(ICollaboratorRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CollaboratorRes>> Handle(GetAllCollaboratorsQuery request, CancellationToken cancellationToken)
    {
        var collaborators = await _repository.GetAllCollaborator();
        return _mapper.Map<IEnumerable<CollaboratorRes>>(collaborators);
    }
}
