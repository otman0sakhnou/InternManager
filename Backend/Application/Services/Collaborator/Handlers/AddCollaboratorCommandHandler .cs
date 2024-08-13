using Application.Repositories;
using Application.Services.AuthenticationAndAuthorization.Commands;
using Application.Services.AuthenticationAndAuthorization.Common;
using Application.Services.Collaborator.Commands;
using AutoMapper;
using Domain.DTOs;
using Domain.Models;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Win32;
using ValidationException = FluentValidation.ValidationException;

namespace Application.Services.Collaborator.Handlers
{
    public class AddCollaboratorCommandHandler : IRequestHandler<AddCollaboratorCommand, Guid>
    {
        private readonly ICollaboratorRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CollaboratorReq> _validator;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMediator _mediator; 
        private readonly IEmailService _emailService; 

        public AddCollaboratorCommandHandler(
            ICollaboratorRepository repository,
            IMapper mapper,
            IValidator<CollaboratorReq> validator,
            UserManager<ApplicationUser> userManager,
            IMediator mediator,
            IEmailService emailService)
        {
            _repository = repository;
            _mapper = mapper;
            _validator = validator;
            _userManager = userManager;
            _mediator = mediator;
            _emailService = emailService;
        }

        public async Task<Guid> Handle(AddCollaboratorCommand request, CancellationToken cancellationToken)
        {
            var validationResult = await _validator.ValidateAsync(request.CollaboratorReq, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            //Check if the user exists
            var user = await _userManager.FindByIdAsync(request.CollaboratorReq.UserId);
            if (user == null)
            {
                
                var registerCommand = new RegisterCommand("DefaultPassword123!", request.CollaboratorReq.Email);
                var registerResult = await _mediator.Send(registerCommand, cancellationToken);

                if (!registerResult.Success)
                {
                    throw new ValidationException($"Failed to create user: {string.Join(", ", registerResult.Errors)}");
                }

                user = await _userManager.FindByIdAsync(registerResult.UserId);
                if (user == null)
                {
                    throw new ValidationException("User creation failed.");
                }
            }
            var collaborator = _mapper.Map<Domain.Models.Collaborator>(request.CollaboratorReq);
            collaborator.UserId = user.Id;
            await _repository.AddCollaborator(collaborator);

            if(!string.IsNullOrEmpty(request.CollaboratorReq.Role))
    {
                var assignRoleCommand = new AssignRoleCommand(user.Id, request.CollaboratorReq.Role);
                var assignRoleResult = await _mediator.Send(assignRoleCommand, cancellationToken);

                if (!assignRoleResult.Success)
                {
                    throw new ValidationException($"Failed to assign role: {string.Join(", ", assignRoleResult.Errors)}");
                }
            }


            return collaborator.Id;
        }
    }
}
