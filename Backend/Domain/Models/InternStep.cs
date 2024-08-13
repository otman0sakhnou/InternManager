 using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class InternStep
    {
        public Guid Id { get; set; }
        public string Status { get; set; }
        [ForeignKey("stepId")]
        public Guid StepId { get; set; }
        [ForeignKey("internId")]
        public Guid InternId { get; set; }
        public Step Step { get; set; }
        public Intern Intern { get; set; }

    }
}
