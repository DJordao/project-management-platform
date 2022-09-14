using Microsoft.AspNetCore.Identity;
using ProjectManagementPlatform.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectManagementPlatform.Data
{
    public class Seeder
    {
        private readonly Context _ctx;
        private ProjectManager _pm = new ProjectManager()
        {
            UserName = "projectManager",
            NormalizedUserName = "PROJECTMANAGER",
            FullName = "Project Manager",
            Email = "project.manager@email.com",
            NormalizedEmail = "PROJECT.MANAGER@EMAIL.COM",
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            SecurityStamp = Guid.NewGuid().ToString(),
            LockoutEnabled = false
        };
        private IdentityUserRole<int> _ur1 = new IdentityUserRole<int>()
        {
            RoleId = 1,
            UserId = 1
        };
        private Developer _d1 = new Developer()
        {
            UserName = "developer1",
            NormalizedUserName = "DEVELOPER1",
            FullName = "Developer 1",
            Email = "developer.1@email.com",
            NormalizedEmail = "DEVELOPER.1@EMAIL.COM",
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            SecurityStamp = Guid.NewGuid().ToString(),
            LockoutEnabled = false
        };
        private Developer _d2 = new Developer()
        {
            UserName = "developer2",
            NormalizedUserName = "DEVELOPER2",
            FullName = "Developer 2",
            Email = "developer.2@email.com",
            NormalizedEmail = "DEVELOPER.2@EMAIL.COM",
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            SecurityStamp = Guid.NewGuid().ToString(),
            LockoutEnabled = false
        };
        private IdentityUserRole<int> _ur2 = new IdentityUserRole<int>()
        {
            RoleId = 2,
            UserId = 2
        };
        private IdentityUserRole<int> _ur3 = new IdentityUserRole<int>()
        {
            RoleId = 2,
            UserId = 3
        };
        private Project _p1 = new Project()
        {
            Name = "Project 1",
            Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis faucibus hendrerit quam, eu tempor turpis porta nec. Fusce condimentum facilisis felis ut cursus. Integer eu diam et sapien gravida convallis. Nulla commodo tellus et eros vulputate, ut viverra.",
            Budget = 10000,
        };
        private Project _p2 = new Project()
        {
            Name = "Project 2",
            Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius rhoncus ex. Fusce lobortis libero quis finibus consectetur. Vivamus maximus eros in venenatis fringilla. Aliquam sed augue facilisis, volutpat odio pellentesque, luctus ligula. Aenean biam.",
            Budget = 250000,
        };
        private Entities.Task _t1 = new Entities.Task()
        {
            Name = "Task 1",
            Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra sapien id sagittis finibus. Duis eu vehicula libero quis.",
            Deadline = new DateTime(2022, 09, 12)
        };
        private Entities.Task _t2 = new Entities.Task()
        {
            Name = "Task 2",
            Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sodales, mi ac elementum convallis, erat justo elementum laoreet.",
            Deadline = new DateTime(2022, 09, 13)
        };
        private Entities.Task _t3 = new Entities.Task()
        {
            Name = "Task 3",
            Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac urna at erat volutpat mattis. Proin et ligula at magna turpis.",
            Deadline = new DateTime(2022, 08, 24)
        };
        private Entities.Task _t4 = new Entities.Task()
        {
            Name = "Task 4",
            Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et pharetra risus, ut laoreet ligula. Nam ac iaculis magna fusce.",
            Deadline = new DateTime(2022, 10, 01)
        };

        public Seeder(Context ctx)
        {
            _ctx = ctx;
        }

        public void Seed()
        {
            try
            {
                if(!_ctx.ProjectManager.Any() && !_ctx.Developer.Any() && !_ctx.Project.Any() && !_ctx.Task.Any())
                {
                    _ctx.Database.EnsureCreated();
                
                    PasswordHasher<ProjectManager> projectManagerHasher = new PasswordHasher<ProjectManager>();
                    _pm.PasswordHash = projectManagerHasher.HashPassword(_pm, "Password123!");

                    _ctx.ProjectManager.Add(_pm);
                    _ctx.SaveChanges();

                    _ctx.UserRoles.Add(_ur1);
                    _ctx.SaveChanges();

                    PasswordHasher<Developer> developerHasher = new PasswordHasher<Developer>();
                    _d1.PasswordHash = developerHasher.HashPassword(_d1, "Password123!");
                    _d2.PasswordHash = developerHasher.HashPassword(_d2, "Password123!");

                    _ctx.Developer.AddRange(_d1, _d2);
                    _ctx.SaveChanges();

                    _ctx.UserRoles.AddRange(_ur2, _ur3);
                    _ctx.SaveChanges();

                    var pm = _ctx.ProjectManager.Find(1)!;

                    _p1.ProjectManager = pm;
                    _p2.ProjectManager = pm;

                    _ctx.Project.AddRange(_p1, _p2);
                    _ctx.SaveChanges();

                    var p1 = _ctx.Project.Find(1)!;
                    var p2 = _ctx.Project.Find(2)!;
                    var d1 = _ctx.Developer.Find(2)!;
                    var d2 = _ctx.Developer.Find(3)!;

                    _t1.Project = p1;
                    _t2.Project = p1;
                    _t3.Project = p2;
                    _t4.Project = p2;

                    _t1.Developer = d1;
                    _t2.Developer = d2;
                    _t3.Developer = d1;
                    _t4.Developer = d2;

                    _ctx.Task.AddRange(_t1, _t2, _t3, _t4);
                    _ctx.SaveChanges();
                }
            }
            catch(Exception)
            {
                return;
            }
        }
    }
}
