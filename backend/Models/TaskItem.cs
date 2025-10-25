using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class TaskItem
    {
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; }

        public Guid ProjectId { get; set; }
        public Project Project { get; set; }

        public int EstimatedHours { get; set; } = 0;

        public string? DependenciesJson { get; set; }

        [NotMapped]
        public List<string> Dependencies
        {
            get => string.IsNullOrEmpty(DependenciesJson)
                ? new List<string>()
                : System.Text.Json.JsonSerializer.Deserialize<List<string>>(DependenciesJson);
            set => DependenciesJson = System.Text.Json.JsonSerializer.Serialize(value);
        }
    }
}
