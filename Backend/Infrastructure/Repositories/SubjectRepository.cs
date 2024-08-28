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
            return await _context.Subjects.Include(g => g.Group).Include(s => s.Steps.OrderBy(step => step.OrderStep)).FirstOrDefaultAsync(s => s.Id == id);
        }
        public async Task<IEnumerable<Subject>> GetAllAsync()
        {
            return await _context.Subjects
                                 .Include(g => g.Group)
                                 .Include(s => s.Steps.OrderBy(step => step.OrderStep))
                                 .ToListAsync();
        }
        public async Task AddAsync(Subject subject)
        {
            await _context.Subjects.AddAsync(subject);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Subject subject)
        {
            // Attach the entity if it's not already tracked
            var existingSubject = await _context.Subjects
                .Include(s => s.Steps.OrderBy(step => step.OrderStep))
                .FirstOrDefaultAsync(s => s.Id == subject.Id);

            if (existingSubject != null)
            {
                _context.Entry(existingSubject).CurrentValues.SetValues(subject);
                _context.Steps.RemoveRange(existingSubject.Steps); // Remove old steps
                _context.Steps.AddRange(subject.Steps); // Add new steps
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException("Subject to update not found.");
            }
        }
        public async Task DeleteAsync(Guid subjectId)
        {
            var subject = await _context.Subjects
                .Include(s => s.Steps.OrderBy(step => step.OrderStep))
                .FirstOrDefaultAsync(s => s.Id == subjectId);

            if (subject == null)
            {
                throw new KeyNotFoundException("Subject not found");
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();
        }


        public async Task<Subject> GetSubjectForGroupAsync(Guid subjectId, Guid groupId)
        {
            return await _context.Subjects
                .Include(s => s.Steps.OrderBy(step => step.OrderStep))
                .ThenInclude(s => s.InternSteps)
                .Include(s => s.Group)
                .ThenInclude(g => g.Periods)
                .ThenInclude(p => p.Intern)
                .FirstOrDefaultAsync(s => s.Id == subjectId && s.GroupId == groupId);
        }

        public async Task<List<Subject>> GetSubjectsForInternAsync(Guid internId)
        {
            return await _context.Subjects
               .Include(s => s.Steps.OrderBy(step => step.OrderStep))
               .ThenInclude(s => s.InternSteps.Where(internStep => internStep.InternId == internId))
               .ToListAsync();
        }
    }
}

