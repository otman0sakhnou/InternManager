using Application.Services.AuthenticationAndAuthorization.Common;
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
    public record RefreshTokenCommand(string refreshToken) : IRequest<RefreshTokenResponse>;

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public RefreshTokenCommandHandler(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<RefreshTokenResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(request.refreshToken);

            if (principal == null)
            {
                return new RefreshTokenResponse(false, null, null, new[] { "Invalid refresh token" });
            }

            var username = principal.Identity.Name;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return new RefreshTokenResponse(false, null, null, new[] { "User not found" });
            }

            var newAccessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            return new RefreshTokenResponse(true, newAccessToken, newRefreshToken, Array.Empty<string>());  
        }
    }
}
