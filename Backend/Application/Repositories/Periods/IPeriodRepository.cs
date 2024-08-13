using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories.Periods
{
    public interface IPeriodRepository
    {
        Task AddAsync(Period period);
        Task UpdateAsync(Period period);
        Task DeleteAsync(Period period);
        Task<Period> GetByIdAsync(Guid id);
        Task<IEnumerable<Period>> GetByInternIdAsync(Guid internId);
        Task<IEnumerable<Period>> GetByGroupIdAsync(Guid groupId);
        // Ajoutez d'autres méthodes nécessaires pour les mises à jour et suppressions
    }
}
