using Domain.DTOs;
using MediatR;

namespace Application.Services.Collaborator.Queries;

public record GetAllCollaboratorsQuery : IRequest<IEnumerable<CollaboratorRes>>;
  