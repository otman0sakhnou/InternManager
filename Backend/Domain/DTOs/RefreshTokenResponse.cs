using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public record RefreshTokenResponse(bool Success, string AccessToken, string RefreshToken, string[] Errors);
}
