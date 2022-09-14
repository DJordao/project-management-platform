using System.ComponentModel.DataAnnotations;

namespace ProjectManagementPlatform.Data.Entities
{
    public class Project
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [MaxLength(128)]
        public string Name { get; set; } = string.Empty;
        [Required]
        public float Budget { get; set; }
        [MaxLength(512)]
        public string Description { get; set; } = string.Empty;
        [Required]
        public ProjectManager? ProjectManager { get; set; } = new ProjectManager();
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
        public bool IsDeleted { get; set; } = false;
        public DateTime DeletedAt { get; set; }
    }
}
