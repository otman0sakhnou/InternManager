using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs.Subjects
{
    public record StepProgressViewModel
    {
        public Guid StepId { get; init; }
        public string Description { get; init; }
        public ICollection<InternStepViewModel> CompletedByInterns { get; init; }
        public string StepProgress { get; init; } // Progress for this specific step
    }
}
