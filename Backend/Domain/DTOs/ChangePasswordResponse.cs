﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public record ChangePasswordResponse(bool Success, string Message, string[] Errors = null);
}
