using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken> GetByTokenAsync(string token);
        Task<RefreshToken> GetByUserIdAsync(string userId);
        Task AddAsync(RefreshToken refreshToken);
        Task AddOrUpdateAsync(RefreshToken refreshToken);
        Task UpdateAsync(RefreshToken refreshToken);
        Task RemoveAsync(string token);
        Task RemoveExpiredTokensAsync();
    }
}
