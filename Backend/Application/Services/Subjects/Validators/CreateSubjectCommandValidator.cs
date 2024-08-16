using Application.Services.Subjects.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Subjects.Validators
{
    public class CreateSubjectCommandValidator : AbstractValidator<CreateSubjectCommand>
    {
        public CreateSubjectCommandValidator()
        {
            // Validate Title
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.");
            //.MaximumLength(100).WithMessage("Title must not exceed 100 characters.");

            // Validate Type
            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Type is required.");
            // .MaximumLength(50).WithMessage("Type must not exceed 50 characters.");

            // Validate Description
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.");
                //.MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

            // Validate GroupId
            RuleFor(x => x.GroupId)
                .NotEmpty().WithMessage("GroupId is required.")
                .NotEqual(Guid.Empty).WithMessage("GroupId must be a valid GUID.");

            // Validate Steps
            RuleFor(x => x.Steps)
                .NotEmpty().WithMessage("At least one step is required.")
                .Must(steps => steps != null && steps.Count > 0).WithMessage("Steps collection must contain at least one step.");

            // Validate individual StepDto items in Steps collection
            RuleForEach(x => x.Steps)
                .ChildRules(steps =>
                {
                    steps.RuleFor(step => step.Description)
                         .NotEmpty().WithMessage("Step description is required.")
                         .MaximumLength(200).WithMessage("Step description must not exceed 200 characters.");
                });
        }
    }
}
