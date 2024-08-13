using Domain.DTOs.Groups;
using Domain.Models;


namespace Domain.DTOs
{
    public record InternDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Institution { get; set; }
        public string Level { get; set; }
        public string Gender { get; set; }
        public string Specialization { get; set; }
        public int YearOfStudy { get; set; }
        public string Title { get; set; }
        public string Department { get; set; }
        public string UserId { get; set; }
        public ICollection<Period> Periods { get; set; }
        public ApplicationUser User { get; set; }
       
    }

}
