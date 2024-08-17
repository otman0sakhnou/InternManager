namespace Domain.DTOs;

 public record CollaboratorRes(Guid Id, string Name, string Phone, string Title, string Department, string Organization, DateTime EmploymentDate, string Gender, string UserId);