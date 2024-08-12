using Domain.DTOs;
using MediatR;

namespace Application.Services.Collaborator.Commands;

 public record UpdateCollaboratorCommand(CollaboratorReq CollaboratorReq) : IRequest<bool>;
