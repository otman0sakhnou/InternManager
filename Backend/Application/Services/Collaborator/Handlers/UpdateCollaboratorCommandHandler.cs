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

    public UpdateCollaboratorCommandHandler(ICollaboratorRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<bool> Handle(UpdateCollaboratorCommand request, CancellationToken cancellationToken)
    {

        var existingCollaborator = await _repository.GetCollaboratorById(request.CollaboratorReq.Id);
        if (existingCollaborator == null) return false;

        //update only for the provided values
        existingCollaborator.Name = request.CollaboratorReq.Name ?? existingCollaborator.Name;
        existingCollaborator.Phone = request.CollaboratorReq.Phone ?? existingCollaborator.Phone;
        existingCollaborator.Title = request.CollaboratorReq.Title ?? existingCollaborator.Title;
        existingCollaborator.Department = request.CollaboratorReq.Department ?? existingCollaborator.Department;
        existingCollaborator.Organization = request.CollaboratorReq.Organization ?? existingCollaborator.Organization;
        existingCollaborator.EmploymentDate = request.CollaboratorReq.EmploymentDate ?? existingCollaborator.EmploymentDate;
        existingCollaborator.Gender = request.CollaboratorReq.Gender ?? existingCollaborator.Gender;
        existingCollaborator.UserId = request.CollaboratorReq.UserId ?? existingCollaborator.UserId;

        await _repository.UpdateCollaborator(existingCollaborator);

        return true;
    }
}
