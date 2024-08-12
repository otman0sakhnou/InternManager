using System;
using Application.Repositories;
using Application.Services.Collaborator.Queries;
using AutoMapper;
using Domain.DTOs;
using MediatR;

namespace Application.Services.Collaborator.Handlers;
    public class GetCollaboratorByIdQueryHandler : IRequestHandler<GetCollaboratorByIdQuery, CollaboratorRes>
    {
        private readonly ICollaboratorRepository _repository;
        private readonly IMapper _mapper;

        public GetCollaboratorByIdQueryHandler(ICollaboratorRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<CollaboratorRes> Handle(GetCollaboratorByIdQuery request, CancellationToken cancellationToken)
        {
            var collaborator = await _repository.GetCollaboratorById(request.Id);
            return _mapper.Map<CollaboratorRes>(collaborator);
        }
    }
