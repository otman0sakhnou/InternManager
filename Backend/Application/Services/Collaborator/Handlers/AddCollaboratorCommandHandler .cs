using Application.Repositories;
using Application.Services.Collaborator.Commands;
using AutoMapper;
using Domain.DTOs;
using Domain.Models;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using ValidationException = FluentValidation.ValidationException;

namespace Application.Services.Collaborator.Handlers
{
    public class AddCollaboratorCommandHandler : IRequestHandler<AddCollaboratorCommand, Guid>
    {
        private readonly ICollaboratorRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CollaboratorReq> _validator;
        private readonly UserManager<ApplicationUser> _userManager;

        public AddCollaboratorCommandHandler(
            ICollaboratorRepository repository,
            IMapper mapper,
            IValidator<CollaboratorReq> validator,
            UserManager<ApplicationUser> userManager)
        {
            _repository = repository;
            _mapper = mapper;
            _validator = validator;
            _userManager = userManager;
        }

        public async Task<Guid> Handle(AddCollaboratorCommand request, CancellationToken cancellationToken)
        {
            var validationResult = await _validator.ValidateAsync(request.CollaboratorReq, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            //Check if the user exista
            var user = await _userManager.FindByIdAsync(request.CollaboratorReq.UserId);
            if (user == null)
            {
                var newUser = new ApplicationUser
                {
                    UserName = request.CollaboratorReq.Name,
                    Email = "default@example.com"
                };

                var result = await _userManager.CreateAsync(newUser, "DefaultPassword123!");

                if (!result.Succeeded)
                {
                    throw new ValidationException($"Failed to create user: {string.Join(", ", result.Errors)}");
                }

                user = newUser;
            }
            var collaborator = _mapper.Map<Domain.Models.Collaborator>(request.CollaboratorReq);
            collaborator.UserId = user.Id;

            await _repository.AddCollaborator(collaborator);
            return collaborator.Id;
        }
    }
}
