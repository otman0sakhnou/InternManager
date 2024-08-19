using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IInternStepRepository
    {
        Task AddAsync(InternStep internStep);
        Task<IEnumerable<InternStep>> GetByInternIdAsync(Guid internId);
        Task<IEnumerable<InternStep>> GetByStepIdAsync(Guid stepId);
        Task SaveChangesAsync();
    }
}
