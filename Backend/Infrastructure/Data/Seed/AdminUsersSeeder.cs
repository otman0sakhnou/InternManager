using Domain.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Seed
{
    public class AdminUsersSeeder
    {
        public static async Task Initialize(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            string adminRole = "Admin";

            // Create the Admin role if it does not exist
            if (!await roleManager.RoleExistsAsync(adminRole))
            {
                await roleManager.CreateAsync(new IdentityRole(adminRole));
            }

            // Define a list of admin users with their details
            var adminUsers = new List<(string Email, string Password)>
        {
            ("admin1@example.com", "Admin@123"),
            ("admin2@example.com", "Admin@123"),
            ("admin3@example.com", "Admin@123")
        };

            foreach (var (email, password) in adminUsers)
            {
                // Create user if it does not exist
                var user = await userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    user = new ApplicationUser
                    {
                        UserName = email,
                        Email = email
                    };

                    var result = await userManager.CreateAsync(user, password);

                    if (result.Succeeded)
                    {
                        // Assign the Admin role to the user
                        await userManager.AddToRoleAsync(user, adminRole);
                    }
                    else
                    {
                        // Handle creation errors (optional)
                        Console.WriteLine($"Failed to create user {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
            }
        }
    }
}
