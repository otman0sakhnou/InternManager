using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public Collaborator Collaborator { get; set; } // Navigation property

        public ICollection<Subject> Subjects { get; set; } // Navigation property
        public ICollection<Period> Periods { get; set; } // Navigation property
    }
}
