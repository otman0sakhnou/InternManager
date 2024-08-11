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

namespace Application.Services.AuthenticationAndAuthorization.Commands
{
    public record RegisterCommand(string Password, string Email) : IRequest<RegisterResponse>;

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;

        public RegisterCommandHandler(UserManager<ApplicationUser> userManager, IEmailService emailService)
        {
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task<RegisterResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            //In ASP.NET Identity, the UserName property is required and must be valid according to the configuration rules.
            //By default, UserName should be a non-empty string containing only letters or digits.
            var user = new ApplicationUser {
                UserName = request.Email, // Set UserName to Email or any valid username
                Email = request.Email };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {

                var link = $"http://localhost:3000";
                var emailSubject = "Log In To Your Account";
                var emailBody = $"<p>You were registred to our application. Please click the link below to log in your account:</p><p><a href=\"{link}\">Log In To Your Account</a></p>";

                await _emailService.SendEmailAsync(request.Email, emailSubject, emailBody);
                return new RegisterResponse(true, user.Id, Array.Empty<string>());
            }

            return new RegisterResponse(false, null, result.Errors.Select(e => e.Description).ToArray());
        }
    }
}
