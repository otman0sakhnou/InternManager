using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeGroupIdNullableInPeriods : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
            name: "GroupId",
            table: "Periods",
            type: "uniqueidentifier",
            nullable: true,
            oldClrType: typeof(Guid),
            oldType: "uniqueidentifier");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
           migrationBuilder.AlterColumn<Guid>(
           name: "GroupId",
           table: "Periods",
           type: "uniqueidentifier",
           nullable: false,
           oldClrType: typeof(Guid),
           oldType: "uniqueidentifier",
           oldNullable: true);

        }
    }
}
