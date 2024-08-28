using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs.Subjects
{
    public record SubjectProgressViewModel
    {
        public Guid SubjectId { get; init; }
        public string Title { get; init; }
        public ICollection<StepProgressViewModel> Steps { get; init; }
        public string SubjectProgress { get; init; } // Average progress across all steps
    }
}
