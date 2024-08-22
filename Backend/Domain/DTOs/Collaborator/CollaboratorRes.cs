using Domain.Models;

namespace Domain.DTOs;

public record CollaboratorRes(Guid Id, string Name, string Phone, string Title, string Department, string Organization, DateOnly EmploymentDate, string Gender, ICollection<Group> Groups, ApplicationUser User, string UserId);