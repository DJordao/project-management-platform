using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementPlatform.Data;
using ProjectManagementPlatform.Data.Entities;
using ProjectManagementPlatform.Models;

namespace ProjectManagementPlatform.Controllers
{
    [Route("api/developers")]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class DeveloperController : ControllerBase
    {
        private readonly IRepository _repository;
        private readonly ILogger<DeveloperController> _logger;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public DeveloperController(IRepository repository, ILogger<DeveloperController> logger, IMapper mapper, UserManager<User> userManager)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = "ProjectManager")]
        public object Get()
        {
            try
            {
                var developers = _repository.GetDevelopers();
                return _mapper.Map<IEnumerable<Developer>, IEnumerable<DeveloperModel>>(developers);    
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to get developers: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpGet, Route("{username}")]
        [Authorize(Roles = "Developer")]
        public object Get(string username)
        {
            try
            {
                var developer = _repository.GetDeveloperByUserName(username);
                if (developer != null)
                {
                    return _mapper.Map<Developer, DeveloperModel>(developer);
                }
                else
                {
                    _logger.LogError("404: Developer not found");
                    return NotFound("user-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to get developer: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpGet, Route("{username}/tasks")]
        [Authorize(Roles = "Developer")]
        public object GetTasks(string username)
        {
            try
            {
                var tasks = _repository.GetDeveloperTasksByUserName(username);
                if (tasks != null)
                {
                    return _mapper.Map<IEnumerable<Data.Entities.Task>, IEnumerable<TaskModel>>(tasks);
                }
                else
                {
                    _logger.LogError("404: Developer not found");
                    return NotFound("user-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to get developer tasks: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpGet, Route("{username}/tasks/{taskId}")]
        [Authorize(Roles = "Developer")]
        public object GetTaskById(string username, int taskId)
        {
            try
            {
                var task = _repository.GetDeveloperTaskById(username, taskId);
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
                _logger.LogError($"500: Failed to get task: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public object Register([FromBody] DeveloperModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var developer = _mapper.Map<DeveloperModel, Developer>(model);
                    _userManager.CreateAsync(developer, model.Password).Wait();
                    var result = _userManager.AddToRoleAsync(developer, "Developer").Result;
                    if (!result.Succeeded)
                    {
                        _logger.LogError($"400: Could not register developer: {result.Errors}");
                        return BadRequest($"could-not-register: {result.Errors}");
                    }
                    return Ok();
                }
                else
                {
                    _logger.LogError($"400: Could not register developer: {ModelState}");
                    return BadRequest($"invalid-fields: {ModelState}");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to register developer: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpPut, Route("{id}")]
        [Authorize(Roles = "Developer")]
        public object Put(int id, [FromBody] DeveloperModel model)
        {
            try
            {
                var developer = _repository.GetDeveloperById(id);
                if (developer != null)
                {
                    _mapper.Map(model, developer);
                    var result = _userManager.UpdateAsync(developer).Result;
                    if (!result.Succeeded)
                    {
                        var code = result.Errors.FirstOrDefault()!.Code;
                        _logger.LogError($"400: Could not update user: {code}");
                        if (code == "DuplicateEmail")
                        {
                            return BadRequest("duplicate-email");
                        }
                        else if (code == "DuplicateUserName")
                        {
                            return BadRequest("duplicate-username");
                        }
                        else
                        {
                            return BadRequest("could-not-update-user");
                        }
                    }

                    if (model.Password != "")
                    {
                        var token = _userManager.GeneratePasswordResetTokenAsync(developer).Result;
                        var password = _userManager.ResetPasswordAsync(developer, token, model.Password).Result;
                        if (!password.Succeeded)
                        {
                            _logger.LogError($"400: Could not change password: {password.Errors.FirstOrDefault()!.Code}");
                            return BadRequest("could-not-change-password");
                        }
                    }
                    
                    return _mapper.Map<Developer, DeveloperModel>(developer);
                }
                else
                {
                    _logger.LogError("404: Developer not found");
                    return NotFound("user-not-found");
                }
                
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to update developer: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpPut, Route("{username}/tasks/{taskId}")]
        [Authorize(Roles = "Developer")]
        public object UpdateTaskState(string username, int taskId)
        {
            try
            {
                var task = _repository.GetDeveloperTaskById(username, taskId);
                if (task != null)
                {
                    task.State = !task.State;
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
                _logger.LogError($"500: Failed to update task state: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpDelete, Route("{id}")]
        [Authorize(Roles = "Developer")]
        public object Delete(int id)
        {
            try
            {
                var developer = _repository.GetDeveloperById(id);
                if (developer != null)
                {
                    _repository.DeleteUser(developer);
                    _repository.SaveAll();
                    return Ok();
                }
                else
                {
                    _logger.LogError("404: Developer not found");
                    return NotFound("user-not-found");
                }   
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to delete developer: {ex}");
                return Problem("internal-error");
            }
        }
    }
}
