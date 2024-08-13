using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Repositories;

namespace Application.Services.Subjects.Commands
{
    public record DeleteSubjectCommand(Guid Id) : IRequest<Unit>;
    public class DeleteSubjectHandler : IRequestHandler<DeleteSubjectCommand, Unit>
    {
        private readonly ISubjectRepository _subjectRepository;

        public DeleteSubjectHandler(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        public async Task<Unit> Handle(DeleteSubjectCommand request, CancellationToken cancellationToken)
        {
            var subject = await _subjectRepository.GetByIdAsync(request.Id);
            if (subject == null)
            {
                // Handle not found
                throw new KeyNotFoundException("Subject not found");
            }

            _subjectRepository.Delete(subject);
            return Unit.Value;
        }
    }
}
