using Application.Repositories;
using Domain.Models;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _context;

        public RefreshTokenRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(RefreshToken refreshToken)
        {
            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task AddOrUpdateAsync(RefreshToken refreshToken)
        {
            var existingToken = await _context.RefreshTokens
                .SingleOrDefaultAsync(rt => rt.Token == refreshToken.Token);

            if (existingToken != null)
            {
                // Update existing token
                _context.Entry(existingToken).CurrentValues.SetValues(refreshToken);
            }
            else
            {
                // Add new token
                await _context.RefreshTokens.AddAsync(refreshToken);
            }
        }


        public async Task<RefreshToken> GetByTokenAsync(string token)
        {
            return await _context.RefreshTokens
             .Where(rt => rt.Token == token && !rt.IsRevoked && rt.ExpirationDate > DateTime.UtcNow)
             .FirstOrDefaultAsync();
        }

        public async  Task<RefreshToken> GetByUserIdAsync(string userId)
        {
            return await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked && rt.ExpirationDate > DateTime.UtcNow)
            .FirstOrDefaultAsync();
        }

        public async Task RemoveAsync(string token)
        {
            var refreshToken = await GetByTokenAsync(token);
            if (refreshToken != null)
            {
                _context.RefreshTokens.Remove(refreshToken);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveExpiredTokensAsync()
        {
            var now = DateTime.UtcNow;
            var expiredTokens = await _context.RefreshTokens
                .Where(rt => rt.ExpirationDate < now || rt.IsRevoked)
                .ToListAsync();

            _context.RefreshTokens.RemoveRange(expiredTokens);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();
        }
    }
}
