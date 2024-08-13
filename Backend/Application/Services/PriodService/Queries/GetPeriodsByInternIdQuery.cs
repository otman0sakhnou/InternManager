using Application.Repositories.Periods;
using Domain.Models;
using MediatR;


namespace Application.Services.PriodService.Queries
{
    public class GetPeriodsByInternIdQuery : IRequest<IEnumerable<Period>>
    {
        public Guid InternId { get; set; }
    }
    public class GetPeriodsByInternIdQueryHandler : IRequestHandler<GetPeriodsByInternIdQuery, IEnumerable<Period>>
    {
        private readonly IPeriodRepository _periodRepository;

        public GetPeriodsByInternIdQueryHandler(IPeriodRepository periodRepository)
        {
            _periodRepository = periodRepository;
        }

        public async Task<IEnumerable<Period>> Handle(GetPeriodsByInternIdQuery request, CancellationToken cancellationToken)
        {
            return await _periodRepository.GetByInternIdAsync(request.InternId);
        }
    }
}
