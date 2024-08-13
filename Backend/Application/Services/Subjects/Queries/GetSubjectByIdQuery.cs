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
    public record GetSubjectByIdQuery(Guid Id) : IRequest<Subject>;
    public class GetSubjectByIdQueryHandler : IRequestHandler<GetSubjectByIdQuery, Subject>
    {
        private readonly ISubjectRepository _subjectRepository;

        public GetSubjectByIdQueryHandler(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        public async Task<Subject> Handle(GetSubjectByIdQuery request, CancellationToken cancellationToken)
        {
            var subject = await _subjectRepository.GetByIdAsync(request.Id);
            if (subject == null)
            {
                throw new Exception("Subject not found");
            }

            return subject;
        }
    }
}
