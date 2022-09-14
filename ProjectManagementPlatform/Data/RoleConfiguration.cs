using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ProjectManagementPlatform.Data
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole<int>>
    {
        public void Configure(EntityTypeBuilder<IdentityRole<int>> builder)
        {
            builder.HasData(
                new IdentityRole<int>
                {
                    Id = 1,
                    Name = "ProjectManager",
                    NormalizedName = "PROJECTMANAGER"
                },
                new IdentityRole<int>
                {
                    Id = 2,
                    Name = "Developer",
                    NormalizedName = "DEVELOPER"
                }
            );
        }
    }
}
