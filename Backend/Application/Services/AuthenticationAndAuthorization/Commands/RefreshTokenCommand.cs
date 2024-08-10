using Application.Repositories;
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
    public record RefreshTokenCommand(string RefreshToken) : IRequest<RefreshTokenResponse>;

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public RefreshTokenCommandHandler(UserManager<ApplicationUser> userManager, ITokenService tokenService, IRefreshTokenRepository refreshTokenRepository)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<RefreshTokenResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
             //Validate the refresh token
            var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);

            if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpirationDate < DateTime.UtcNow)
            {
                return new RefreshTokenResponse(false, null, null, new[] { "Invalid or expired refresh token" });
            }
            // Get the user associated with the refresh token
            var user = await _userManager.FindByIdAsync(refreshToken.UserId);

            if (user == null)
            {
                return new RefreshTokenResponse(false, null, null, new[] { "User not found" });
            }

            // Generate new tokens
            var newAccessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var newRefreshToken = await _tokenService.GenerateRefreshTokenAsync(user);

            var refreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                UserId = user.Id,
                ExpirationDate = DateTime.UtcNow.AddMonths(6), // Example expiration time
                IsRevoked = false
            };

            // Invalidate the old refresh token
            await _tokenService.InvalidateRefreshTokenAsync(request.RefreshToken);

            // Add the new refresh token to the repository
            await _refreshTokenRepository.AddOrUpdateAsync(refreshTokenEntity);

            //await _refreshTokenRepository.AddOrUpdateAsync(new RefreshToken
            //{
            //    Token = newRefreshToken,
            //    UserId = user.Id,
            //    ExpirationDate = DateTime.UtcNow.AddMonths(1)
            //});

            return new RefreshTokenResponse(true, newAccessToken, newRefreshToken, Array.Empty<string>());
        }
    }
}
