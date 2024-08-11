using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public record ResetPasswordResponse(bool Success, string Message, IEnumerable<string> Errors);
}
