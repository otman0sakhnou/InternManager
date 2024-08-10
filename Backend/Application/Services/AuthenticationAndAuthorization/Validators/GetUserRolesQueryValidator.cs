using Application.Services.AuthenticationAndAuthorization.Queries;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.AuthenticationAndAuthorization.Validators
{
    public class GetUserRolesQueryValidator : AbstractValidator<GetRolesQuery>
    {
        public GetUserRolesQueryValidator()
        {
            RuleFor(x => x.UserId).NotEmpty();
        }
    }
}
