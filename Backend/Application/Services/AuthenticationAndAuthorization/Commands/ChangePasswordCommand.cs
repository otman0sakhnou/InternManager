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
    public record ChangePasswordCommand(string UserId, string CurrentPassword, string NewPassword, string ConfirmPassword) : IRequest<ChangePasswordResponse>;

    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, ChangePasswordResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ChangePasswordCommandHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ChangePasswordResponse> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            // Get the currently authenticated user
            var user = await _userManager.FindByIdAsync(request.UserId);

            if (user == null)
            {
                return new ChangePasswordResponse(false, "User not found");
            }

            // Check if the new password matches the confirmation password
            if (request.NewPassword != request.ConfirmPassword)
            {
                return new ChangePasswordResponse(false, "The new password and confirmation password do not match.");
            }

            // Attempt to change the password
            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            if (!result.Succeeded)
            {
                return new ChangePasswordResponse(false, "Password change failed", result.Errors.Select(e => e.Description).ToArray());
            }

            return new ChangePasswordResponse(true, "Password changed successfully");
        }
    }
}
