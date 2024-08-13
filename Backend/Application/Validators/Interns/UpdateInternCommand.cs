
using FluentValidation;

using Application.Services.InternService.Commands;

namespace Application.Validators.Interns
{
    public class UpdateInternCommandValidator : AbstractValidator<UpdateInternCommand>
    {
        public UpdateInternCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MinimumLength(3).WithMessage("Name must be at least 3 characters long");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Phone number is required")
                .Matches(@"^\d{10,}$").WithMessage("Phone number must be at least 10 digits long");

            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender is required");

            RuleFor(x => x.Institution)
                .NotEmpty().WithMessage("Institution is required");

            RuleFor(x => x.Level)
                .NotEmpty().WithMessage("Level is required");

            RuleFor(x => x.Specialization)
                .NotEmpty().WithMessage("Specialization is required");

            RuleFor(x => x.YearOfStudy)
                .NotEmpty().WithMessage("Year of study is required")
                .GreaterThan(1900).WithMessage("Year of study must be after 1900")
                .LessThanOrEqualTo(DateTime.Now.Year).WithMessage("Year of study cannot be in the future");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Internship Title is required");

            RuleFor(x => x.Department)
                .NotEmpty().WithMessage("Department is required");

          
        }
    }
}
