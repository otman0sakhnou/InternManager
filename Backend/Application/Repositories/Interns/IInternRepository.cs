using Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IInternRepository
    {
        Task<Intern> GetByIdAsync(Guid id);
        Task<IEnumerable<Intern>> GetAllAsync();
        Task AddAsync(Intern intern);
        Task UpdateAsync(Intern intern);
        Task DeleteAsync(Guid id);
        Task DeleteAllAsync();
    }
}
