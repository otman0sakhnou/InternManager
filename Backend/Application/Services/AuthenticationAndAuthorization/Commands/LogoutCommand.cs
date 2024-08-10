using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTOs;
using Application.Services.AuthenticationAndAuthorization.Common;

namespace Application.Services.AuthenticationAndAuthorization.Commands
{
   public record LogoutCommand(string RefreshToken) : IRequest<LogoutResponse>;

    public class LogoutCommandHandler : IRequestHandler<LogoutCommand, LogoutResponse>
    {
        private readonly ITokenService _tokenService;

        public LogoutCommandHandler(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        public async Task<LogoutResponse> Handle(LogoutCommand request, CancellationToken cancellationToken)
        {
            var isInvalidated = await _tokenService.InvalidateRefreshTokenAsync(request.RefreshToken);

            if (isInvalidated)
            {
                return new LogoutResponse(true, Array.Empty<string>());
            }

            return new LogoutResponse(false, new[] { "Failed to invalidate the refresh token" });
        }

    }
}
