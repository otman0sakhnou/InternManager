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
    public class InternStepRepository : IInternStepRepository
    {
        private readonly ApplicationDbContext _context;

        public InternStepRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(InternStep internStep)
        {
            await _context.InternSteps.AddAsync(internStep);
        }

        public async Task<IEnumerable<InternStep>> GetByInternIdAsync(Guid internId)
        {
            return await _context.InternSteps
                .Where(internStep => internStep.InternId == internId)
                .Include(internStep => internStep.Step) 
                .Include(internStep => internStep.Intern) 
                .ToListAsync();
        }

        public async Task<IEnumerable<InternStep>> GetByStepIdAsync(Guid stepId)
        {
            return await _context.InternSteps
                .Where(internStep => internStep.StepId == stepId)
                .Include(internStep => internStep.Step)
                .Include(internStep => internStep.Intern)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
