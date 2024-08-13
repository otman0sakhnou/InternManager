using Application.Repositories.Groups;
using AutoMapper;
using Domain.DTOs.Groups;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services.GroupService.Queries
{
    public class GetAllGroupsQuery : IRequest<IEnumerable<GroupDto>>
    {
    }

    public class GetAllGroupsQueryHandler : IRequestHandler<GetAllGroupsQuery, IEnumerable<GroupDto>>
    {
        private readonly IGroupRepository _repository;
        private readonly IMapper _mapper;

        public GetAllGroupsQueryHandler(IGroupRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GroupDto>> Handle(GetAllGroupsQuery request, CancellationToken cancellationToken)
        {
            var groups = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<GroupDto>>(groups);
        }
    }
}
