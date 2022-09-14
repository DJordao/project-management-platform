using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using ProjectManagementPlatform.Data;
using ProjectManagementPlatform.Data.Entities;
using System.Reflection;

namespace ProjectManagementPlatform
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            
            // Add services to the container.
            builder.Services.AddDbContext<Context>();
            builder.Services.AddTransient<Seeder>();
            builder.Services.AddControllersWithViews();
            builder.Services.AddTransient<IRepository, Repository>();
            builder.Services.AddIdentity<User, IdentityRole<int>>(cfg =>
            {
                cfg.User.RequireUniqueEmail = false;
                cfg.Password.RequireNonAlphanumeric = true;
                cfg.Password.RequireUppercase = true;
                cfg.Password.RequireLowercase = true;
                cfg.Password.RequiredLength = 8;
                cfg.Password.RequireDigit = true;
            }).AddEntityFrameworkStores<Context>().AddDefaultTokenProviders();
            builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
                {
                    options.Cookie.HttpOnly = false;
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
                    options.LoginPath = "/login";
                    options.Events.OnRedirectToLogin = (context) =>
                    {
                        context.Response.StatusCode = 401;
                        return System.Threading.Tasks.Task.CompletedTask;
                    };
                    options.AccessDeniedPath = "/";
                    options.Events.OnRedirectToAccessDenied = (context) =>
                    {
                        context.Response.StatusCode = 403;
                        return System.Threading.Tasks.Task.CompletedTask;
                    };
                });

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins("https://localhost:44495", "https://localhost:5288")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod()
                                            .AllowCredentials();
                    });
            });

            

            var app = builder.Build();

            var scopeFactory = app.Services.GetService<IServiceScopeFactory>();
            using (var scope = scopeFactory!.CreateScope())
            {
                var seeder = scope.ServiceProvider.GetService<Seeder>();
                seeder!.Seed();
            }
            

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}