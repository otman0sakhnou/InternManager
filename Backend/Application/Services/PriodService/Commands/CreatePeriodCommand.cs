using Application.Repositories.Periods;
using Domain.Models;
using MediatR;
using AutoMapper;


namespace Application.Services.PriodService.Commands
{
    public class CreatePeriodCommand : IRequest<Guid>
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid InternId { get; set; }
        public Guid? GroupId { get; set; }
    }

    public class CreatePeriodCommandHandler : IRequestHandler<CreatePeriodCommand, Guid>
    {
        private readonly IPeriodRepository _periodRepository;
        private readonly IMapper _mapper;

        public CreatePeriodCommandHandler(IPeriodRepository periodRepository, IMapper mapper)
        {
            _periodRepository = periodRepository;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreatePeriodCommand request, CancellationToken cancellationToken)
        {
            // Mapper la commande vers l'entité Period
            var period = _mapper.Map<Period>(request);

            // Définir l'ID de la période
            period.Id = Guid.NewGuid();

            await _periodRepository.AddAsync(period);
            return period.Id;
        }
    }
}
