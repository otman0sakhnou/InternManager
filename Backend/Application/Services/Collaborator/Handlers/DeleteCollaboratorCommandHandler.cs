using System;
using Application.Repositories;
using Application.Services.Collaborator.Commands;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Services.Collaborator.Handlers;

public class DeleteCollaboratorCommandHandler(ICollaboratorRepository repository, UserManager<ApplicationUser> userManager) : IRequestHandler<DeleteCollaboratorCommand, bool>
{
    private readonly ICollaboratorRepository _repository = repository;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<bool> Handle(DeleteCollaboratorCommand request, CancellationToken cancellationToken)
    {
        var collaborator = await _repository.GetCollaboratorById(request.Id);
        if (collaborator == null) return false;

        var user = await _userManager.FindByIdAsync(collaborator.UserId);
        if(user !=null) await _userManager.DeleteAsync(user);

        await _repository.DeleteCollaborator(collaborator.Id);
        return true;
    }
} 