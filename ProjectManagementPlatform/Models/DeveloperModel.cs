namespace ProjectManagementPlatform.Models
{
    public class DeveloperModel : UserModel
    {
        public ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
    }
}
