using Application.Repositories;
using Domain.Models;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services.LoggerService.Commands
{
    public class CreateLogEntryCommand : IRequest<Unit>
    {
        public LogEntry LogEntry { get; set; }
    }

    public class CreateLogEntryCommandHandler : IRequestHandler<CreateLogEntryCommand, Unit>
    {
        private readonly ILoggerRepository<LogEntry> _loggerRepository;

        public CreateLogEntryCommandHandler(ILoggerRepository<LogEntry> loggerRepository)
        {
            _loggerRepository = loggerRepository;
        }

        public async Task<Unit> Handle(CreateLogEntryCommand request, CancellationToken cancellationToken)
        {
            _loggerRepository.Log(request.LogEntry);
            return await Task.FromResult(Unit.Value);
        }
    }
}
