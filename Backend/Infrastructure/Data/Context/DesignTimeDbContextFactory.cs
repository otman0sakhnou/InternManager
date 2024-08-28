using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Data.Context
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            // Utilisez la chaîne de connexion appropriée pour votre environnement de conception
            optionsBuilder.UseSqlServer("Data Source=DESKTOP-KC3KUH9\\SQLEXPRESS;Initial Catalog=InternManagerDb;Integrated Security=True;TrustServerCertificate=True");
            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
