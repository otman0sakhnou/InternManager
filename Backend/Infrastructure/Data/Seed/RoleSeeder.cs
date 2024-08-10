using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Seed
{
    public class RoleSeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleSeeder(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task SeedRolesAsync()
        {
            var roles = new[] { "Admin", "Manager", "Collaborator", "Intern" };

            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
