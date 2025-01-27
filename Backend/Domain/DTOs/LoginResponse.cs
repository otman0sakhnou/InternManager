﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public record LoginResponse(
        string AccessToken, string RefreshToken, UserDto User, string[] Roles);
}
