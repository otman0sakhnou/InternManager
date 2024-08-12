using System;
using Application.Repositories;
using Application.Services.Collaborator.Commands;
using AutoMapper;
using Domain.DTOs;
using FluentValidation;
using MediatR;

namespace Application.Services.Collaborator.Handlers;

public class UpdateCollaboratorCommandHandler : IRequestHandler<UpdateCollaboratorCommand, bool>
    {
        private readonly ICollaboratorRepository _repository;
        private readonly IMapper _mapper;
        private readonly IValidator<CollaboratorReq> _validator;

        public UpdateCollaboratorCommandHandler(ICollaboratorRepository repository, IMapper mapper, IValidator<CollaboratorReq> validator)
        {
            _repository = repository;
            _mapper = mapper;
            _validator = validator;
        }

        public async Task<bool> Handle(UpdateCollaboratorCommand request, CancellationToken cancellationToken)
        {
         
            var validationResult = await _validator.ValidateAsync(request.CollaboratorReq, cancellationToken);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var existingCollaborator = await _repository.GetCollaboratorById(request.CollaboratorReq.Id);
            if (existingCollaborator == null) return false;

            _mapper.Map(request.CollaboratorReq, existingCollaborator);
            await _repository.UpdateCollaborator(existingCollaborator);

            return true;
        }
    }