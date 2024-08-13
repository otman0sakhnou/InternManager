using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace Domain.Models
{
    public class Group
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Department { get; set; }
        [ForeignKey("collaboratorId")]
        public Guid CollaboratorId { get; set; }

        [JsonIgnore]
        public Collaborator Collaborator { get; set; } // Navigation property

        public ICollection<Subject> Subjects { get; set; } // Navigation property
        public ICollection<Period> Periods { get; set; } // Navigation property
    }
}
