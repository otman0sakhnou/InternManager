using Application.Services.AuthenticationAndAuthorization.Common;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;

namespace Application.Services.AuthenticationAndAuthorization.Queries
{
    public record GetRolesQuery (string UserId) : IRequest<GetRolesResponse>;

    public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, GetRolesResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public GetRolesQueryHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<GetRolesResponse> Handle(GetRolesQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);

            if (user == null)
            {
                return new GetRolesResponse(false, null, new[] { "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            return new GetRolesResponse(true, roles.ToArray(), Array.Empty<string>());
        }
    }
}
