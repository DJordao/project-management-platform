using System.ComponentModel.DataAnnotations;

namespace ProjectManagementPlatform.Models
{
    public class TaskModel
    {
        public int Id { get; set; }
        [Required, MaxLength(128)]
        public string? Name { get; set; }
        [Required]
        public DateTime? Deadline { get; set; }
        public bool State { get; set; }
        [MaxLength(512)]
        public string? Description { get; set; } = string.Empty;
        [Required]
        public int? ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        [Required]
        public int? DeveloperId { get; set; }
        public string DeveloperUserName { get; set; } = string.Empty;
    }
}
