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
    public class SubjectRepository : ISubjectRepository
    {
        private readonly ApplicationDbContext _context;

        public SubjectRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Subject> GetByIdAsync(Guid id)
        {
            return await _context.Subjects.Include(s => s.Steps).FirstOrDefaultAsync(s => s.Id == id);
        }
        public async Task<IEnumerable<Subject>> GetAllAsync()
        {
            return await _context.Subjects.Include(s => s.Steps).ToListAsync();
        }
        public async Task AddAsync(Subject subject)
        {
            await _context.Subjects.AddAsync(subject);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Subject subject)
        {
            _context.Subjects.Update(subject);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(Guid subjectId)
        {
            var subject = await _context.Subjects
                .Include(s => s.Steps)
                .FirstOrDefaultAsync(s => s.Id == subjectId);

            if (subject == null)
            {
                throw new KeyNotFoundException("Subject not found");
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();
        }
        public async Task<Subject> GetSubjectForInternAsync(Guid subjectId, Guid internId)
        {
            return await _context.Subjects
                .Include(s => s.Steps)
                .ThenInclude(s => s.InternSteps.Where(internStep => internStep.InternId == internId))
                .FirstOrDefaultAsync(s => s.Id == subjectId);
        }

        public async Task<Subject> GetSubjectForGroupAsync(Guid subjectId, Guid groupId)
        {
            return await _context.Subjects
                .Include(s => s.Steps)
                .ThenInclude(s => s.InternSteps)
                .Include(s => s.Group)
                .ThenInclude(g => g.Periods)
                .ThenInclude(p => p.Intern) // Include Interns through Periods
                .FirstOrDefaultAsync(s => s.Id == subjectId && s.GroupId == groupId);
        }
    }
}
