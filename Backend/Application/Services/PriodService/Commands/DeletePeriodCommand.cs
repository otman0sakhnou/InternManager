using Application.Repositories.Periods;
using Domain.Models;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services.PriodService.Commands
{
    public class DeletePeriodCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeletePeriodCommandHandler : IRequestHandler<DeletePeriodCommand,Unit>
    {
        private readonly IPeriodRepository _periodRepository;

        public DeletePeriodCommandHandler(IPeriodRepository periodRepository)
        {
            _periodRepository = periodRepository;
        }

        public async Task<Unit> Handle(DeletePeriodCommand request, CancellationToken cancellationToken)
        {
            var period = await _periodRepository.GetByIdAsync(request.Id);
            if (period == null)
            {
                throw new KeyNotFoundException("Period not found");
            }

            await _periodRepository.DeleteAsync(period);
            return Unit.Value; // Retourne une unité pour indiquer que la commande a été exécutée avec succès.
        }
    }
}
