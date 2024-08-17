using Application.Repositories.Periods;
using Domain.Models;
using MediatR;


namespace Application.Services.PriodService.Queries
{
    public class GetLatestPeriodQuery : IRequest<Period>
    {
        public Guid InternId { get; set; }

        public GetLatestPeriodQuery(Guid internId)
        {
            InternId = internId;
        }
    }
    public class GetLatestPeriodQueryHandler : IRequestHandler<GetLatestPeriodQuery, Period>
    {
        private readonly IPeriodRepository _periodRepository;

        public GetLatestPeriodQueryHandler(IPeriodRepository periodRepository)
        {
            _periodRepository = periodRepository;
        }

        public async Task<Period> Handle(GetLatestPeriodQuery request, CancellationToken cancellationToken)
        {
            var periods = await _periodRepository.GetByInternIdAsync(request.InternId);
            return periods.OrderByDescending(p => p.EndDate).FirstOrDefault();
        }
    }

}
