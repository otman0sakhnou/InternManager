using Application.Repositories.Periods;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.PriodService.Queries
{
    public class GetInternIdsByGroupIdQuery : IRequest<List<Guid>>
    {
        public Guid GroupId { get; set; }
    }

    public class GetInternIdsByGroupIdQueryHandler : IRequestHandler<GetInternIdsByGroupIdQuery, List<Guid>>
    {
        private readonly IPeriodRepository _periodRepository;

        public GetInternIdsByGroupIdQueryHandler(IPeriodRepository periodRepository)
        {
            _periodRepository = periodRepository;
        }

        public async Task<List<Guid>> Handle(GetInternIdsByGroupIdQuery request, CancellationToken cancellationToken)
        {
            // Query the Periods table to get all intern IDs associated with the group
            var periods = await _periodRepository.GetByGroupIdAsync(request.GroupId);
            return periods.Select(p => p.InternId).Distinct().ToList();
        }
    }
}
