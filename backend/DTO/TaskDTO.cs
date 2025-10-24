using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class TaskDTO
    {
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; }

        [Required]
        public Guid ProjectId { get; set; }
    }
}
