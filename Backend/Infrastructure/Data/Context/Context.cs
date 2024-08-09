using Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Data.Context
{
    public class Context : IdentityDbContext<ApplicationUser>
    {
       
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }
        public DbSet<Collaborator> Collaborators { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Intern> Interns { get; set; }
        public DbSet<Period> Periods { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Step> Steps { get; set; }
        public DbSet<InternStep> InternSteps { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }

       

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //Logger
            modelBuilder.Entity<LogEntry>().ToTable("Logs");

            // One-to-Many: Group -> Subject
            modelBuilder.Entity<Subject>()
                .HasOne(s => s.Group)
                .WithMany(g => g.Subjects)
                .HasForeignKey(s => s.GroupId)
                .OnDelete(DeleteBehavior.Cascade);


            // One-to-Many: Subject -> Step
            modelBuilder.Entity<Step>()
                .HasOne(st => st.Subject)
                .WithMany(s => s.Steps)
                .HasForeignKey(st => st.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Group -> Period
            modelBuilder.Entity<Period>()
                .HasOne(p => p.Group)
                .WithMany(g => g.Periods)
                .HasForeignKey(p => p.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Intern -> Period
            modelBuilder.Entity<Period>()
                .HasOne(p => p.Intern)
                .WithMany(i => i.Periods)
                .HasForeignKey(p => p.InternId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Collaborator -> Group
            modelBuilder.Entity<Group>()
               .HasOne(c => c.Collaborator)
               .WithMany(g => g.Groups)
               .HasForeignKey(c => c.CollaboratorId)
               .OnDelete(DeleteBehavior.Cascade);

            // Many-to-Many: Intern -> Step through InternStep
            modelBuilder.Entity<InternStep>()
                .HasKey(ints => new { ints.InternId, ints.StepId });

            modelBuilder.Entity<InternStep>()
                .HasOne(ints => ints.Intern)
                .WithMany(i => i.InternSteps)
                .HasForeignKey(ints => ints.InternId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<InternStep>()
                .HasOne(ints => ints.Step)
                .WithMany(s => s.InternSteps)
                .HasForeignKey(ints => ints.StepId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-One: Intern -> ApplicationUser
            modelBuilder.Entity<Intern>()
                .HasOne(i => i.User)
                .WithOne()
                .HasForeignKey<Intern>(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-One: Collaborator -> ApplicationUser
            modelBuilder.Entity<Collaborator>()
                .HasOne(c => c.User)
                .WithOne()
                .HasForeignKey<Collaborator>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuring Primary Keys
            modelBuilder.Entity<Collaborator>()
                .HasKey(c => c.Id);

            modelBuilder.Entity<Group>()
                .HasKey(g => g.Id);

            modelBuilder.Entity<Intern>()
                .HasKey(i => i.Id);

            modelBuilder.Entity<Period>()
                .HasKey(p => p.Id);

            modelBuilder.Entity<Subject>()
                .HasKey(s => s.Id);

            modelBuilder.Entity<Step>()
                .HasKey(st => st.Id);

            modelBuilder.Entity<InternStep>()
                .HasKey(ints => ints.Id);

        }
    }
}
