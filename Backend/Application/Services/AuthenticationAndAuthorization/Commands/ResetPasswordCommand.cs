using Domain.DTOs;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.AuthenticationAndAuthorization.Commands
{
    public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<ResetPasswordResponse>;

    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, ResetPasswordResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ResetPasswordCommandHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ResetPasswordResponse> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return new ResetPasswordResponse(false, "User not found", new[] { "No user associated with this email." });
            }

            var token = Uri.UnescapeDataString(request.Token);

            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            if (result.Succeeded)
            {
                return new ResetPasswordResponse(true, "Password has been reset successfully.", Array.Empty<string>());
            }

            return new ResetPasswordResponse(false, "Password reset failed.", result.Errors.Select(e => e.Description).ToArray());
        }
    }
}
