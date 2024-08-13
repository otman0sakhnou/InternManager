using Domain.DTOs.Periods;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.DTOs.Groups
{
    public record GroupDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public string Description { get; init; }
        public DateTime ExpirationDate { get; init; }
        public string Department { get; init; }
        public Guid CollaboratorId { get; init; }

        public Collaborator Collaborator { get; init; }
        public IEnumerable<Subject> Subjects { get; init; }
        public IEnumerable<PeriodDto> Periods { get; init; }
    }
}
