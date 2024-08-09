using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{   
    public class Subject
    {   
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        [ForeignKey("groupId")]
        public Guid GroupId { get; set; }

        public Group Group { get; set; } // Navigation property
        public ICollection<Step> Steps { get; set; } // Navigation property
    }
}

