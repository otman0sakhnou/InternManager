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
    public class StepRepository : IStepRepository
    {
        private readonly ApplicationDbContext _context;

        public StepRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Step> GetByIdAsync(Guid id)
        {
            return await _context.Set<Step>().FindAsync(id);
        }

        public async Task<IEnumerable<Step>> GetAllAsync()
        {
            return await _context.Set<Step>().ToListAsync();
        }

        public async Task AddAsync(Step step)
        {
            await _context.Set<Step>().AddAsync(step);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Step step)
        {
            _context.Set<Step>().Update(step);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var step = await GetByIdAsync(id);
            if (step != null)
            {
                _context.Set<Step>().Remove(step);
                await _context.SaveChangesAsync();
            }
        }
    }
}
