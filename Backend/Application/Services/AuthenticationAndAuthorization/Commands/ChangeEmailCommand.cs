using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Application.Services.AuthenticationAndAuthorization.Common;
using Microsoft.AspNetCore.WebUtilities;

namespace Application.Services.AuthenticationAndAuthorization.Commands
{
    public record ChangeEmailCommand(string UserId, string NewEmail, string Password) : IRequest<ChangeEmailResponse>;

        public class ChangeEmailCommandHandler : IRequestHandler<ChangeEmailCommand, ChangeEmailResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailSender;

        public ChangeEmailCommandHandler(UserManager<ApplicationUser> userManager, IEmailService emailSender)
        {
            _userManager = userManager;
            _emailSender = emailSender;
        }

        public async Task<ChangeEmailResponse> Handle(ChangeEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);

            if (user == null)
            {
                return new ChangeEmailResponse(false, "User not found");
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!passwordCheck)
            {
                return new ChangeEmailResponse(false, "Incorrect password");
            }

            var token = await _userManager.GenerateChangeEmailTokenAsync(user, request.NewEmail);
            //var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));


            // Send the confirmation email
            var confirmationLink = $"https://localhost:3000/account/change-email?userId={user.Id}&email={request.NewEmail}&token={WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token))}";
            await _emailSender.SendEmailAsync(request.NewEmail, "Confirm your email", $"Please confirm your new email by clicking this link: {confirmationLink}");

            return new ChangeEmailResponse(true, "Confirmation email sent. Please check your new email to confirm the change.");
        }
    }
}
