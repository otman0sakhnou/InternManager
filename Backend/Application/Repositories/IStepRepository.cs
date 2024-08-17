using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Application.Repositories
{
    public interface IStepRepository
    {
        Task<Step> GetByIdAsync(Guid id);
        Task<IEnumerable<Step>> GetAllAsync();
        Task AddAsync(Step step);
        Task UpdateAsync(Step step);
        Task DeleteAsync(Guid id);
    }
}
