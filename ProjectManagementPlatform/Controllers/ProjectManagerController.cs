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
    [Route("api/projectManagers")]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "ProjectManager")]
    public class ProjectManagerController : ControllerBase
    {
        private readonly IRepository _repository;
        private readonly ILogger<ProjectManagerController> _logger;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public ProjectManagerController(IRepository repository, ILogger<ProjectManagerController> logger, IMapper mapper, UserManager<User> userManager)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpGet]
        public object Get()
        {
            try
            {
                var projectManagers = _repository.GetProjectManagers();
                return _mapper.Map<IEnumerable<ProjectManager>, IEnumerable<ProjectManagerModel>>(projectManagers);
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to get project managers: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpGet, Route("{username}")]
        public object Get(string username)
        {
            try
            {
                var projectManager = _repository.GetProjectManagerByUserName(username);
                if (projectManager != null) {
                    return _mapper.Map<ProjectManager, ProjectManagerModel>(projectManager);
                } 
                else
                {
                    _logger.LogError("404: Project manager not found");
                    return NotFound("user-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to get project manager: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public object Register([FromBody] ProjectManagerModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var projectManager = _mapper.Map<ProjectManagerModel, ProjectManager>(model);
                    _userManager.CreateAsync(projectManager, model.Password).Wait();
                    var result = _userManager.AddToRoleAsync(projectManager, "ProjectManager").Result;
                    
                    if (!result.Succeeded)
                    {
                        _logger.LogError($"400: Could not register project manager: {result.Errors}");
                        return BadRequest($"could-not-register: {result.Errors}");
                    }
                    return Ok();
                }
                else
                {
                    _logger.LogError($"400: Could not register project manager: {ModelState}");
                    return BadRequest($"invalid-fields: {ModelState}");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to register project manager: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpPut, Route("{id}")]
        public object Put(int id, [FromBody] ProjectManagerModel model)
        {
            try
            {
                var projectManager = _repository.GetProjectManagerById(id);
                if (projectManager != null)
                {
                    _mapper.Map(model, projectManager);
                    var result = _userManager.UpdateAsync(projectManager).Result;
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
                        var token = _userManager.GeneratePasswordResetTokenAsync(projectManager).Result;
                        var password = _userManager.ResetPasswordAsync(projectManager, token, model.Password).Result;
                        if (!password.Succeeded)
                        {
                            _logger.LogError($"400: Could not change password: {password.Errors.FirstOrDefault()!.Code}");
                            return BadRequest("could-not-change-password");
                        }
                    }

                    return _mapper.Map<ProjectManager, ProjectManagerModel>(projectManager);
                }
                else
                {
                    _logger.LogError("404: Project manager not found");
                    return NotFound("user-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to update project manager: {ex}");
                return Problem("internal-error");
            }
        }

        [HttpDelete, Route("{id}")]
        public object Delete(int id)
        {
            try
            {
                var projectManager = _repository.GetProjectManagerById(id);
                if (projectManager != null)
                {
                    _repository.DeleteUser(projectManager);
                    _repository.SaveAll();
                    return Ok();
                }
                else
                {
                    _logger.LogError("404: Project manager not found");
                    return NotFound("user-not-found");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to delete project manager: {ex}");
                return Problem("internal-error");
            }
        }
    }
}
