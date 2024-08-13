using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models
{
    public class Collaborator
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Title { get; set; }
        public string Department { get; set; }
        public string Organization { get; set; }
        public DateTime EmploymentDate { get; set; }
        public string Gender { get; set; }
        [ForeignKey("userId")]
        public string UserId { get; set; }

        public ApplicationUser User { get; set; } 
        public ICollection<Group> Groups { get; set; } 
    }
}
