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

namespace Application.Services.AuthenticationAndAuthorization.Commands
{
    public record AssignRoleCommand(string UserId, string Role) : IRequest<AssignRoleResponse>;

    public class AssignRoleCommandHandler : IRequestHandler<AssignRoleCommand, AssignRoleResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;


        public AssignRoleCommandHandler(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<AssignRoleResponse> Handle(AssignRoleCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return new AssignRoleResponse(false, null, new[] { "User not found" });
            }

            if (!await _roleManager.RoleExistsAsync(request.Role))
            {
                return new AssignRoleResponse(false, null, new[] { "Role does not exist" });
            }

            var result = await _userManager.AddToRoleAsync(user, request.Role);
            if (result.Succeeded)
            {
                return new AssignRoleResponse(true, "Role assigned successfully", Array.Empty<string>());
            }

            return new AssignRoleResponse(false, null, result.Errors.Select(e => e.Description).ToArray());
        }
    }

}
