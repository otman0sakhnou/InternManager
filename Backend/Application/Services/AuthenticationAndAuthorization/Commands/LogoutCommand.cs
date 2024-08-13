using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Application.Services.AuthenticationAndAuthorization.Common;
using Application.Repositories;

namespace Application.Services.AuthenticationAndAuthorization.Commands
{
   public record LogoutCommand(string RefreshToken) : IRequest<LogoutResponse>;

    public class LogoutCommandHandler : IRequestHandler<LogoutCommand, LogoutResponse>
    {
        private readonly ITokenService _tokenService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public LogoutCommandHandler(ITokenService tokenService, IRefreshTokenRepository refreshTokenRepository)
        {
            _tokenService = tokenService;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<LogoutResponse> Handle(LogoutCommand request, CancellationToken cancellationToken)
        {
            var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);

            if (refreshToken == null || refreshToken.IsRevoked)
            {
                return new LogoutResponse(false, new[] { "Invalid or already revoked refresh token" });
            }
            var isInvalidated = await _tokenService.InvalidateRefreshTokenAsync(request.RefreshToken);

            if (isInvalidated)
            {
                return new LogoutResponse(true, Array.Empty<string>());
            }

            return new LogoutResponse(false, new[] { "Failed to invalidate the refresh token" });
        }

    }
}
