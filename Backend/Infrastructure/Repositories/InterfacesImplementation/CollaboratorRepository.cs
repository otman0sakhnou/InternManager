using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data.Context;
using Application.Repositories;

namespace Infrastructure.Repositories
{
    public class CollaboratorRepository : ICollaboratorRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public CollaboratorRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Collaborator> GetCollaboratorById(Guid id)
        {
            return await _dbContext.Collaborators.Include(c => c.User).FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Collaborator>> GetAllCollaborator()
        {
            return await _dbContext.Collaborators.Include(c => c.User).ToListAsync();
        }

        public async Task AddCollaborator(Collaborator collaborator)
        {
            await _dbContext.Collaborators.AddAsync(collaborator);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateCollaborator(Collaborator collaborator)
        {
            _dbContext.Collaborators.Update(collaborator);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteCollaborator(Guid id)
        {
            var collaborator = await _dbContext.Collaborators.FindAsync(id);
            if (collaborator != null)
            {
                _dbContext.Collaborators.Remove(collaborator);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
