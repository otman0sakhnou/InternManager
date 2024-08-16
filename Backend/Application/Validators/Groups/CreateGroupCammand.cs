using Application.Services.GroupService.Commands;
using FluentValidation;


namespace Application.Validators.Groups
{
    public class CreateGroupCommandValidator : AbstractValidator<CreateGroupCommand>
    {
        public CreateGroupCommandValidator()
        {
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

            RuleFor(x => x.InternIds)
                .NotEmpty().WithMessage("At least one InternId is required")
                .Must(ids => ids.All(id => id != Guid.Empty)).WithMessage("All InternIds must be valid GUIDs");
        }
    }
}