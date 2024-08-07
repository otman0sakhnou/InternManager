using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternManagerApi.Domain.Models
{
    public class Intern
    {
        public Guid Id { get; set; }
        public string Name { get; set; } 
        public string Phone { get; set; }
        public string Institution { get; set; }
        public string Level { get; set; }
        public string Gender { get; set; }
        public string Specialization { get; set; }
        public int YearOfStudy { get; set; }
        public string Title { get; set; }
        public string Department { get; set; }
        //public int PeriodId { get; set; }
        [ForeignKey("userId")]
        public Guid UserId { get; set; }

        public ICollection<Period> Periods { get; set; } // Navigation property
        public ApplicationUser User { get; set; } // Navigation property
        public ICollection<InternStep> InternSteps { get; set; } // Navigation property
    }
}

