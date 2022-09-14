namespace ProjectManagementPlatform.Data.Entities
{
    public class Developer : User
    {
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
    }
}
