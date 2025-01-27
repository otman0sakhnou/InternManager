﻿using System.Collections.Generic;
using System.Linq;
using Application.Repositories;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class LoggerRepository<T> : ILoggerRepository<T> where T : class
    {
        private readonly ApplicationDbContext _context;
        private readonly DbSet<T> _dbSet;

        public LoggerRepository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public void Log(T logEntry)
        {
            _dbSet.Add(logEntry);
            _context.SaveChanges();
        }

        public IEnumerable<T> GetAllLogs()
        {
            return _dbSet.ToList();
        }
    }
}
