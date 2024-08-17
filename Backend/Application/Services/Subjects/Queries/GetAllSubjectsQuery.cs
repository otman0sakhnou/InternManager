using Application.Repositories;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Subjects.Queries
{
    public record GetAllSubjectsQuery() : IRequest<IEnumerable<Subject>>;
    public class GetAllSubjectsQueryHandler : IRequestHandler<GetAllSubjectsQuery, IEnumerable<Subject>>
    {
        private readonly ISubjectRepository _subjectRepository;

        public GetAllSubjectsQueryHandler(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        public async Task<IEnumerable<Subject>> Handle(GetAllSubjectsQuery request, CancellationToken cancellationToken)
        {
            return await _subjectRepository.GetAllAsync();
        }
    }
}
