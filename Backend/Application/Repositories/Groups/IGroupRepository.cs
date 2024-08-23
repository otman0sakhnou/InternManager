using Domain.Models;


namespace Application.Repositories.Groups
{
    public interface IGroupRepository
    {
        Task<Group> GetByIdAsync(Guid id);
        Task<IEnumerable<Group>> GetAllAsync();
        Task AddAsync(Group group);
        Task UpdateAsync(Group group);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<Group>> GetGroupsByDepartmentAsync(string department);
        Task<IEnumerable<Group>> GetGroupsByCollaboratorIdAsync(Guid collaboratorId);
        Task<IEnumerable<Group>> GetGroupsByInternIdAsync(Guid internId);
    }
}
