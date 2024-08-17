using Domain.DTOs;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.AuthenticationAndAuthorization.Queries
{
    public record GetUserQuery(string UserId) : IRequest<GetUserResponse>;
    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, GetUserResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMediator _mediator;

        public GetUserQueryHandler(UserManager<ApplicationUser> userManager, IMediator mediator)
        {
            _userManager = userManager;
            _mediator = mediator;
        }

        public async Task<GetUserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);

            if (user == null)
            {
                return new GetUserResponse(null,null, "User not found");
            }

            var rolesQuery = new GetRolesQuery(request.UserId);
            var rolesResponse = await _mediator.Send(rolesQuery, cancellationToken);

            return new GetUserResponse(user, rolesResponse.Roles , string.Empty);
        }
    }
}
