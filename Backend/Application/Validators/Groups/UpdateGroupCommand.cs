using Application.Services.GroupService.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators.Groups
{
    public class UpdateGroupCommandValidator : AbstractValidator<UpdateGroupCommand>
    {
        public UpdateGroupCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Group Id is required");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MinimumLength(3).WithMessage("Name must be at least 3 characters long");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required");

            RuleFor(x => x.ExpirationDate)
                .NotEmpty().WithMessage("Expiration date is required.")
                .GreaterThan(DateTime.Now).WithMessage("Expiration date must be in the future.");

            RuleFor(x => x.Department)
                .NotEmpty().WithMessage("Department is required");

            RuleFor(x => x.CollaboratorId)
                .NotEmpty().WithMessage("CollaboratorId is required");

            RuleFor(x => x.NewInternIds)
                .NotEmpty().WithMessage("At least one InternId is required")
                .Must(ids => ids.All(id => id != Guid.Empty)).WithMessage("All InternIds must be valid GUIDs");
        }
    }
}
