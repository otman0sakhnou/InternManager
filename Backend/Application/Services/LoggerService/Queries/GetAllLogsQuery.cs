using Application.Repositories;
using Domain.Models;
using MediatR;


namespace Application.Services.LoggerService.Queries
{
    public class GetAllLogsQuery : IRequest<IEnumerable<LogEntry>>
    {
    }

    public class GetAllLogsQueryHandler : IRequestHandler<GetAllLogsQuery, IEnumerable<LogEntry>>
    {
        private readonly ILoggerRepository<LogEntry> _loggerRepository;

        public GetAllLogsQueryHandler(ILoggerRepository<LogEntry> loggerRepository)
        {
            _loggerRepository = loggerRepository;
        }

        public Task<IEnumerable<LogEntry>> Handle(GetAllLogsQuery request, CancellationToken cancellationToken)
        {
            var logs = _loggerRepository.GetAllLogs();
            return Task.FromResult(logs);
        }
    }
}
