namespace ProjectManagementPlatform.Data.Entities
{
    public class ProjectManager : User
    {
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
