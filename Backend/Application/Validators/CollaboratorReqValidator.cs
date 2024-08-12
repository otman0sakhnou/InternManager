using System;
using Domain.DTOs;
using FluentValidation;

namespace Application.Validators
{
    public class CollaboratorReqValidator : AbstractValidator<CollaboratorReq>
    {
        public CollaboratorReqValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Phone number is required.")
                .Matches(@"^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\(0\)[\s]?)?)|0){1}(?:5[\s.-]?[2-3]|6[\s.-]?[13-9]){1}[0-9]{1}(?:[\s.-]?\d{2}){3}$")
                .WithMessage("Invalid phone number format.");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.");

            RuleFor(x => x.Department)
                .NotEmpty().WithMessage("Department is required.");

            RuleFor(x => x.Organization)
                .NotEmpty().WithMessage("Organization is required.");

            RuleFor(x => x.EmploymentDate)
                .NotEmpty().WithMessage("Employment Date is required.");

            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender is required.");

        }
    }
}
