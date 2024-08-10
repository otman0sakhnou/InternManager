using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Microsoft.AspNetCore.Identity;
using Domain.Models;

namespace Application.Services.AuthenticationAndAuthorization.Commands
{
    public record ForgotPasswordCommand(string Email) : IRequest<ForgotPasswordResponse>;

    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ForgotPasswordCommandHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ForgotPasswordResponse> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                return new ForgotPasswordResponse(false, "User not found", new[] { "No user associated with this email." });
            }

            // Generate the password reset token
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Here, you would typically send the token via email to the user
            // For the sake of example, we assume the email sending is successful.

            return new ForgotPasswordResponse(true, "Password reset email sent.", Array.Empty<string>());
        }
    }
}
