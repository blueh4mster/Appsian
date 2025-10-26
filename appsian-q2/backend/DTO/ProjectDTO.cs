using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ProjectDTO
    {
        public Guid Id { get; set; }  

        [Required]
        [MinLength(3)]
        [MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
