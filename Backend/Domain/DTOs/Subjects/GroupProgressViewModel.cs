﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs.Subjects
{
    public record GroupProgressViewModel
    {
        public ICollection<SubjectProgressViewModel> Subjects { get; init; }
    }
}
