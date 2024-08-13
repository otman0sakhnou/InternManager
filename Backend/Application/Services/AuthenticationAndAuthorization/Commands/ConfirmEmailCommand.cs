using Domain.DTOs;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.AuthenticationAndAuthorization.Commands
{
    public record ConfirmEmailCommand(string UserId, string NewEmail, string Token) : IRequest<ConfirmEmailResponse>;

    public class ConfirmEmailCommandHandler : IRequestHandler<ConfirmEmailCommand, ConfirmEmailResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ConfirmEmailCommandHandler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ConfirmEmailResponse> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return new ConfirmEmailResponse(false, "Invalid user ID");
            }

            //var token = Uri.UnescapeDataString(request.Token);
            var token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));

            var result = await _userManager.ChangeEmailAsync(user, request.NewEmail, token);
            user.UserName = request.NewEmail;
            var updateUserNameResult = await _userManager.UpdateAsync(user);
            if (!updateUserNameResult.Succeeded)
            {
                return new ConfirmEmailResponse(false, "Email was changed, but updating the username failed");
            }

            return new ConfirmEmailResponse(true, "Email confirmed and username updated successfully");
        }
    }
}
