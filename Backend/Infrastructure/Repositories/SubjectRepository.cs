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
        public void Update(Subject subject)
        {
            _context.Subjects.Update(subject);
            _context.SaveChanges();
        }
        public void Delete(Subject subject)
        {
            _context.Subjects.Remove(subject);
            _context.SaveChanges();
        }
    }
}
