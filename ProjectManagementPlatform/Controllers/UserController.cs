using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementPlatform.Data.Entities;
using ProjectManagementPlatform.Models;
using System.Security.Claims;

namespace ProjectManagementPlatform.Controllers
{
    [Route("api/auth")]
    public class UserController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly UserManager<User> _userManager;

        public UserController(ILogger<UserController> logger, UserManager<User> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        [HttpPost, Route("login")]
        public object Login([FromBody] LoginModel model)
        {
            try
            {
                var user = _userManager.FindByNameAsync(model.UserName).Result;
                if (user is null || user.IsDeleted)
                {
                    _logger.LogError("400: Wrong username");
                    return BadRequest("wrong-credentials");
                }

                var result = _userManager.CheckPasswordAsync(user, model.Password).Result;
                if (!result)
                {
                    _logger.LogError("400: Wrong password");
                    return BadRequest("wrong-credentials");
                }

                var claims = new List<Claim>
                {
                    new Claim(type: ClaimTypes.Name, value: user.UserName),
                    new Claim(type: ClaimTypes.Email, value: user.Email),
                    new Claim(type: ClaimTypes.Role, value: _userManager.GetRolesAsync(user).Result.FirstOrDefault()!)
                };
                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity),
                    new AuthenticationProperties
                    {
                        IsPersistent = model.RememberMe,
                    }).Wait();

                return new { username = user.UserName, role = _userManager.GetRolesAsync(user).Result };
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to login: {ex}");
                return Problem("internal-error");
            }
        }

        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpPost, Route("logout")]
        public object Logout()
        {
            try
            {
                HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError($"500: Failed to logout: {ex}");
                return Problem("internal-error");
            }
        }
    }
}
