using Application.Repositories.Periods;

using MediatR;
using AutoMapper;


namespace Application.Services.PriodService.Commands
{
    public class UpdatePeriodCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid InternId { get; set; }
        public Guid? GroupId { get; set; }
    }

    public class UpdatePeriodCommandHandler : IRequestHandler<UpdatePeriodCommand,Unit>
    {
        private readonly IPeriodRepository _periodRepository;
        private readonly IMapper _mapper;

        public UpdatePeriodCommandHandler(IPeriodRepository periodRepository, IMapper mapper)
        {
            _periodRepository = periodRepository;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdatePeriodCommand request, CancellationToken cancellationToken)
        {
            // Récupérer la période existante
            var period = await _periodRepository.GetByIdAsync(request.Id);
            if (period == null)
            {
                throw new KeyNotFoundException("Period not found");
            }

            // Mapper les propriétés de la commande vers l'entité existante
            _mapper.Map(request, period);

            // Mettre à jour la période dans la base de données
            await _periodRepository.UpdateAsync(period);

            return Unit.Value;
        }
    }
}
