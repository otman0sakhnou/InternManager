using Application.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.AuthenticationAndAuthorization.Queries
{
    public record GetInternIdByUserIdQuery(Guid UserId) : IRequest<Guid?>;

    public class GetInternIdByUserIdQueryHandler : IRequestHandler<GetInternIdByUserIdQuery, Guid?>
    {
        private readonly IInternRepository _internRepository;

        public GetInternIdByUserIdQueryHandler(IInternRepository internRepository)
        {
            _internRepository = internRepository;
        }

        public async Task<Guid?> Handle(GetInternIdByUserIdQuery request, CancellationToken cancellationToken)
        {
            return await _internRepository.GetInternIdByUserId(request.UserId);
        }
    }
}
