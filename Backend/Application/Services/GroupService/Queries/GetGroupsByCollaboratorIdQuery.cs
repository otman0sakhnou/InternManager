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
    public class GetGroupsByCollaboratorIdQuery : IRequest<IEnumerable<Group>>
    {
        public Guid CollaboratorId { get; set; }

        public GetGroupsByCollaboratorIdQuery(Guid collaboratorId)
        {
            CollaboratorId = collaboratorId;
        }
    }
    public class GetGroupsByCollaboratorIdQueryHandler : IRequestHandler<GetGroupsByCollaboratorIdQuery, IEnumerable<Group>>
    {
        private readonly IGroupRepository _repository;

        public GetGroupsByCollaboratorIdQueryHandler(IGroupRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Group>> Handle(GetGroupsByCollaboratorIdQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetGroupsByCollaboratorIdAsync(request.CollaboratorId);
        }
    }

}
