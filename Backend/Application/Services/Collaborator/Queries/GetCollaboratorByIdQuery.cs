using Domain.DTOs;
using MediatR;

namespace Application.Services.Collaborator.Queries;

public record GetCollaboratorByIdQuery(Guid Id) : IRequest<CollaboratorRes>;
