using Application.Repositories.Periods;
using Domain.Models;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.Periods
{
    public class PeriodRepository : IPeriodRepository
    {
        private readonly ApplicationDbContext _context;

        public PeriodRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Period period)
        {
            await _context.Periods.AddAsync(period);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Period period)
        {
            _context.Periods.Update(period);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Period period)
        {
            _context.Periods.Remove(period);
            await _context.SaveChangesAsync();
        }

        public async Task<Period> GetByIdAsync(Guid id)
        {
            return await _context.Periods.FindAsync(id);
        }

        public async Task<IEnumerable<Period>> GetByInternIdAsync(Guid internId)
        {
            return await _context.Periods
                .Where(p => p.InternId == internId)
                .ToListAsync();
        }
        public async Task<IEnumerable<Period>> GetByGroupIdAsync(Guid groupId)
        {
            return await _context.Periods
                .Where(p => p.GroupId == groupId)
                .ToListAsync();
        }
    }
}
