using Application.Repositories;
using Application.Repositories.Periods;
using Application.Services.LoggerService.Commands;
using AutoMapper;
using Domain.Models;
using MediatR;
using System;
using System.Linq; // Pour utiliser les méthodes LINQ
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services.InternService.Commands
{
    public class UpdateInternCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Institution { get; set; }
        public string Level { get; set; }
        public string Gender { get; set; }
        public string Specialization { get; set; }
        public int YearOfStudy { get; set; }
        public string Title { get; set; }
        public string Department { get; set; }
        public DateTime StartDate { get; set; } 
        public DateTime EndDate { get; set; }
    }

    public class UpdateInternCommandHandler : IRequestHandler<UpdateInternCommand, Unit>
    {
        private readonly IInternRepository _internRepository;
        private readonly IPeriodRepository _periodRepository;
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public UpdateInternCommandHandler(
            IInternRepository internRepository,
            IPeriodRepository periodRepository,
            IMapper mapper,
            IMediator mediator)
        {
            _internRepository = internRepository;
            _periodRepository = periodRepository;
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task<Unit> Handle(UpdateInternCommand request, CancellationToken cancellationToken)
        {
            var intern = await _internRepository.GetByIdAsync(request.Id);
            if (intern == null)
            {
                throw new KeyNotFoundException("Intern not found");
            }

            _mapper.Map(request, intern);
            await _internRepository.UpdateAsync(intern);

            // Récupérer les périodes associées à l'intern
            var periods = await _periodRepository.GetByInternIdAsync(intern.Id);
            if (periods != null && periods.Any())
            {
                // Sélectionner la période avec la date de fin la plus éloignée
                var period = periods.OrderByDescending(p => p.EndDate).FirstOrDefault();

                if (period != null)
                {
                    // Mettre à jour les dates
                    period.StartDate = request.StartDate;
                    period.EndDate = request.EndDate;

                    await _periodRepository.UpdateAsync(period);
                }
            }

            // Créer une entrée de log
            var logEntry = new LogEntry
            {
                UserId = null,
                Action = "UpdateIntern",
                Timestamp = DateTime.UtcNow,
                Description = $"Intern with ID {request.Id} was updated, including period dates."
            };

            var createLogCommand = new CreateLogEntryCommand { LogEntry = logEntry };
            await _mediator.Send(createLogCommand);

            return Unit.Value;
        }
    }
}
