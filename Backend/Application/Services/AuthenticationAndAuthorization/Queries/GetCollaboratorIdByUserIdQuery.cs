using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Repositories;
using MediatR;

namespace Application.Services.AuthenticationAndAuthorization.Queries
{
    public record GetCollaboratorIdByUserIdQuery(Guid UserId) : IRequest<Guid?>;

    public class GetCollaboratorIdByUserIdQueryHandler : IRequestHandler<GetCollaboratorIdByUserIdQuery, Guid?>
    {
        private readonly ICollaboratorRepository _collaboratorRepository;

        public GetCollaboratorIdByUserIdQueryHandler(ICollaboratorRepository collaboratorRepository)
        {
            _collaboratorRepository = collaboratorRepository;
        }

        public async Task<Guid?> Handle(GetCollaboratorIdByUserIdQuery request, CancellationToken cancellationToken)
        {
            return await _collaboratorRepository.GetCollaboratorIdByUserId(request.UserId);
        }
    }

}
