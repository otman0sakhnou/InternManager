using Application.Repositories.Groups;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.GroupService.Queries
{
    public class GetGroupsByInternIdQuery : IRequest<IEnumerable<Group>>
    {
        public Guid InternId { get; set; }

        public GetGroupsByInternIdQuery(Guid internId)
        {
            InternId = internId;
        }
    }
    public class GetGroupsByInternIdQueryHandler : IRequestHandler<GetGroupsByInternIdQuery, IEnumerable<Group>>
    {
        private readonly IGroupRepository _repository;

        public GetGroupsByInternIdQueryHandler(IGroupRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Group>> Handle(GetGroupsByInternIdQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetGroupsByInternIdAsync(request.InternId);
        }
    }

}
