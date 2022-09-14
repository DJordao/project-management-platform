using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ProjectManagementPlatform.Data.Entities
{
    public class User : IdentityUser<int>
    {
        [MaxLength(64)]
        public string FullName { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
        public DateTime DeletedAt { get; set; }
    }
}
