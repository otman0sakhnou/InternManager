using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs.Subjects
{
    public record StepStatusDto(Guid StepId, string Description, string Status);

    public record SubjectDetailsForInternDto(
        Guid SubjectId,
        string Title,
        string Type,
        string Description,
        List<StepStatusDto> Steps,
        double ProgressPercentage
    );
}
