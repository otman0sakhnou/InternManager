using Application.Repositories.Periods;
using Domain.Models;
using MediatR;


namespace Application.Services.PriodService.Queries
{
    public class GetPeriodByIdQuery : IRequest<Period>
    {
        public Guid Id { get; set; }
    }
    public class GetPeriodByIdQueryHandler : IRequestHandler<GetPeriodByIdQuery, Period>
    {
        private readonly IPeriodRepository _periodRepository;

        public GetPeriodByIdQueryHandler(IPeriodRepository periodRepository)
        {
            _periodRepository = periodRepository;
        }

        public async Task<Period> Handle(GetPeriodByIdQuery request, CancellationToken cancellationToken)
        {
            return await _periodRepository.GetByIdAsync(request.Id);
        }
    }
}
