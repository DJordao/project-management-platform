using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjectManagementPlatform.Data.Entities;

namespace ProjectManagementPlatform.Data
{
    public class Context : IdentityDbContext<User, IdentityRole<int>, int>
    {
        private readonly IConfiguration _config;

        public Context(IConfiguration config)
        {
            _config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            
            optionsBuilder.UseSqlServer(_config.GetConnectionString("ProjectManagementPlatformDB"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new RoleConfiguration());
        }

        public DbSet<ProjectManager> ProjectManager => Set<ProjectManager>();
        public DbSet<Developer> Developer => Set<Developer>();
        public DbSet<Project> Project => Set<Project>();
        public DbSet<Entities.Task> Task => Set<Entities.Task>();
    } 
}
