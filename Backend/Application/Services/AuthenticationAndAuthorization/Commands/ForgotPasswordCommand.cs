using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Microsoft.AspNetCore.Identity;
using Domain.Models;
using Application.Services.AuthenticationAndAuthorization.Common;
using Microsoft.Extensions.Configuration;

namespace Application.Services.AuthenticationAndAuthorization.Commands
{
    public record ForgotPasswordCommand(string Email) : IRequest<ForgotPasswordResponse>;

    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public ForgotPasswordCommandHandler(UserManager<ApplicationUser> userManager, IEmailService emailService, IConfiguration configuration)
        {
            _userManager = userManager;
            _emailService = emailService;
            _configuration = configuration;
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

            var resetLink = $"http://localhost:3000/reset-password?token={Uri.EscapeDataString(resetToken)}&email={Uri.EscapeDataString(request.Email)}";

            var emailSubject = "Reset Your Password";
            var emailBody = $"<p>Click the link below to reset your password:</p><p><a href='{resetLink}'>Reset Password</a></p>";

            await _emailService.SendEmailAsync(request.Email, emailSubject, emailBody);

            return new ForgotPasswordResponse(true, "Password reset email sent.", Array.Empty<string>());
        }
    }
}
