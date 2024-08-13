using FluentMigrator;

namespace Deployment.Migrations
{
    [Migration(2024081202)]
    public class SeedData : Migration
    {
        public override void Up()
        {
            Execute.Sql(File.ReadAllText("Scripts/SeedData.sql"));
        }

        public override void Down()
        {
            Execute.Sql(@"
                DELETE FROM InternSteps;
                DELETE FROM Steps;
                DELETE FROM Subjects;
                DELETE FROM Periods;
                DELETE FROM Groups;
                DELETE FROM Interns;
                DELETE FROM Collaborators;
                DELETE FROM AspNetUsers;
                DELETE FROM AspNetRoles;
            ");
        }
    }
}
