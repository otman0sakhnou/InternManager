using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class RefreshToken
    {
        [Key]
        public string Token { get; set; }
        [ForeignKey("userId")]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public DateTime ExpirationDate { get; set; }
        public bool IsRevoked { get; set; }
        
    }
}
