using Application.Repositories;
using Application.Services.Subjects.Commands;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Subjects.Commands
{
    public record UpdateSubjectCommand(
        Guid Id,
        string Title,
        string Type,
        string Description
    ) : IRequest<Unit>;

    public class UpdateSubjectHandler : IRequestHandler<UpdateSubjectCommand, Unit>
    {
        private readonly ISubjectRepository _subjectRepository;

        public UpdateSubjectHandler(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        public async Task<Unit> Handle(UpdateSubjectCommand request, CancellationToken cancellationToken)
        {
            var subject = await _subjectRepository.GetByIdAsync(request.Id);
            if (subject == null)
            {
                // Handle not found
                throw new KeyNotFoundException("Subject not found");
            }

            subject.Title = request.Title;
            subject.Type = request.Type;
            subject.Description = request.Description;

            _subjectRepository.Update(subject);
            return Unit.Value;
        }
    }
}
