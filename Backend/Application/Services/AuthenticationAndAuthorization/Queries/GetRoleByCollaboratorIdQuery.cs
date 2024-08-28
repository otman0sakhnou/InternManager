using Application.Repositories;
using Domain.DTOs;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.AuthenticationAndAuthorization.Queries
{
    public record GetRoleByCollaboratorIdQuery(Guid collaboratorId) : IRequest<GetRolesResponse>;

    public class GetRolesByCollaboratorIdQueryHandler : IRequestHandler<GetRoleByCollaboratorIdQuery, GetRolesResponse>
    {
        private readonly ICollaboratorRepository _collaboratorRepository;
        private readonly IMediator _mediator;
        public GetRolesByCollaboratorIdQueryHandler(ICollaboratorRepository collaboratorRepository, IMediator mediator)
        {
            _collaboratorRepository = collaboratorRepository;
            _mediator = mediator;
        }

        public async Task<GetRolesResponse> Handle(GetRoleByCollaboratorIdQuery request, CancellationToken cancellationToken)
        {
            var userId = await _collaboratorRepository.GetUserIdByCollaboratorId(request.collaboratorId);
            if (userId == null)
            {
                throw new Exception("User not found for the given collaborator ID.");
            }

            return await _mediator.Send(new GetRolesQuery(userId.ToString()));
        }
    }
}
