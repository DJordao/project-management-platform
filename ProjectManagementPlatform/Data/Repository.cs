using Microsoft.EntityFrameworkCore;
using ProjectManagementPlatform.Data.Entities;

namespace ProjectManagementPlatform.Data
{
    public class Repository : IRepository
    {
        private readonly Context _ctx;
        private readonly ILogger<Repository> _logger;

        public Repository(Context ctx, ILogger<Repository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public void AddEntity(object model)
        {
            try
            {
                _ctx.Add(model);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to add entity: {ex}");
                throw new Exception($"Failed to add entity: {ex}");
            }
        }

        public void DeleteUser(User model)
        {
            try
            {
                model.IsDeleted = true;
                model.DeletedAt = DateTime.Now;
                if(model is ProjectManager)
                {
                    ProjectManager pm = (ProjectManager)model;
                    foreach(Project p in pm.Projects)
                    {
                        p.IsDeleted = true;
                        p.DeletedAt = DateTime.Now;
                        foreach (Entities.Task t in p.Tasks)
                        {
                            t.IsDeleted = true;
                            t.DeletedAt = DateTime.Now;
                        }
                    }
                }
                else if(model is Developer)
                {
                    Developer d = (Developer)model;
                    foreach (Entities.Task t in d.Tasks)
                    {
                        t.IsDeleted = true;
                        t.DeletedAt = DateTime.Now;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to delete user: {ex}");
                throw new Exception($"Failed to delete user: {ex}");
            }
        }

        public void DeleteProject(Project model)
        {
            try
            {
                model.IsDeleted = true;
                model.DeletedAt = DateTime.Now;
                foreach(Entities.Task t in model.Tasks)
                {
                    t.IsDeleted = true;
                    t.DeletedAt = DateTime.Now;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to delete project: {ex}");
                throw new Exception($"Failed to delete project: {ex}");
            }
        }

        public void DeleteTask(Entities.Task model)
        {
            try
            {
                model.IsDeleted = true;
                model.DeletedAt = DateTime.Now;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to delete task: {ex}");
                throw new Exception($"Failed to delete task: {ex}");
            }
        }

        public void SaveAll()
        {
            try
            {
                if(_ctx.SaveChanges() <= 0)
                {
                    _logger.LogError("No changes were made");
                    throw new Exception("No changes were made");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to save changes: {ex}");
                throw new Exception($"Failed to save changes: {ex}");
            }
            
        }

        public IEnumerable<Project> GetProjects()
        {
            try
            {
                return _ctx.Project.Where(p => !p.IsDeleted).Include(p => p.ProjectManager).Include(p => p.Tasks.Where(t => !t.IsDeleted)).ThenInclude(t => t.Developer).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get projects: {ex}");
                throw new Exception("Failed to get projects");
            }
        }

        public Project? GetProjectById(int id)
        {
            try
            {
                return _ctx.Project.Where(p => !p.IsDeleted).Include(p => p.ProjectManager).Include(p => p.Tasks.Where(t => !t.IsDeleted)).ThenInclude(t => t.Developer).Where(p => p.Id == id).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get project: {ex}");
                throw new Exception("Failed to get project");
            }
        }

        public IEnumerable<Entities.Task>? GetProjectTasksById(int projectId)
        {
            try
            {
                if(GetProjectById(projectId) != null)
                {
                    return _ctx.Task.Where(t => !t.IsDeleted).Where(t => t.Project.Id == projectId).Include(t => t.Project).Include(t => t.Developer).ToList();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get project tasks: {ex}");;
                throw new Exception($"Failed to get project tasks: {ex}");
            }
        }

        public Entities.Task? GetProjectTaskById(int projectId, int id)
        {
            try
            {
                if (GetProjectById(projectId) != null)
                {
                    return _ctx.Task.Where(t => !t.IsDeleted).Where(t => t.Project.Id == projectId).Where(t => t.Id == id).Include(t => t.Project).Include(t => t.Developer).FirstOrDefault();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get project task: {ex}");
                throw new Exception($"Failed to get project task: {ex}");
            }
        }

        public IEnumerable<ProjectManager> GetProjectManagers()
        {
            try
            {
                return _ctx.ProjectManager.Where(pm => !pm.IsDeleted).Include(pm => pm.Projects.Where(p => !p.IsDeleted)).ThenInclude(p => p.Tasks.Where(t => !t.IsDeleted)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get project managers: {ex}");
                throw new Exception("Failed to get project managers");
            }
        }

        public ProjectManager? GetProjectManagerById(int id)
        {
            try
            {
                return _ctx.ProjectManager.Where(pm => !pm.IsDeleted).Include(pm => pm.Projects.Where(p => !p.IsDeleted)).ThenInclude(p => p.Tasks.Where(t => !t.IsDeleted)).Where(pm => pm.Id == id).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get project manager: {ex}");
                throw new Exception($"Failed to get project manager: {ex}");
            }
        }

        public ProjectManager? GetProjectManagerByUserName(string username)
        {
            try
            {
                return _ctx.ProjectManager.Where(pm => !pm.IsDeleted).Include(pm => pm.Projects.Where(p => !p.IsDeleted)).ThenInclude(p => p.Tasks.Where(t => !t.IsDeleted)).Where(pm => pm.UserName == username).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get project manager: {ex}");
                throw new Exception("Failed to get project manager");
            }
        }

        public IEnumerable<Developer> GetDevelopers()
        {
            try
            {
                return _ctx.Developer.Where(d => !d.IsDeleted).Include(d => d.Tasks.Where(t => !t.IsDeleted)).ThenInclude(c => c.Project).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get developers: {ex}");
                throw new Exception("Failed to get developers");
            }
        }

        public Developer? GetDeveloperById(int id)
        {
            try
            {
                return _ctx.Developer.Where(d => !d.IsDeleted).Include(d => d.Tasks.Where(t => !t.IsDeleted)).ThenInclude(c => c.Project).Where(d => d.Id == id).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get developer: {ex}");
                throw new Exception($"Failed to get developer: {ex}");
            }
        }

        public Developer? GetDeveloperByUserName(string username)
        {
            try
            {
                return _ctx.Developer.Where(d => !d.IsDeleted).Include(d => d.Tasks.Where(t => !t.IsDeleted)).ThenInclude(t => t.Project).Where(d => d.UserName == username).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get developer: {ex}");
                throw new Exception($"Failed to get developer: {ex}");
            }
        }

        public IEnumerable<Entities.Task>? GetDeveloperTasksByUserName(string username)
        {
            try
            {
                var developer = GetDeveloperByUserName(username);
                if (developer == null) return null;

                return developer.Tasks;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get developer tasks: {ex}");
                throw new Exception($"Failed to get developer tasks: {ex}");
            }
        }

        public Entities.Task? GetDeveloperTaskById(string username, int taskId)
        {
            try
            {
                var developer = GetDeveloperByUserName(username);
                if (developer == null) return null;

                return developer.Tasks.Where(t => !t.IsDeleted).Where(t => t.Id == taskId).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to get developer task: {ex}");
                throw new Exception($"Failed to get developer task: {ex}");
            }
        }

    }
}
