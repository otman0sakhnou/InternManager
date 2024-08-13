using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Period
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [ForeignKey("internId")]
        public Guid InternId { get; set; }

        [ForeignKey("groupId")]
        public Guid? GroupId { get; set; }
        [JsonIgnore]
        public Intern Intern { get; set; } // Navigation property
        [JsonIgnore]
        public Group Group { get; set; } // Navigation property
    }
}
