using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Step
    {
        public Guid Id { get; set; }
        public string Description { get; set; }

        [ForeignKey("subjectId")]
        public Guid SubjectId { get; set; }

        [JsonIgnore]
        public Subject Subject { get; set; }
        public ICollection<InternStep> InternSteps { get; set; } // Navigation property
    }
}
