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
            optionsBuilder.UseSqlServer("Data Source=DESKTOP-L1KJOGA\\SQLEXPRESS01;Initial Catalog=InternManagerDb2;Integrated Security=True;TrustServerCertificate=True");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
