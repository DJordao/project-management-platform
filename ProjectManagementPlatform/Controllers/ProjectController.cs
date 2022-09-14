using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementPlatform.Data;
using ProjectManagementPlatform.Data.Entities;
using ProjectManagementPlatform.Models;

namespace ProjectManagementPlatform.Controllers
{
    [Route("api/projects")]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "ProjectManager")]
    public class ProjectController : ControllerBase
    {
        private readonly IRepository _repository;
        private readonly ILogger<ProjectController> _logger;
        private readonly IMapper _mapper;

        public ProjectController(IRepository repository, ILogger<ProjectController> logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }
 
        [HttpGet]
        public object Get()
        {
            try
            {
                var result = _repository.GetProjects();
                return _mapper.Map<IEnumerable<Project>, IEnumerable<ProjectModel>>(result);

            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to get projects: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpGet, Route("{id}")]
        public object Get(int id)
        {
            try
            {
                var result = _repository.GetProjectById(id);
                if (result != null)
                {
                    return _mapper.Map<Project, ProjectModel>(result);
                }
                else
                {
                    _logger.LogError("404: Project not found");
                    return NotFound("project-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to get project: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpPost]
        public object Post([FromBody] ProjectModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var newProject = _mapper.Map<ProjectModel, Project>(model);
                    var projectManager = _repository.GetProjectManagerByUserName(model.ProjectManagerUserName);

                    if(projectManager != null)
                    {
                        newProject.ProjectManager = projectManager;
                        _repository.AddEntity(newProject);
                        _repository.SaveAll();
                        return _mapper.Map<Project, ProjectModel>(newProject);
                    }
                    else
                    {
                        _logger.LogError("400: Project manager no longer exists");
                        return BadRequest("project-manager-deleted");
                    }
                }
                else
                {
                    _logger.LogError($"400: Could not add project: {ModelState}");
                    return BadRequest($"invalid-fields: {ModelState}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to add project: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpPut, Route("{id}")]
        public object Put(int id, [FromBody] ProjectModel model)
        {
            try
            {
                var project = _repository.GetProjectById(id);
                if (project != null) 
                {
                    if (model.ProjectManagerUserName != project.ProjectManager.UserName && model.ProjectManagerUserName != string.Empty)
                    {
                        var projectManager = _repository.GetProjectManagerByUserName(model.ProjectManagerUserName);
                        if (projectManager != null)
                        {
                            project.ProjectManager = projectManager;
                        }
                        else
                        {
                            _logger.LogError("404: Project manager not found");
                            return NotFound("user-not-found");
                        }
                    }

                    model.ProjectManagerUserName = project.ProjectManager.UserName;
                    _mapper.Map(model, project);
                    _repository.SaveAll();
                    return _mapper.Map<Project, ProjectModel>(project);
                } 
                else
                {
                    _logger.LogError("404: Project not found");
                    return NotFound("project-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to update project: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpDelete, Route("{id}")]
        public object Delete(int id)
        {
            try
            {
                var project = _repository.GetProjectById(id);
                if (project != null)
                {
                    _repository.DeleteProject(project);
                    _repository.SaveAll();
                    return Ok();
                }
                else
                {
                    _logger.LogError("404: Project not found");
                    return NotFound("project-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to delete project: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpGet, Route("{id}/tasks")]
        public object GetTasks(int id)
        {
            try
            {
                var tasks = _repository.GetProjectTasksById(id);
                if (tasks != null)
                {
                    return _mapper.Map<IEnumerable<Data.Entities.Task>, IEnumerable<TaskModel>>(tasks);
                }
                else
                {
                    _logger.LogError("404: Project not found");
                    return NotFound("project-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to get project tasks: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpGet, Route("{id}/tasks/{taskId}")]
        public object GetTask(int id, int taskId)
        {
            try
            {
                var task = _repository.GetProjectTaskById(id, taskId);
                if (task != null)
                {
                    return _mapper.Map<Data.Entities.Task, TaskModel>(task);
                }
                else
                {
                    _logger.LogError("404: Task not found");
                    return NotFound("task-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to get project tasks: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpPost, Route("{id}/tasks")]
        public object PostTask(int id, [FromBody] TaskModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var project = _repository.GetProjectById(id);
                    if (project != null)
                    {
                        var newTask = _mapper.Map<TaskModel, Data.Entities.Task>(model);
                        newTask.Project = project;
                        var developer = _repository.GetDeveloperById((int)model.DeveloperId!);
                        if(developer != null)
                        {
                            newTask.Developer = developer;

                            _repository.AddEntity(newTask);
                            _repository.SaveAll();
                            return _mapper.Map<Data.Entities.Task, TaskModel>(newTask);
                        }
                        else
                        {
                            _logger.LogError("404: Developer not found");
                            return NotFound("user-not-found");
                        }
                    }
                    else
                    {
                        _logger.LogError("404: Project not found");
                        return NotFound("project-not-found");
                    }
                }
                else
                {
                    _logger.LogError($"400: Could not add task: {ModelState}");
                    return BadRequest($"invalid-fields: {ModelState}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to add task: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpPut, Route("{id}/tasks/{taskId}")]
        public object PutTask(int id, int taskId, [FromBody] TaskModel model)
        {
            try
            {
                var task = _repository.GetProjectTaskById(id, taskId);
                if (task != null)
                {
                    
                    if(model.DeveloperUserName != task.Developer.UserName)
                    {
                        var developer = _repository.GetDeveloperByUserName(model.DeveloperUserName);
                        if(developer != null)
                        {
                            task.Developer = developer;
                        } 
                        else
                        {
                            _logger.LogError("400: Developer not found");
                            return BadRequest("user-not-found");
                        }
                    }

                    model.ProjectName = task.Project.Name;
                    _mapper.Map(model, task);
                    _repository.SaveAll();
                    
                    return _mapper.Map<Data.Entities.Task, TaskModel>(task);
                }
                else
                {
                    _logger.LogError("404: Task not found");
                    return NotFound("task-not-found");
                }  
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to update task: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpDelete, Route("{id}/tasks/{taskId}")]
        public object DeleteTask(int id, int taskId)
        {
            try
            {
                var task = _repository.GetProjectTaskById(id, taskId);
                if (task != null)
                {
                    _repository.DeleteTask(task);
                    _repository.SaveAll();
                    return Ok();
                }
                else
                {
                    _logger.LogError("404: Task not found");
                    return NotFound("task-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to delete task: {ex}");
                return Problem("internal-error");
            }
        }
    }
}
