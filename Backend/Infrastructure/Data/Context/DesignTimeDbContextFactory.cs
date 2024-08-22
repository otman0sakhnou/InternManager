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
<<<<<<< HEAD
            optionsBuilder.UseSqlServer("Data Source=DESKTOP-KC3KUH9\\SQLEXPRESS;Initial Catalog=InternManagerDb;Integrated Security=True;TrustServerCertificate=True");
=======
            optionsBuilder.UseSqlServer("Data Source=DESKTOP-L1KJOGA\\SQLEXPRESS01;Initial Catalog=InternManagerDb2;Integrated Security=True;TrustServerCertificate=True");
>>>>>>> 58a8276 (Refactor master branch for correct operation)

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
