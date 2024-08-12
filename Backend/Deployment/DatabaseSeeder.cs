// Deployment/Seeders/DatabaseSeeder.cs

using System;
using System.Linq;
using System.Threading.Tasks;
using Domain.Models;
using Infrastructure.Data.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Deployment.Seeders
{
    public class DatabaseSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<DatabaseSeeder> _logger;

        public DatabaseSeeder(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger<DatabaseSeeder> logger)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            if (await _context.Roles.AnyAsync() ||
                await _context.Users.AnyAsync() ||
                await _context.Collaborators.AnyAsync())
            {
                _logger.LogInformation("Database has already been seeded. No further seeding required.");
                return;
            }

            // Create roles
            _logger.LogInformation("Creating roles...");
            var collaboratorRole = new IdentityRole("Collaborator");
            var managerRole = new IdentityRole("Manager");
            var adminRole = new IdentityRole("Admin");

            await _roleManager.CreateAsync(collaboratorRole);
            await _roleManager.CreateAsync(managerRole);
            await _roleManager.CreateAsync(adminRole);

            // Create users
            _logger.LogInformation("Creating users...");
            var user1 = new ApplicationUser
            {
                UserName = "johndoe@example.com",
                Email = "johndoe@example.com",
            };

            var user2 = new ApplicationUser
            {
                UserName = "janedoe@example.com",
                Email = "janedoe@example.com",
            };

            var result1 = await _userManager.CreateAsync(user1, "Password123!");
            var result2 = await _userManager.CreateAsync(user2, "Password123!");

            if (!result1.Succeeded || !result2.Succeeded)
            {
                _logger.LogError("Failed to create users.");
                throw new Exception("Failed to create users.");
            }

            // Assign roles to users
            _logger.LogInformation("Assigning roles to users...");
            await _userManager.AddToRoleAsync(user1, "Collaborator");
            await _userManager.AddToRoleAsync(user2, "Manager");


            _logger.LogInformation("Creating collaborators...");
            var collaborator1 = new Collaborator
            {
                Id = Guid.NewGuid(),
                Name = "John Doe",
                Phone = "+1234567890",
                Title = "Software Engineer",
                Department = "Development",
                Organization = "Tech Corp",
                EmploymentDate = DateTime.Now.AddYears(-5),
                Gender = "Male",
                UserId = user1.Id 
            };

            var collaborator2 = new Collaborator
            {
                Id = Guid.NewGuid(),
                Name = "Jane Doe",
                Phone = "+0987654321",
                Title = "Project Manager",
                Department = "Management",
                Organization = "Tech Corp",
                EmploymentDate = DateTime.Now.AddYears(-3),
                Gender = "Female",
                UserId = user2.Id
            };

            _context.Collaborators.AddRange(collaborator1, collaborator2);

            await _context.SaveChangesAsync();

            _logger.LogInformation("Database seeding completed.");
        }
    }
}
