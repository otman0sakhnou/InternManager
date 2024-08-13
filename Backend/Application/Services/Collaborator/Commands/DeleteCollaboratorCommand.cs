using MediatR;

namespace Application.Services.Collaborator.Commands;
public record DeleteCollaboratorCommand(Guid Id) : IRequest<bool>;
