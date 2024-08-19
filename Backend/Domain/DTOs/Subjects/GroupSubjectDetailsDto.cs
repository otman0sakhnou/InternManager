using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs.Subjects
{
    public record InternProgressDto(Guid InternId, string InternName, List<StepStatusDto> Steps, double ProgressPercentage);
    public record GroupSubjectDetailsDto(
    Guid SubjectId,
    string Title,
    string Type,
    string Description,
    double GroupProgressPercentage,
    List<InternProgressDto> InternsProgress
);
}
