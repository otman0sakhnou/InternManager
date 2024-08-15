using Application.Repositories;
using Domain.Models;
using MediatR;

namespace Application.Services.InternService.Queries
{
    public class GetInternByIdQuery : IRequest<Intern>
    {
        public Guid Id { get; set; }
    }

    public class GetInternByIdQueryHandler : IRequestHandler<GetInternByIdQuery, Intern>
    {
        private readonly IInternRepository _internRepository;

        public GetInternByIdQueryHandler(IInternRepository internRepository)
        {
            _internRepository = internRepository;
        }

        public async Task<Intern> Handle(GetInternByIdQuery request, CancellationToken cancellationToken)
        {
            return await _internRepository.GetByIdAsync(request.Id);
        }
    }

    public class GetAllInternsQuery : IRequest<IEnumerable<Intern>>
    {
    }

    public class GetAllInternsQueryHandler : IRequestHandler<GetAllInternsQuery, IEnumerable<Intern>>
    {
        private readonly IInternRepository _internRepository;

        public GetAllInternsQueryHandler(IInternRepository internRepository)
        {
            _internRepository = internRepository;
        }

        public async Task<IEnumerable<Intern>> Handle(GetAllInternsQuery request, CancellationToken cancellationToken)
        {
            return await _internRepository.GetAllAsync();
        }
    }
}
