using Application.Repositories;
using Domain.Models;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
   

    public class InternRepository : IInternRepository
    {
        private readonly ApplicationDbContext _context;

        public InternRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Intern> GetByIdAsync(Guid id)
        {
            return await _context.Interns
       

       .Include(i => i.User) // Inclure l'utilisateur associé
         .Include(i => i.Periods)
       .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<IEnumerable<Intern>> GetAllAsync()
        {
            return await _context.Interns
                .Include(i => i.Periods)
                 
                .Include(i => i.User)
                .ToListAsync();
        }

        public async Task AddAsync(Intern intern)
        {
            await _context.Interns.AddAsync(intern);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Intern intern)
        {
            _context.Interns.Update(intern);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var intern = await GetByIdAsync(id);
            if (intern != null)
            {
                _context.Interns.Remove(intern);
                await _context.SaveChangesAsync();
            }
        }
        public async Task DeleteAllAsync()
        {
         
            _context.Interns.RemoveRange(_context.Interns);
            await _context.SaveChangesAsync();
        }

        public async Task<Guid?> GetUserIdByInternId(Guid internId)
        {
            var userId = await _context.Interns
                .Where(i => i.Id == internId)
                .Select(i => i.UserId)
                .FirstOrDefaultAsync();

            return Guid.TryParse(userId, out var guidUserId) ? guidUserId : (Guid?)null;
        }

        public async Task<Guid?> GetInternIdByUserId(Guid userId)
        {
            return await _context.Interns
                .Where(i => i.UserId == userId.ToString())
                .Select(i => i.Id)
                .FirstOrDefaultAsync();
        }
    }
}
