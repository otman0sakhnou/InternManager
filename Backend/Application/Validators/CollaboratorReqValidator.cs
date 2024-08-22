using System;
using Domain.DTOs;
using FluentValidation;

namespace Application.Validators
{
    public class CollaboratorReqValidator : AbstractValidator<CollaboratorReq>
    {
        public CollaboratorReqValidator()
        {
            RuleFor(x => x.Name).NotEmpty().When(x => x.Name != null).WithMessage("Name is required.");
            RuleFor(x => x.Phone).NotEmpty().When(x => x.Phone != null).WithMessage("Phone number is required.").Matches(@"^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\(0\)[\s]?)?)|0){1}(?:5[\s.-]?[2-3]|6[\s.-]?[13-9]){1}[0-9]{1}(?:[\s.-]?\d{2}){3}$").WithMessage("Invalid phone number format.");
            RuleFor(x => x.Title).NotEmpty().When(x => x.Title != null).WithMessage("Title is required.");
            RuleFor(x => x.Gender).NotEmpty().When(x => x.Gender != null).WithMessage("Gender is required.");
            RuleFor(x => x.Organization).NotEmpty().When(x => x.Organization != null).WithMessage("Organization is required.");
            RuleFor(x => x.EmploymentDate).NotEmpty().When(x => x.EmploymentDate != null).WithMessage("Employment Date is required.");

        }
    }
}
