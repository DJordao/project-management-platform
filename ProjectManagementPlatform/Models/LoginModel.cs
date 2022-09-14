using System.ComponentModel.DataAnnotations;

namespace ProjectManagementPlatform.Models
{
    public class LoginModel
    {
        [Required, MaxLength(64)]
        public string? UserName { get; set; }
        [Required, MinLength(8)]
        public string? Password { get; set; }
        public bool RememberMe { get; set; } = false;
    }
}
