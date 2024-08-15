using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Deployment.Services
{
    //migration service
    public class MigrationHostedService(IServiceProvider serviceProvider, ILogger<MigrationHostedService> logger) : IHostedService
    {
        private readonly IServiceProvider _serviceProvider = serviceProvider;
        private readonly ILogger<MigrationHostedService> _logger = logger;

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Start applying migration");
            using (var scope = _serviceProvider.CreateScope())
            {

                var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();

                _logger.LogInformation("Pending migrations found. Applying migrations...");
                try
                {
                    runner.MigrateUp();
                }
                catch (Exception ex)
                {
                    _logger.LogInformation(ex.ToString());
                }

            }

            await Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
        }
    }
}
