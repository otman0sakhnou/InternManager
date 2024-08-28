using Application.Repositories;
using Domain.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.AuthenticationAndAuthorization.Queries
{
    public record GetRoleByInernIdQuery(Guid internId) : IRequest<GetRolesResponse>;

    public class GetRoleByInternIdQueryHandler : IRequestHandler<GetRoleByInernIdQuery, GetRolesResponse>
    {
        private readonly IInternRepository _internRepository;
        private readonly IMediator _mediator;
        public GetRoleByInternIdQueryHandler(IInternRepository internRepository, IMediator mediator)
        {
            _internRepository = internRepository;
            _mediator = mediator;
        }

        public async Task<GetRolesResponse> Handle(GetRoleByInernIdQuery request, CancellationToken cancellationToken)
        {
            var userId = await _internRepository.GetUserIdByInternId(request.internId);
            if (userId == null)
            {
                throw new Exception("User not found for the given intern ID.");
            }

            return await _mediator.Send(new GetRolesQuery(userId.ToString()));
        }
    }
}
