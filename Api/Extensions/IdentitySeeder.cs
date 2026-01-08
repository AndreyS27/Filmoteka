using Api.Models;
using Microsoft.AspNetCore.Identity;

namespace Api.Extensions
{
    public static class IdentitySeeder
    {
        public static async Task SeedRolesAndAdminAsync(this WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

                var adminRole = "Admin";
                var userRole = "User";

                if (!await roleManager.RoleExistsAsync(adminRole))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(adminRole));
                }
                if (!await roleManager.RoleExistsAsync(userRole))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(userRole));
                }

                var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                var adminEmail = configuration["AdminUser:Email"];
                var adminPassword = configuration["AdminUser:Password"];

                var adminUser = await userManager.FindByEmailAsync(adminEmail);
                if (adminUser == null)
                {
                    var newAdminUser = new User { UserName = "admin", Email = adminEmail };
                    var result = await userManager.CreateAsync(newAdminUser, adminPassword);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(newAdminUser, adminRole);
                    }
                }
            }
        }
    }
}
