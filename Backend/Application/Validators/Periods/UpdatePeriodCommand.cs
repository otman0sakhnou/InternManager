using FluentValidation;
using Application.Services.PriodService.Commands;

namespace Application.Validators.Periods
{
    public class UpdatePeriodCommandValidator : AbstractValidator<UpdatePeriodCommand>
    {
        public UpdatePeriodCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Period ID is required.");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start date is required.");
               

            RuleFor(x => x.EndDate)
                .NotEmpty().WithMessage("End date is required.")
                .GreaterThan(DateTime.Now).WithMessage("End date must be in the future.");

            RuleFor(x => x)
                .Must(x => x.StartDate < x.EndDate)
                .WithMessage("Start date must be before the end date.");

            RuleFor(x => x.InternId)
                .NotEmpty().WithMessage("Intern ID is required.");

           
        }
    }
}
