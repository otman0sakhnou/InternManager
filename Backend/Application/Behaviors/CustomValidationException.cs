using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Behaviors
{
    public class CustomValidationException : Exception
    {
        public ApiResponse<object> Response { get; }

        public CustomValidationException(ApiResponse<object> response) : base(response.ErrorMessage)
        {
            Response = response;
        }
    }
}
