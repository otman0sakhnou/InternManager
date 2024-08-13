using Application.Repositories;
using Application.Services.LoggerService.Commands; // Importer le namespace pour CreateLogEntryCommand
using Domain.Models;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services.InternService.Commands
{
    public class DeleteInternCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
    public class DeleteAllInternsCommand : IRequest<Unit>
    {
    }

    public class DeleteInternCommandHandler : IRequestHandler<DeleteInternCommand, Unit>
    {
        private readonly IInternRepository _internRepository;
        private readonly IMediator _mediator; // Ajouter une dépendance pour MediatR

        public DeleteInternCommandHandler(IInternRepository internRepository, IMediator mediator)
        {
            _internRepository = internRepository;
            _mediator = mediator;
        }

        public async Task<Unit> Handle(DeleteInternCommand request, CancellationToken cancellationToken)
        {
            // Supprimer le stagiaire
            await _internRepository.DeleteAsync(request.Id);

            // Créer une entrée de log
            var logEntry = new LogEntry
            {
                UserId = null, // Remplir si nécessaire (vous pouvez obtenir l'ID de l'utilisateur connecté si disponible)
                Action = "DeleteIntern",
                Timestamp = DateTime.UtcNow,
                Description = $"Intern with ID {request.Id} was deleted."
            };

            var createLogCommand = new CreateLogEntryCommand { LogEntry = logEntry };
            await _mediator.Send(createLogCommand); // Envoyer le command de log

            return Unit.Value;
        }
    }
    public class DeleteAllInternsCommandHandler : IRequestHandler<DeleteAllInternsCommand, Unit>
        {
            private readonly IInternRepository _internRepository;
            private readonly IMediator _mediator; // Ajouter une dépendance pour MediatR

            public DeleteAllInternsCommandHandler(IInternRepository internRepository, IMediator mediator)
            {
                _internRepository = internRepository;
                _mediator = mediator;
            }

            public async Task<Unit> Handle(DeleteAllInternsCommand request, CancellationToken cancellationToken)
            {
                // Supprimer tous les stagiaires
                await _internRepository.DeleteAllAsync();

                // Créer une entrée de log
                //var logEntry = new LogEntry
                //{
                //    UserId = null, // Remplir si nécessaire (vous pouvez obtenir l'ID de l'utilisateur connecté si disponible)
                //    Action = "DeleteAllInterns",
                //    Timestamp = DateTime.UtcNow,
                //    Description = "All interns were deleted."
                //};

                //var createLogCommand = new CreateLogEntryCommand { LogEntry = logEntry };
                //await _mediator.Send(createLogCommand); // Envoyer le command de log

                return Unit.Value;
            }
        
    }
}
    