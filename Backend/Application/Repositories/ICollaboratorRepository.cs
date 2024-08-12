using System;
using Domain.Models;

namespace Application.Repositories;

public interface ICollaboratorRepository
{
  Task<Collaborator> GetCollaboratorById(Guid id);
  Task<IEnumerable<Collaborator>> GetAllCollaborator();
  Task AddCollaborator(Collaborator collaborator);
  Task UpdateCollaborator(Collaborator collaborator);
  Task DeleteCollaborator(Guid id);
}