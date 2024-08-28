using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs.Subjects
{
    public record InternStepViewModel
    {
        public Guid InternId { get; init; }
        public string InternName { get; init; }
        public string gender { get; set; }
        public string Status { get; init; }
    }
}
