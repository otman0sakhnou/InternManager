﻿using FluentMigrator;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Deployment.Migrations
{
    //create schema
    [Migration(2024081201)]
    public class CreateSchema : Migration
    {
        public override void Up()
        {
            var conf = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build();
            var connectionString = conf.GetConnectionString("DefaultConnection");

            var createDatabaseQuery = $@"
            IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'InternManagerDb3')
            BEGIN
                CREATE DATABASE [InternManagerDb3];
            END";

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (var command = new SqlCommand(createDatabaseQuery, connection))
                {
                    command.ExecuteNonQuery();
                }
            }
            Execute.Sql(File.ReadAllText("Scripts/CreateSchema.sql"));
        }

        public override void Down()
        {
            Execute.Sql(File.ReadAllText("Scripts/DropTables.sql"));
        }
    }
}