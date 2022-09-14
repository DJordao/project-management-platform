using ProjectManagementPlatform.Data.Entities;

namespace ProjectManagementPlatform.Data
{
    public interface IRepository
    {
        void AddEntity(object model);
        void DeleteUser(User model);
        void DeleteProject(Project model);
        void DeleteTask(Entities.Task model);
        void SaveAll();

        IEnumerable<Project> GetProjects();
        Project? GetProjectById(int id);
        IEnumerable<Entities.Task>? GetProjectTasksById(int projectId);
        Entities.Task? GetProjectTaskById(int projectId, int id);

        IEnumerable<ProjectManager> GetProjectManagers();
        ProjectManager? GetProjectManagerById(int id);
        ProjectManager? GetProjectManagerByUserName(string username);

        IEnumerable<Developer> GetDevelopers();
        Developer? GetDeveloperById(int id);
        Developer? GetDeveloperByUserName(string developerUserName);
        IEnumerable<Entities.Task>? GetDeveloperTasksByUserName(string username);
        Entities.Task? GetDeveloperTaskById(string username, int choreId);
    }
}