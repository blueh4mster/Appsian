using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string Username { get; set; }

        [Required, MinLength(6)]
        public string PasswordHash { get; set; }

        public ICollection<Project> Projects { get; set; }
    }
}
