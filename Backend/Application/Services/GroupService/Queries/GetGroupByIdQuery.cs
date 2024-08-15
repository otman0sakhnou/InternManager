using Application.Repositories.Groups;
using AutoMapper;
using Domain.DTOs.Groups;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.GroupService.Queries
{
    public class GetGroupByIdQuery : IRequest<Group>
    {
        public Guid Id { get; set; }

        public GetGroupByIdQuery(Guid id)
        {
            Id = id;
        }
    }

    public class GetGroupByIdQueryHandler : IRequestHandler<GetGroupByIdQuery, Group>
    {
        private readonly IGroupRepository _repository;
        private readonly IMapper _mapper;

        public GetGroupByIdQueryHandler(IGroupRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Group> Handle(GetGroupByIdQuery request, CancellationToken cancellationToken)

        {
            var group = await _repository.GetByIdAsync(request.Id);
            return group;
        }
    }
}
