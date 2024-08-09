using System.Collections.Generic;

namespace Application.Repositories
{
    public interface ILoggerRepository<T> where T : class
    {
        void Log(T logEntry);
        IEnumerable<T> GetAllLogs();
    }
}
