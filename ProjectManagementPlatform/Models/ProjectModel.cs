using System.ComponentModel.DataAnnotations;

namespace ProjectManagementPlatform.Models
{
    public class ProjectModel
    {
        public int Id { get; set; }
        [Required, MaxLength(128)]
        public string? Name { get; set; }
        [Required]
        public float? Budget { get; set; }
        [MaxLength(512)]
        public string Description { get; set; } = string.Empty;
        public string ProjectManagerUserName { get; set; } = string.Empty;
        public ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
    }
}
