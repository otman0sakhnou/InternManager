using Domain.DTOs;
using MediatR;

namespace Application.Services.Collaborator.Commands;

public record AddCollaboratorCommand(CollaboratorReq CollaboratorReq) : IRequest<Guid>; 