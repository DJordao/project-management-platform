using System.ComponentModel.DataAnnotations;

namespace ProjectManagementPlatform.Data.Entities
{
    public class Task
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [MaxLength(128)]
        public string Name { get; set; } = string.Empty;
        [Required]
        public DateTime Deadline { get; set; }
        [Required]
        public bool State { get; set; } = false;
        [MaxLength(512)]
        public string Description { get; set; } = string.Empty;
        [Required]
        public Project Project { get; set; } = new Project();
        [Required]
        public Developer? Developer { get; set; } = new Developer();
        public bool IsDeleted { get; set; } = false;
        public DateTime DeletedAt { get; set; }
    }
}
