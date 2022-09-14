using System.ComponentModel.DataAnnotations;

namespace ProjectManagementPlatform.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        [Required, MaxLength(32)]
        public string? UserName { get; set; }
        [Required, EmailAddress]
        public string? Email { get; set; }
        [Required, MinLength(8)]
        public string? Password { get; set; }
        [MaxLength(64)]
        public string? FullName { get; set; }
    }
}
